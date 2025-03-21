
import { CLAUDE_API_KEY, CLAUDE_API_URL, MODEL_NAME, MAX_TOKENS, DEFAULT_TEMPERATURE } from "./config.ts";

/**
 * Makes a request to the Claude API
 */
export async function callClaudeApi(systemPrompt: string, userPrompt: string, temperature = DEFAULT_TEMPERATURE) {
  if (!CLAUDE_API_KEY) {
    throw new Error('CLAUDE_API_KEY is not set');
  }

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
      temperature: temperature, // Use the provided temperature
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt
        }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || `Claude API error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return await response.json();
}
