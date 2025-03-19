import { corsHeaders, validateConfig } from "./config.ts";
import { RequestData, ProfileData } from "./types.ts";
import { processChat, extractProfileData } from "./claudeService.ts";

/**
 * Main request handler for the onboarding assistant
 */
export async function handleRequest(req: Request): Promise<Response> {
  try {
    validateConfig();

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requestData: RequestData = await req.json();
    console.log('Request data received:', JSON.stringify(requestData, null, 2));

    // Extract the needed data
    const { messages, userId, existingProfileData, extractProfile } = requestData;

    console.log(`Processing onboarding assistant request for user ${userId}`);
    console.log(`Extract profile: ${extractProfile}`);
    console.log(`Sending ${messages.length} messages to Claude`);

    // Handle the request based on the mode
    let result = {};
    
    if (extractProfile) {
      try {
        // Extract profile data from the conversation
        const profileData = await extractProfileData(messages);
        
        result = {
          message: "Profile data extracted successfully",
          profileData
        };
      } catch (error) {
        console.error('Error extracting profile data:', error);
        result = {
          message: "Error extracting profile data",
          error: error.message
        };
      }
    } else {
      // Regular chat response
      try {
        const message = await processChat(messages, existingProfileData || null);
        
        result = {
          message
        };
      } catch (error) {
        console.error('Error getting chat response:', error);
        throw error;
      }
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in request handler:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
