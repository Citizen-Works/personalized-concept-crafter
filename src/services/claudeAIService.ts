
import { supabase } from '@/integrations/supabase/client';
import { ContentIdea, ContentType } from '@/types';
import { WritingStyleProfile } from '@/types/writingStyle';

/**
 * Calls the Supabase Edge Function to generate content with Claude AI
 */
export async function generateContentWithClaude(
  prompt: string,
  contentType: ContentType,
  idea: ContentIdea
): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke("generate-with-claude", {
      body: {
        prompt,
        contentType,
        idea: {
          id: idea.id,
          title: idea.title,
          description: idea.description
        },
        task: "content_generation"
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'Failed to generate content');
    }

    if (!data?.content) {
      console.error('No content in response:', data);
      throw new Error('No content generated');
    }
    
    // Handle response content (ensuring we return a string)
    return String(data.content);
  } catch (error) {
    console.error('Error in generateContentWithClaude:', error);
    throw error;
  }
}

/**
 * Generates a writing style preview based on the user's style profile and business information
 */
export async function generatePreviewWithClaude(
  styleProfile: WritingStyleProfile,
  contentType: ContentType = 'linkedin',
  businessName: string = '',
  businessDescription: string = ''
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
    const { data, error } = await supabase.functions.invoke("generate-with-claude", {
      body: {
        prompt,
        task: "writing_style_preview",
        contentType
      }
    });

    if (error) {
      console.error('Edge function error in preview generation:', error);
      throw new Error(error.message || 'Failed to generate preview');
    }

    if (!data?.content) {
      console.error('No preview content in response:', data);
      throw new Error('No preview generated');
    }
    
    // Ensure we return a string
    return String(data.content);
  } catch (error) {
    console.error('Error in generatePreviewWithClaude:', error);
    throw error;
  }
}
