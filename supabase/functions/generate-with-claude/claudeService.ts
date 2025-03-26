import { CLAUDE_API_KEY, CLAUDE_API_URL, MODEL_NAME, MAX_TOKENS, DEFAULT_TEMPERATURE } from "./config.ts";

/**
 * Makes a request to the Claude API
 */
export async function callClaudeApi(userPrompt: string, temperature = DEFAULT_TEMPERATURE) {
  if (!CLAUDE_API_KEY) {
    throw new Error('CLAUDE_API_KEY is not set');
  }

  // Create a system prompt that provides general guidance for JSON responses
  const systemPrompt = `You are an expert content creator that generates high-quality, engaging content based on specific instructions.
When asked to generate JSON, you will:
1. ONLY output valid JSON
2. Never include any text before or after the JSON
3. Ensure all required fields are present
4. Use the exact field names specified
5. Format arrays and objects correctly`;

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
    
    // For JSON responses, try to parse the content to ensure it's valid
    if (data.content?.[0]?.text) {
      try {
        const text = data.content[0].text.trim();
        // Only try to parse if it looks like JSON
        if (text.startsWith('[') || text.startsWith('{')) {
          JSON.parse(text); // This will throw if invalid
        }
      } catch (parseError) {
        console.error('Invalid JSON in Claude response:', data.content[0].text);
        throw new Error('Claude returned invalid JSON structure');
      }
    }
    
    console.log('Claude API response received and validated successfully');
    return data;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}
