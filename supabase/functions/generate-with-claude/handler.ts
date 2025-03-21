
import { CLAUDE_API_URL, MODEL_NAME, MAX_TOKENS, DEFAULT_TEMPERATURE, IDEAS_TEMPERATURE, corsHeaders } from "./config.ts";
import { callClaudeApi } from "./claudeService.ts";

/**
 * Processes content generation requests and handles errors
 */
export async function processContentRequest(requestData: any) {
  console.log("Processing content request:", JSON.stringify(requestData, null, 2));

  try {
    // Validate required fields 
    if (!requestData?.task) {
      throw new Error("Missing required field: task");
    }

    // Handle different task types
    if (requestData.task === "content_generation") {
      if (!requestData?.prompt || !requestData?.contentType) {
        throw new Error("Content generation requires prompt and contentType fields");
      }

      // Use appropriate temperature based on content type
      const temperature = requestData?.contentType === "ideas" ? IDEAS_TEMPERATURE : DEFAULT_TEMPERATURE;
      
      console.log(`Generating content with temperature: ${temperature}`);
      const claudeResponse = await callClaudeApi(requestData.prompt, temperature);
      
      // Extract content from Claude's response
      const content = claudeResponse?.content?.[0]?.text || "";
      if (!content) {
        throw new Error("Empty response from Claude API");
      }
      
      console.log("Content generated successfully");
      return { 
        content, 
        task: requestData.task,
        contentType: requestData.contentType
      };
    }
    
    else if (requestData.task === "writing_style_preview") {
      if (!requestData?.prompt) {
        throw new Error("Writing style preview requires prompt field");
      }
      
      const claudeResponse = await callClaudeApi(requestData.prompt);
      const content = claudeResponse?.content?.[0]?.text || "";
      if (!content) {
        throw new Error("Empty response from Claude API");
      }
      
      console.log("Writing style preview generated successfully");
      return { 
        content, 
        task: requestData.task 
      };
    }
    
    else {
      throw new Error(`Unknown task type: ${requestData.task}`);
    }
  } catch (error) {
    console.error("Error in processContentRequest:", error);
    throw error; // Let the main handler format the error response
  }
}

/**
 * Handles errors from content processing in a consistent format
 */
export function handleError(error: Error, corsHeaders: Record<string, string>) {
  console.error("Error in Claude function:", error);
  
  // Format error message for client
  const errorMessage = error.message || "Unknown error occurred";
  const statusCode = errorMessage.includes("API key") ? 403 : 
                     errorMessage.includes("Missing") ? 400 : 500;
  
  return new Response(
    JSON.stringify({
      error: errorMessage,
      success: false
    }),
    { 
      status: statusCode, 
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      } 
    }
  );
}
