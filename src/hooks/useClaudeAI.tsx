
import { useState } from 'react';
import { ContentIdea, ContentType } from '@/types';
import { buildBasePrompt, addContentIdeaToPrompt, addTaskToPrompt } from '@/utils/promptBuilder';

export const useClaudeAI = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);

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
      
      // Call Claude API with the prompt
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          contentType,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
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
