
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// OpenAI Whisper API endpoint
const WHISPER_API_URL = "https://api.openai.com/v1/audio/transcriptions";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const { audio } = await req.json();
    
    if (!audio) {
      console.error("No audio data provided");
      return new Response(
        JSON.stringify({ 
          error: "No audio data provided" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log(`Processing audio data of length: ${audio.length}`);
    
    // Convert base64 to binary
    const binaryAudio = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
    
    // Create form data for Whisper API
    const formData = new FormData();
    formData.append("file", new Blob([binaryAudio], { type: "audio/webm" }), "audio.webm");
    formData.append("model", "whisper-1");
    formData.append("language", "en");
    formData.append("response_format", "json");
    
    // Make API request to OpenAI Whisper
    const openaiResponse = await fetch(WHISPER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`
      },
      body: formData
    });
    
    // Handle API errors
    if (!openaiResponse.ok) {
      const errorBody = await openaiResponse.text();
      console.error(`Whisper API error: ${openaiResponse.status}`, errorBody);
      
      return new Response(
        JSON.stringify({ 
          error: `Transcription service error: ${openaiResponse.statusText}`,
          details: errorBody
        }),
        { 
          status: openaiResponse.status, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Process and return the transcription
    const transcription = await openaiResponse.json();
    
    console.log("Transcription completed successfully");
    
    return new Response(
      JSON.stringify({ 
        text: transcription.text
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in transcribe-audio function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to process audio: " + (error.message || "Unknown error") 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
