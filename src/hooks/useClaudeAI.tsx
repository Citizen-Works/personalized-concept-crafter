
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentIdea, ContentType } from '@/types';
import { toast } from 'sonner';
import { usePromptAssembly } from './usePromptAssembly';
import { useAuth } from '../context/AuthContext';

export const useClaudeAI = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createFinalPrompt } = usePromptAssembly();
  const { user } = useAuth();

  const generateContent = async (
    idea: ContentIdea,
    contentType: ContentType
  ): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('User must be logged in to generate content');
      }
      
      // Build the enhanced prompt using our new prompt assembly system
      const prompt = await createFinalPrompt(user.id, idea, contentType);

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

  return {
    generateContent,
    isGenerating,
    error
  };
};
