
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { corsHeaders } from "./config.ts";
import { validateWebhookToken } from "./authUtils.ts";
import { processTranscriptData } from "./processingUtils.ts";
import { encryptContent } from "./encryptionUtils.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

type WebhookService = "otter" | "fathom" | "read" | "fireflies";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Set up Supabase clients
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  try {
    const url = new URL(req.url);
    console.log("Webhook request received at path:", url.pathname);
    console.log("Request method:", req.method);
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));
    
    // Extract the token from the URL path
    // The format expected is /api/webhook/{token} or /{token}
    const pathParts = url.pathname.split('/');
    const serviceToken = pathParts[pathParts.length - 1];
    
    console.log("Extracted token:", serviceToken);
    
    // Enhanced security: Validate token and check rate limiting
    let config;
    try {
      config = await validateWebhookToken(supabaseAdmin, serviceToken);
      console.log("Token validated successfully for service:", config.service_name);
    } catch (error) {
      console.error("Token validation failed:", error.message);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Parse incoming data with improved error handling and payload detection
    let requestData;
    let rawBody = "";
    try {
      rawBody = await req.text();
      console.log(`Raw request body (first 500 chars): ${rawBody.substring(0, 500)}${rawBody.length > 500 ? "..." : ""}`);
      
      // First try to parse as JSON
      try {
        requestData = JSON.parse(rawBody);
        console.log("Successfully parsed request body as JSON with keys:", Object.keys(requestData));
      } catch (jsonError) {
        console.log("Not valid JSON, trying alternate formats:", jsonError.message);
        
        // Look for JSON embedded in other formats like form data
        const jsonMatch = rawBody.match(/(\{.*\})/s);
        if (jsonMatch && jsonMatch[0]) {
          try {
            console.log("Found JSON-like structure in the payload, attempting to parse");
            requestData = JSON.parse(jsonMatch[0]);
            console.log("Successfully extracted embedded JSON with keys:", Object.keys(requestData));
          } catch (embeddedJsonError) {
            console.log("Failed to parse embedded JSON:", embeddedJsonError.message);
          }
        }
        
        // If still not parsed, try form data
        if (!requestData) {
          try {
            console.log("Trying to parse as form data");
            const formData = new URLSearchParams(rawBody);
            
            // Check for a payload parameter which might contain the actual JSON
            if (formData.has("payload")) {
              const payloadStr = formData.get("payload") || "{}";
              try {
                requestData = JSON.parse(payloadStr);
                console.log("Successfully parsed payload parameter as JSON with keys:", Object.keys(requestData));
              } catch (payloadJsonError) {
                console.log("Failed to parse payload as JSON:", payloadJsonError.message);
                requestData = { rawPayload: payloadStr };
              }
            } else {
              // Use the form data directly
              requestData = Object.fromEntries(formData.entries());
              console.log("Using form data as object with keys:", Object.keys(requestData));
            }
          } catch (formDataError) {
            console.log("Failed to parse as form data:", formDataError.message);
          }
        }
        
        // Last resort, treat the entire body as a raw string
        if (!requestData) {
          console.log("Using raw body as a text payload");
          requestData = { 
            content: rawBody,
            rawText: true 
          };
        }
      }
    } catch (error) {
      console.error("Failed to parse request data:", error);
      return new Response(
        JSON.stringify({ error: "Invalid request data", details: error.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const userId = config.user_id;
    const serviceName = config.service_name as WebhookService;
    
    // Log the webhook request with request IP for security auditing
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    await supabaseAdmin.from('webhook_logs').insert({
      user_id: userId,
      service_name: serviceName,
      event_type: 'transcript_received',
      payload: { 
        meta: {
          ip: clientIP,
          timestamp: new Date().toISOString(),
          headers: Object.fromEntries(req.headers.entries())
        },
        data: requestData
      }
    });
    
    console.log(`Processing webhook from ${serviceName} for user ${userId}`);
    
    // Process transcript data based on service
    const processedTranscript = processTranscriptData(serviceName, requestData, userId);
    
    console.log(`Extracted transcript with title: ${processedTranscript.title}, content length: ${processedTranscript.content.length} characters`);
    
    // Enhanced security: Encrypt transcript content
    processedTranscript.content = await encryptContent(processedTranscript.content, userId);
    
    // Add encryption metadata
    processedTranscript.is_encrypted = true;
    
    // Store the transcript as a document
    const { data: document, error: documentError } = await supabaseAdmin
      .from('documents')
      .insert(processedTranscript)
      .select()
      .single();
    
    if (documentError) {
      console.error("Error storing transcript:", documentError);
      return new Response(
        JSON.stringify({ error: "Failed to store transcript", details: documentError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("Transcript stored successfully with ID:", document.id);
    
    // Update the log to mark as processed
    await supabaseAdmin
      .from('webhook_logs')
      .update({ processed: true })
      .eq('user_id', userId)
      .eq('service_name', serviceName)
      .eq('event_type', 'transcript_received')
      .order('created_at', { ascending: false })
      .limit(1);
    
    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: "Transcript received and processed", documentId: document.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Webhook processing error:", error);
    
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
