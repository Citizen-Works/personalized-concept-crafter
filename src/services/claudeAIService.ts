
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
  const { data, error } = await supabase.functions.invoke("generate-with-claude", {
    body: {
      prompt,
      contentType,
      idea: {
        id: idea.id,
        title: idea.title,
        description: idea.description
      }
    }
  });

  if (error) {
    throw new Error(error.message || 'Failed to generate content');
  }

  if (!data?.content) {
    throw new Error('No content generated');
  }

  return data.content;
}

/**
 * Generates a writing style preview based on the user's style profile
 */
export async function generatePreviewWithClaude(
  styleProfile: WritingStyleProfile
): Promise<string> {
  // Build a prompt for Claude that explains the writing style
  const prompt = `
You are an AI assistant that helps with writing content. Please generate a short sample paragraph 
(about 100-150 words) that demonstrates the following writing style:

Voice and Tone:
${styleProfile.voice_analysis || "Not specified"}

General Style Guidelines:
${styleProfile.general_style_guide || "Not specified"}

Vocabulary Patterns to Use:
${styleProfile.vocabulary_patterns || "Not specified"}

Patterns to Avoid:
${styleProfile.avoid_patterns || "Not specified"}

The sample should be about a professional accomplishment or industry insight that 
would make a good LinkedIn post or newsletter section. Make sure the writing style 
perfectly matches the guidelines above. The content should be original and compelling.
`;

  const { data, error } = await supabase.functions.invoke("generate-with-claude", {
    body: {
      prompt,
      task: "writing_style_preview"
    }
  });

  if (error) {
    throw new Error(error.message || 'Failed to generate preview');
  }

  if (!data?.content) {
    throw new Error('No preview generated');
  }

  return data.content;
}
