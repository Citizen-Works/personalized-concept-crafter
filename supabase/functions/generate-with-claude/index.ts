
// Update the import to include the new temperature settings
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
  const { systemPrompt, userPrompt, userId, docId, type } = requestData;
  
  try {
    // Use higher temperature for idea extraction
    const temperature = type === 'extract_ideas' ? IDEAS_TEMPERATURE : DEFAULT_TEMPERATURE;
    console.log(`Using temperature ${temperature} for ${type} operation`);
    
    // Call Claude API with the appropriate temperature
    const response = await callClaudeApi(systemPrompt, userPrompt, temperature);
    
    // You can add additional logging or processing here
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
