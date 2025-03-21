
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callClaudeApi } from "./claudeService.ts";
import { DEFAULT_TEMPERATURE, IDEAS_TEMPERATURE } from "./config.ts";
import { supabaseClient } from "./supabaseClient.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Parse the request body
  const requestData = await req.json();
  const { prompt, contentType, idea, task } = requestData;
  
  try {
    // Validate the prompt to make sure it's a string
    if (!prompt || typeof prompt !== 'string') {
      throw new Error("Invalid prompt format: prompt must be a string");
    }
    
    // Use higher temperature for idea extraction
    const temperature = contentType === 'structured_content_ideas' || task === 'extract_ideas' 
      ? IDEAS_TEMPERATURE 
      : DEFAULT_TEMPERATURE;
    
    console.log(`Using temperature ${temperature} for ${contentType || task} operation`);
    
    // Call Claude API with the appropriate temperature
    const response = await callClaudeApi(prompt, temperature);
    
    // Log success
    console.log("Generation successful");
    
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
    console.error(`Error in Claude API request: ${error.message}`);
    
    // Return error response
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
