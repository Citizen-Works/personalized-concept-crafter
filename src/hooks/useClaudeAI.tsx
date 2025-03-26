import { useState } from 'react';
import { ContentIdea, ContentType } from '@/types';
import { buildBasePrompt, addContentIdeaToPrompt, addTaskToPrompt } from '@/utils/promptBuilder';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export const useClaudeAI = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Generate content method now explicitly takes contentType as a separate parameter
  const generateContent = async (
    idea: ContentIdea, 
    contentType: ContentType,
    debug = false
  ): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Build the prompt
      let prompt = buildBasePrompt();
      prompt = addContentIdeaToPrompt(prompt, idea);
      prompt = addTaskToPrompt(prompt, contentType);
      
      // Store the prompt for debugging
      setLastPrompt(prompt);
      
      // If in debug mode, don't make actual API call
      if (debug) {
        return null;
      }
      
      // Call Claude API through Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-with-claude', {
        body: {
          prompt,
          contentType,
          task: 'content_generation',
          idea: {
            id: idea.id,
            title: idea.title,
            description: idea.description
          }
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data?.content) {
        console.error('No content in response:', data);
        throw new Error('No content generated');
      }
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['drafts-by-idea', idea.id] });
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      
      return data.content;
    } catch (err) {
      console.error('Error generating content:', err);
      setError(err as Error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };
  
  // For debugging purpose, expose the last prompt
  const debugPrompt = () => {
    return lastPrompt;
  };
  
  return {
    generateContent,
    isGenerating,
    error,
    debugPrompt
  };
};
