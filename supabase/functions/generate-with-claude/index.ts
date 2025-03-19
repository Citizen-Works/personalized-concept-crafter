
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders, validateConfig } from "./config.ts";
import { processContentRequest, handleError } from "./handler.ts";

serve(async (req) => {
  console.log("Function generate-with-claude received a request");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response(null, { 
      headers: corsHeaders 
    });
  }

  try {
    // Validate that required environment variables are set
    validateConfig();

    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
      console.log("Successfully parsed request JSON");
    } catch (parseError) {
      console.error("Failed to parse request JSON:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Process the request and generate content
    const result = await processContentRequest(requestData);
    
    // Return successful response
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return handleError(error);
  }
});
