
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const pathParts = url.pathname.split('/');
    const serviceToken = pathParts[pathParts.length - 1];
    
    // Validate token and identify user
    const { data: config, error: configError } = await supabaseAdmin
      .from('webhook_configurations')
      .select('*')
      .eq('webhook_url', serviceToken)
      .single();
    
    if (configError || !config) {
      console.error("Invalid webhook token:", serviceToken);
      return new Response(
        JSON.stringify({ error: "Invalid webhook token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Parse incoming data
    const requestData = await req.json();
    const userId = config.user_id;
    const serviceName = config.service_name as WebhookService;
    
    // Log the webhook request
    await supabaseAdmin.from('webhook_logs').insert({
      user_id: userId,
      service_name: serviceName,
      event_type: 'transcript_received',
      payload: requestData,
    });
    
    // Extract transcript data based on service
    let processedTranscript: any = {
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
        processedTranscript.title = requestData.title || "Otter.ai Transcript";
        processedTranscript.content = requestData.transcript || "";
        break;
      case 'fathom':
        processedTranscript.title = requestData.meeting_name || "Fathom Transcript";
        processedTranscript.content = requestData.transcript_text || "";
        break;
      case 'read':
        processedTranscript.title = requestData.meeting_title || "Read.AI Transcript";
        processedTranscript.content = requestData.content || "";
        break;
      case 'fireflies':
        processedTranscript.title = requestData.title || "Fireflies.ai Transcript";
        processedTranscript.content = requestData.transcript || "";
        break;
      default:
        processedTranscript.title = "Meeting Transcript";
        processedTranscript.content = JSON.stringify(requestData);
    }
    
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
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
