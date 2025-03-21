
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

  try {
    console.log('Calling Claude API with temperature:', temperature);
    
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
      const errorText = await response.text();
      console.error('Claude API error response:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        const errorMessage = errorData.error?.message || `Claude API error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      } catch (parseError) {
        throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    console.log('Claude API response received successfully');
    return data;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}
