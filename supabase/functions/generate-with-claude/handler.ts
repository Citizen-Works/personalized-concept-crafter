import { CLAUDE_API_URL, MODEL_NAME, MAX_TOKENS, DEFAULT_TEMPERATURE, IDEAS_TEMPERATURE, corsHeaders } from "./config.ts";
import { callClaudeApi } from "./claudeService.ts";

// Add tenant tracking for error reporting
interface RequestMetadata {
  userId?: string;
  tenantId?: string;
  requestId?: string;
}

/**
 * Processes content generation requests and handles errors with improved tenant tracking
 */
export async function processContentRequest(requestData: any): Promise<Response> {
  const requestId = requestData.requestId || crypto.randomUUID();
  console.log(`[${requestId}] Processing content request`);
  
  try {
    const { task, prompt } = requestData;
    // API key should be passed in headers or environment variables
    const apiKey = Deno.env.get("CLAUDE_API_KEY");
    
    if (!task || !prompt) {
      console.error(`[${requestId}] Missing required fields:`, { 
        task, 
        hasPrompt: !!prompt
      });
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    if (!apiKey) {
      console.error(`[${requestId}] Missing API key in environment`);
      return new Response(JSON.stringify({ error: 'Claude API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    console.log(`[${requestId}] Processing ${task} request`);
    
    let result;
    switch (task) {
      case 'generate-ideas':
        result = await generateIdeas(prompt, apiKey);
        break;
      case 'content_generation':
        result = await generateContent(prompt, apiKey);
        break;
      case 'writing_style_preview':
        result = await generateContent(prompt, apiKey);
        break;
      default:
        throw new Error(`Unknown task type: ${task}`);
    }
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    console.error(`[${requestId}] Error processing request:`, error);
    return handleError(error, corsHeaders);
  }
}

async function generateIdeas(prompt: string, apiKey: string) {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Generating ideas with API key:`, apiKey.substring(0, 4) + '...');
  
  try {
    const result = await callClaudeApi(prompt, IDEAS_TEMPERATURE, apiKey);
    console.log(`[${requestId}] Generated ideas:`, result);
    return result;
  } catch (error) {
    console.error(`[${requestId}] Error generating ideas:`, error);
    throw error;
  }
}

async function generateContent(prompt: string, apiKey: string) {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Generating content with API key:`, apiKey.substring(0, 4) + '...');
  
  try {
    const result = await callClaudeApi(prompt, DEFAULT_TEMPERATURE, apiKey);
    console.log(`[${requestId}] Generated content:`, result);
    return result;
  } catch (error) {
    console.error(`[${requestId}] Error generating content:`, error);
    throw error;
  }
}

/**
 * Centralized error logging with tenant information
 */
function logError(error: Error, metadata: RequestMetadata) {
  const errorDetails = {
    message: error.message,
    stack: error.stack,
    ...metadata
  };
  
  console.error(`[${metadata.requestId}] Error in Claude function:`, JSON.stringify(errorDetails, null, 2));
  
  // Here you could add additional logging to external services like Sentry, LogRocket, etc.
  // if you integrate them in the future
}

/**
 * Handles errors from content processing in a consistent format with improved client information
 */
export function handleError(error: Error, corsHeaders: Record<string, string>) {
  // Format error message for client
  const errorMessage = error.message || "Unknown error occurred";
  
  // Set appropriate status code based on error type
  let statusCode = 500;
  if (errorMessage.includes("API key")) statusCode = 403;
  else if (errorMessage.includes("Missing")) statusCode = 400;
  else if (errorMessage.includes("rate limit")) statusCode = 429;
  else if (errorMessage.includes("content policy")) statusCode = 422;
  
  // Create client-friendly error response
  const errorResponse = {
    error: errorMessage,
    success: false,
    errorCode: statusCode, // Include error code for client-side handling
    timestamp: new Date().toISOString() // Include timestamp for client-side logging
  };
  
  return new Response(
    JSON.stringify(errorResponse),
    { 
      status: statusCode, 
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      } 
    }
  );
}
