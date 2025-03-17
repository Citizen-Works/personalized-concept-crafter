
import { supabase } from '@/integrations/supabase/client';
import { ContentIdea, ContentType } from '@/types';

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
