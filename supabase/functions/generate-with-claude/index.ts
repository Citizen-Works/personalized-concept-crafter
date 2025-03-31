import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { processContentRequest, handleError } from "./handler.ts";
import { corsHeaders } from "./config.ts";

serve(async (req) => {
  // Generate a request ID for tracking this request through the logs
  const requestId = crypto.randomUUID();
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }
  
  try {
    // Log the request with request ID for easier debugging
    console.log(`[${requestId}] Received request: ${req.method} ${req.url}`);
    
    // Extract client IP for audit logging (if needed for multi-tenant scenarios)
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Parse the request body with better error handling
    let requestData;
    try {
      requestData = await req.json();
      console.log(`[${requestId}] Successfully parsed request JSON:`, {
        taskType: requestData.taskType,
        hasPrompt: !!requestData.prompt,
        hasApiKey: !!requestData.apiKey
      });
    } catch (error) {
      console.error(`[${requestId}] Error parsing request JSON:`, error);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          requestId // Return request ID for client-side error tracking
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Add request ID to the request data for tracking
    requestData.requestId = requestId;
    
    // Process the request and generate content
    const response = await processContentRequest(requestData);
    
    // Add performance metrics if needed
    response.processingTime = new Date().toISOString();
    
    // Return the response
    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    return handleError(
      error instanceof Error ? error : new Error(String(error)), 
      corsHeaders
    );
  }
});
