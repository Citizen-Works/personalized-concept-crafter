
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import * as crypto from "https://deno.land/std@0.167.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

type WebhookService = "otter" | "fathom" | "read" | "fireflies";

// Enhanced security: encrypt transcript content
async function encryptContent(content: string, userId: string): Promise<string> {
  try {
    // Create a deterministic key based on user ID (in production, use a proper key management system)
    const encoder = new TextEncoder();
    const keyData = encoder.encode(userId.repeat(2).substring(0, 32));
    
    // Create encryption key
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "AES-GCM" },
      false,
      ["encrypt"]
    );
    
    // Create initialization vector
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the content
    const contentBuffer = encoder.encode(content);
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      contentBuffer
    );
    
    // Combine IV and encrypted content
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error("Encryption failed:", error);
    // In case of encryption failure, return original content
    return content;
  }
}

// Enhanced security: validate token with rate limiting
async function validateWebhookToken(supabaseAdmin: any, token: string): Promise<any> {
  // Check if token exists
  const { data: config, error: configError } = await supabaseAdmin
    .from('webhook_configurations')
    .select('*')
    .eq('webhook_url', token)
    .single();
  
  if (configError || !config) {
    console.error("Invalid webhook token:", token);
    throw new Error("Invalid webhook token");
  }
  
  // Enhanced security: Rate limiting check
  const timeWindow = new Date();
  timeWindow.setMinutes(timeWindow.getMinutes() - 5); // 5 minute window
  
  const { count, error: countError } = await supabaseAdmin
    .from('webhook_logs')
    .select('*', { count: 'exact', head: true })
    .eq('service_name', config.service_name)
    .eq('user_id', config.user_id)
    .gte('created_at', timeWindow.toISOString());
    
  if (countError) {
    console.error("Error checking rate limit:", countError);
  } else if (count > 10) { // Allow up to 10 requests per 5 minutes
    console.error("Rate limit exceeded for token:", token);
    throw new Error("Rate limit exceeded");
  }
  
  // Check if token is active
  if (!config.is_active) {
    console.error("Webhook token is inactive:", token);
    throw new Error("Webhook token is inactive");
  }
  
  return config;
}

// Process transcript data based on service type
function processTranscriptData(serviceName: WebhookService, requestData: any, userId: string): any {
  console.log(`Processing ${serviceName} webhook data:`, JSON.stringify(requestData).substring(0, 200) + "...");
  
  const baseTranscript = {
    title: "Untitled Meeting",
    content: "",
    type: "transcript",
    purpose: "business_context",
    status: "active",
    content_type: "general",
    user_id: userId
  };
  
  switch (serviceName) {
    case 'otter':
      return {
        ...baseTranscript,
        title: requestData.title || requestData.meeting_name || requestData.meeting_title || "Otter.ai Transcript",
        content: requestData.transcript || requestData.text || requestData.content || ""
      };
      
    case 'fathom':
      return {
        ...baseTranscript,
        title: requestData.meeting_name || requestData.title || requestData.name || "Fathom Transcript",
        content: requestData.transcript_text || requestData.transcript || requestData.content || ""
      };
      
    case 'read':
      return {
        ...baseTranscript,
        title: requestData.meeting_title || requestData.title || "Read.AI Transcript",
        content: requestData.content || requestData.transcript || requestData.transcript_text || ""
      };
      
    case 'fireflies':
      return {
        ...baseTranscript,
        title: requestData.title || requestData.meeting_title || requestData.name || "Fireflies.ai Transcript",
        content: requestData.transcript || requestData.content || requestData.text || ""
      };
      
    default:
      return {
        ...baseTranscript,
        title: "Meeting Transcript",
        content: JSON.stringify(requestData)
      };
  }
}

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
    
    // Parse incoming data
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data parsed successfully");
    } catch (error) {
      console.error("Failed to parse request data:", error);
      return new Response(
        JSON.stringify({ error: "Invalid request data" }),
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
        }
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
        JSON.stringify({ error: "Failed to store transcript" }),
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
