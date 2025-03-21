
import { CLAUDE_API_KEY, CLAUDE_API_URL, MODEL_NAME, MAX_TOKENS, DEFAULT_TEMPERATURE } from "./config.ts";

/**
 * Makes a request to the Claude API
 */
export async function callClaudeApi(userPrompt: string, temperature = DEFAULT_TEMPERATURE) {
  if (!CLAUDE_API_KEY) {
    throw new Error('CLAUDE_API_KEY is not set');
  }

  // Create a system prompt that provides general guidance
  const systemPrompt = 'You are an expert content creator that generates high-quality, engaging content based on specific instructions.';

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      max_tokens: MAX_TOKENS,
      temperature: temperature,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || `Claude API error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  
  // Ensure we return a string, not an object
  if (data.content && Array.isArray(data.content) && data.content.length > 0) {
    // Handle the case where content might be an array of content objects
    const contentItem = data.content[0];
    if (typeof contentItem === 'object' && contentItem.text) {
      // If content has a text property, return that
      return { content: contentItem.text };
    }
  }
  
  // Return the data as is if we couldn't extract text
  return data;
}
