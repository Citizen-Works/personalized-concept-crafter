
import { useState } from 'react';
import { ContentIdea, ContentType } from '@/types';
import { toast } from 'sonner';
import { usePromptAssembly } from './usePromptAssembly';
import { useAuth } from '../context/AuthContext';
import { generateContentWithClaude } from '../services/claudeAIService';

/**
 * Hook for interacting with Claude AI to generate content
 */
export const useClaudeAI = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugPrompt, setDebugPrompt] = useState<string | null>(null);
  const { createFinalPrompt } = usePromptAssembly();
  const { user } = useAuth();

  /**
   * Generates content using Claude AI
   */
  const generateContent = async (
    idea: ContentIdea & { regenerationInstructions?: string },
    contentType: ContentType,
    debug = false
  ): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);
    setDebugPrompt(null);

    try {
      if (!user) {
        throw new Error('User must be logged in to generate content');
      }
      
      // Build the enhanced prompt using our prompt assembly system
      let prompt = await createFinalPrompt(user.id, idea, contentType);
      
      // Add regeneration instructions if they exist
      if (idea.regenerationInstructions) {
        prompt += `\n\n# REGENERATION INSTRUCTIONS\nPlease improve the content based on the following feedback:\n${idea.regenerationInstructions}\n\n`;
      }
      
      // If in debug mode, save the prompt and return it instead
      if (debug) {
        setDebugPrompt(prompt);
        setIsGenerating(false);
        return prompt;
      }

      // Generate content using Claude AI
      const content = await generateContentWithClaude(prompt, contentType, idea);
      
      return content;
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
    error,
    debugPrompt
  };
};
