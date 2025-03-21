
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { processContentRequest, handleError } from "./handler.ts";
import { corsHeaders } from "./config.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }
  
  try {
    // Log the request for debugging
    console.log(`Received request: ${req.method} ${req.url}`);
    
    // Parse the request body
    let requestData;
    try {
      requestData = await req.json();
      console.log('Successfully parsed request JSON');
    } catch (error) {
      console.error('Error parsing request JSON:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Process the request and generate content
    const response = await processContentRequest(requestData);
    
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
    return handleError(error instanceof Error ? error : new Error(String(error)), corsHeaders);
  }
});
