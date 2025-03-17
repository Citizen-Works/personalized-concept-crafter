
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentIdea, ContentType } from '@/types';
import { toast } from 'sonner';

export const useClaudeAI = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = async (
    idea: ContentIdea,
    contentType: ContentType
  ): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      // Build the prompt based on the idea and content type
      const prompt = buildPrompt(idea, contentType);

      // Call the Supabase Edge Function
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate content';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error generating content:', err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to build the prompt for Claude
  const buildPrompt = (idea: ContentIdea, contentType: ContentType): string => {
    let prompt = `Generate ${contentType} content based on the following idea:\n\n`;

    // Add idea title and description
    prompt += `Title: ${idea.title}\n`;
    
    if (idea.description) {
      prompt += `Description: ${idea.description}\n`;
    }

    if (idea.notes) {
      prompt += `Additional notes: ${idea.notes}\n`;
    }

    // Add content type specific instructions
    if (contentType === 'linkedin') {
      prompt += `\nCreate an engaging LinkedIn post that resonates with professionals. 
      Keep it concise (under 1300 characters), include line breaks for readability, 
      and end with a question or call to action to encourage engagement.`;
    } else if (contentType === 'newsletter') {
      prompt += `\nCreate a newsletter section that provides value to the readers.
      Include a compelling headline, introduction, main points with subheadings if needed,
      and a conclusion that emphasizes the main takeaway.`;
    } else if (contentType === 'marketing') {
      prompt += `\nCreate marketing copy that highlights the benefits, creates a sense of urgency,
      appeals to the target audience's needs, and includes a clear call to action.`;
    }

    return prompt;
  };

  return {
    generateContent,
    isGenerating,
    error
  };
};
