
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// OpenAI Whisper API endpoint
const WHISPER_API_URL = "https://api.openai.com/v1/audio/transcriptions";

// Helper function to process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const { audio, fileType } = await req.json();
    
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

    const audioDataLength = audio.length;
    console.log(`Processing audio data of length: ${audioDataLength}`);
    
    if (audioDataLength < 100) {
      return new Response(
        JSON.stringify({ 
          error: "Audio data too short or invalid" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Convert base64 to binary using chunked processing to avoid memory issues
    const binaryAudio = processBase64Chunks(audio);
    
    // Check if we have a valid binary audio
    if (!binaryAudio || binaryAudio.length === 0) {
      console.error("Failed to process audio data");
      return new Response(
        JSON.stringify({ 
          error: "Failed to process audio data" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Determine content type - default to webm if not specified
    const contentType = fileType || "audio/webm";
    console.log(`Using content type: ${contentType}`);
    
    // Create form data for Whisper API
    const formData = new FormData();
    formData.append("file", new Blob([binaryAudio], { type: contentType }), "audio.webm");
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
    
    // Log API response status for debugging
    console.log(`Whisper API response status: ${openaiResponse.status}`);
    
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
