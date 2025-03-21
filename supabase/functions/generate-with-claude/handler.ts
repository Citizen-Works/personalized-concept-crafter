
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
export async function processContentRequest(requestData: any) {
  // Generate a unique request ID for tracking
  const requestId = crypto.randomUUID();
  
  // Extract tenant information if available
  const metadata: RequestMetadata = {
    userId: requestData?.userId,
    tenantId: requestData?.tenantId,
    requestId,
  };
  
  console.log(`[${requestId}] Processing content request:`, JSON.stringify(requestData, null, 2));

  try {
    // Validate required fields with detailed error messages
    if (!requestData?.task) {
      throw new Error("Missing required field: task");
    }

    // Handle different task types
    if (requestData.task === "content_generation") {
      if (!requestData?.prompt) {
        throw new Error("Content generation requires a prompt field");
      }
      
      if (!requestData?.contentType) {
        throw new Error("Content generation requires a contentType field");
      }

      // Use appropriate temperature based on content type
      const temperature = requestData?.contentType === "ideas" ? IDEAS_TEMPERATURE : DEFAULT_TEMPERATURE;
      
      console.log(`[${requestId}] Generating content with temperature: ${temperature}`);
      const claudeResponse = await callClaudeApi(requestData.prompt, temperature);
      
      // Improved error handling for Claude API response
      if (!claudeResponse) {
        throw new Error("Empty response from Claude API");
      }
      
      // Extract content from Claude's response with better validation
      const content = claudeResponse?.content?.[0]?.text;
      if (!content) {
        throw new Error("Claude API response missing expected content structure");
      }
      
      console.log(`[${requestId}] Content generated successfully (${content.length} chars)`);
      return { 
        content, 
        task: requestData.task,
        contentType: requestData.contentType,
        requestId // Return request ID for client-side logging
      };
    }
    
    else if (requestData.task === "writing_style_preview") {
      if (!requestData?.prompt) {
        throw new Error("Writing style preview requires prompt field");
      }
      
      const claudeResponse = await callClaudeApi(requestData.prompt);
      
      // Improved validation of Claude response
      if (!claudeResponse) {
        throw new Error("Empty response from Claude API");
      }
      
      const content = claudeResponse?.content?.[0]?.text;
      if (!content) {
        throw new Error("Claude API response missing expected content structure");
      }
      
      console.log(`[${requestId}] Writing style preview generated successfully (${content.length} chars)`);
      return { 
        content, 
        task: requestData.task,
        requestId // Return request ID for client-side logging
      };
    }
    
    else {
      throw new Error(`Unknown task type: ${requestData.task}`);
    }
  } catch (error) {
    // Enhanced error logging with tenant metadata
    logError(error, metadata);
    throw error; // Let the main handler format the error response
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
