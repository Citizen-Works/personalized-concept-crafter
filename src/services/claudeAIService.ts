
import { supabase } from '@/integrations/supabase/client';
import { ContentIdea, ContentType } from '@/types';
import { WritingStyleProfile } from '@/types/writingStyle';

// Enum for error categories to enable consistent handling
export enum ClaudeErrorCategory {
  RATE_LIMIT = 'rate_limit',
  CONTENT_POLICY = 'content_policy',
  AUTHORIZATION = 'authorization',
  SERVER_ERROR = 'server_error',
  NETWORK_ERROR = 'network_error',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown'
}

// Interface for structured error responses
export interface ClaudeErrorResponse {
  message: string;
  category: ClaudeErrorCategory;
  requestId?: string;
  timestamp?: string;
  retryable: boolean;
}

/**
 * Parses error responses from Claude API to provide structured error information
 */
function parseClaudeError(error: any): ClaudeErrorResponse {
  // Default error structure
  const defaultError: ClaudeErrorResponse = {
    message: 'An unknown error occurred when generating content',
    category: ClaudeErrorCategory.UNKNOWN,
    retryable: false
  };
  
  // No error data
  if (!error) return defaultError;
  
  // Extract error message
  const message = error.message || error.error || 
    (typeof error === 'string' ? error : 'Unknown error');
  
  // Determine error category based on message patterns
  let category = ClaudeErrorCategory.UNKNOWN;
  let retryable = false;
  
  if (message.includes('rate limit') || message.includes('429')) {
    category = ClaudeErrorCategory.RATE_LIMIT;
    retryable = true;
  } else if (message.includes('content policy') || message.includes('content filter')) {
    category = ClaudeErrorCategory.CONTENT_POLICY;
    retryable = false;
  } else if (message.includes('API key') || message.includes('403') || message.includes('authentication')) {
    category = ClaudeErrorCategory.AUTHORIZATION;
    retryable = false;
  } else if (message.includes('500') || message.includes('502') || message.includes('503')) {
    category = ClaudeErrorCategory.SERVER_ERROR;
    retryable = true;
  } else if (message.includes('network') || message.includes('connection')) {
    category = ClaudeErrorCategory.NETWORK_ERROR;
    retryable = true;
  } else if (message.includes('timeout')) {
    category = ClaudeErrorCategory.TIMEOUT;
    retryable = true;
  }
  
  return {
    message,
    category,
    requestId: error.requestId,
    timestamp: error.timestamp || new Date().toISOString(),
    retryable
  };
}

/**
 * Calls the Supabase Edge Function to generate content with Claude AI
 * Enhanced with better error handling and tenant tracking
 */
export async function generateContentWithClaude(
  prompt: string,
  contentType: ContentType,
  idea: ContentIdea,
  tenantId?: string
): Promise<string> {
  try {
    console.log(`Generating ${contentType} content for idea: ${idea.id}`);
    
    // Include tenant information for multi-tenant tracking
    const { data, error } = await supabase.functions.invoke("generate-with-claude", {
      body: {
        prompt,
        contentType,
        idea: {
          id: idea.id,
          title: idea.title,
          description: idea.description
        },
        task: "content_generation",
        userId: idea.userId,
        tenantId
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw parseClaudeError(error);
    }

    if (!data?.content) {
      console.error('No content in response:', data);
      throw parseClaudeError({
        message: 'No content generated',
        category: ClaudeErrorCategory.UNKNOWN
      });
    }
    
    console.log(`Content generated successfully (${contentType})`);
    
    // Handle response content (ensuring we return a string)
    return String(data.content);
  } catch (error) {
    console.error('Error in generateContentWithClaude:', error);
    
    // Transform to structured error if needed
    if (!(error as ClaudeErrorResponse).category) {
      throw parseClaudeError(error);
    }
    
    throw error;
  }
}

/**
 * Generates a writing style preview based on the user's style profile and business information
 * Enhanced with better error handling and tenant tracking
 */
export async function generatePreviewWithClaude(
  styleProfile: WritingStyleProfile,
  contentType: ContentType = 'linkedin',
  businessName: string = '',
  businessDescription: string = '',
  tenantId?: string
): Promise<string> {
  // Get the content-specific style guide based on the content type
  let contentSpecificGuide = '';
  if (contentType === 'linkedin' && styleProfile.linkedin_style_guide) {
    contentSpecificGuide = styleProfile.linkedin_style_guide;
  } else if (contentType === 'newsletter' && styleProfile.newsletter_style_guide) {
    contentSpecificGuide = styleProfile.newsletter_style_guide;
  } else if (contentType === 'marketing' && styleProfile.marketing_style_guide) {
    contentSpecificGuide = styleProfile.marketing_style_guide;
  }

  // Build a prompt for Claude that explains the writing style
  const prompt = `
You are an AI assistant that helps with writing content. Please generate a short sample paragraph 
(about 100-150 words) that demonstrates the following writing style:

Voice and Tone:
${styleProfile.voice_analysis || "Not specified"}

General Style Guidelines:
${styleProfile.general_style_guide || "Not specified"}

${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Specific Guidelines:
${contentSpecificGuide || "Not specified"}

Vocabulary Patterns to Use:
${styleProfile.vocabulary_patterns || "Not specified"}

Patterns to Avoid:
${styleProfile.avoid_patterns || "Not specified"}

Business Context:
${businessName ? `Business Name: ${businessName}` : "Not specified"}
${businessDescription ? `Business Description: ${businessDescription}` : "Not specified"}

The sample should be about a professional accomplishment or industry insight that 
would make a good ${contentType} post or section. Make sure the writing style 
perfectly matches the guidelines above, especially the ${contentType}-specific guidelines.
The content should be original, compelling, and appropriate for the ${contentType} format.
If business information is provided, incorporate relevant elements into the sample.
ONLY include the writing sample. Do NOT include any extra comments or notes. Only the requested sample. Do not address the user.
`;

  try {
    console.log(`Generating writing style preview for ${contentType}`);
    
    // Include tenant information for multi-tenant tracking
    const { data, error } = await supabase.functions.invoke("generate-with-claude", {
      body: {
        prompt,
        task: "writing_style_preview",
        contentType,
        userId: styleProfile.user_id,
        tenantId
      }
    });

    if (error) {
      console.error('Edge function error in preview generation:', error);
      throw parseClaudeError(error);
    }

    if (!data?.content) {
      console.error('No preview content in response:', data);
      throw parseClaudeError({
        message: 'No preview generated',
        category: ClaudeErrorCategory.UNKNOWN
      });
    }
    
    console.log('Writing style preview generated successfully');
    
    // Ensure we return a string
    return String(data.content);
  } catch (error) {
    console.error('Error in generatePreviewWithClaude:', error);
    
    // Transform to structured error if needed
    if (!(error as ClaudeErrorResponse).category) {
      throw parseClaudeError(error);
    }
    
    throw error;
  }
}
