
import { corsHeaders } from "./config.ts";
import { sanitizeInput, createLogMessage } from "./utils.ts";
import { callClaudeApi } from "./claudeService.ts";

/**
 * Validates the request data and extracts necessary fields
 */
export function validateRequest(requestData: any) {
  const { prompt, contentType, idea, task } = requestData;

  if (!prompt) {
    throw new Error("Missing required field: prompt is required");
  }

  return { 
    prompt: sanitizeInput(prompt),
    contentType, 
    idea, 
    task 
  };
}

/**
 * Processes the request and generates content with Claude
 */
export async function processContentRequest(requestData: any) {
  const { prompt, contentType, idea, task } = validateRequest(requestData);
  
  // Log what type of content is being generated
  const logMessage = createLogMessage(task, contentType, idea);
  console.log(logMessage);
  
  // Generate content using Claude API
  const response = await callClaudeApi(prompt);
  
  // Extract the text content from the Claude API response
  let generatedContent = '';
  
  if (response && response.content && Array.isArray(response.content) && response.content.length > 0) {
    const contentItem = response.content[0];
    if (contentItem && typeof contentItem === 'object' && contentItem.text) {
      generatedContent = contentItem.text;
    } else if (typeof contentItem === 'string') {
      generatedContent = contentItem;
    }
  } else if (typeof response.content === 'string') {
    generatedContent = response.content;
  } else {
    console.error('Unexpected response format from Claude API:', response);
    throw new Error('Failed to extract text content from Claude response');
  }
  
  return { content: generatedContent };
}

/**
 * Handles errors and returns appropriate responses
 */
export function handleError(error: Error, corsHeaders: any = {}) {
  console.error('Error in generate-with-claude function:', error);
  
  return new Response(
    JSON.stringify({ error: error.message || 'Unknown error' }),
    { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}
