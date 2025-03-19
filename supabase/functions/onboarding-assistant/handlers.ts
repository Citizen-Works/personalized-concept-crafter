
import { corsHeaders, validateConfig } from "./config.ts";
import { RequestData, ProfileData } from "./types.ts";
import { processChat, extractProfileData } from "./claudeService.ts";

/**
 * Main request handler for the onboarding assistant
 */
export async function handleRequest(req: Request): Promise<Response> {
  // Validate API key is present
  validateConfig();

  // Parse request data
  const requestData = await req.json() as RequestData;
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
}
