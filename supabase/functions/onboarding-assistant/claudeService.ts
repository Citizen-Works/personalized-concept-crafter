
import { 
  CLAUDE_API_KEY, 
  CLAUDE_API_URL, 
  MODEL_NAME, 
  MAX_TOKENS,
  corsHeaders 
} from "./config.ts";
import { ChatMessage, ClaudeResponse, ProfileData } from "./types.ts";
import { getConsultantPrompt, getExtractionPrompt, getProfileContext } from "./prompts.ts";

/**
 * Makes a request to Claude API with the given messages and system prompt
 */
export async function callClaude(
  messages: ChatMessage[], 
  systemPrompt: string
): Promise<string> {
  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY as string,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: messages
    })
  });

  const data = await response.json() as ClaudeResponse;
  
  if (!response.ok) {
    console.error('Claude API error:', data);
    throw new Error(`Claude API error: ${(data as any).error?.message || 'Unknown error'}`);
  }

  return data.content[0].text;
}

/**
 * Process a chat conversation with Claude
 */
export async function processChat(
  messages: ChatMessage[], 
  existingProfileData: ProfileData | null = null
): Promise<string> {
  let systemPrompt = getConsultantPrompt();
  
  // Add context about existing profile data if available
  if (existingProfileData) {
    systemPrompt += '\n\n' + getProfileContext(existingProfileData);
  }
  
  return await callClaude(messages, systemPrompt);
}

/**
 * Extract profile data from a conversation history
 */
export async function extractProfileData(messages: ChatMessage[]): Promise<ProfileData | null> {
  const systemPrompt = getExtractionPrompt();
  const responseText = await callClaude(messages, systemPrompt);
  
  try {
    // Extract the JSON from Claude's response
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      const jsonStr = responseText.substring(jsonStart, jsonEnd);
      return JSON.parse(jsonStr) as ProfileData;
    } else {
      console.error('Could not find JSON in Claude response');
      throw new Error('Could not extract structured profile data');
    }
  } catch (error) {
    console.error('Error parsing profile data JSON:', error);
    throw new Error('Error parsing profile data');
  }
}
