
import { useState } from 'react';
import { ContentIdea, ContentType } from '@/types';
import { toast } from 'sonner';
import { usePromptAssembly } from './usePromptAssembly';
import { useAuth } from '@/context/auth';
import { 
  generateContentWithClaude, 
  ClaudeErrorCategory, 
  ClaudeErrorResponse 
} from '../services/claudeAIService';
import { useErrorHandling } from './useErrorHandling';

/**
 * Hook for interacting with Claude AI to generate content
 * Enhanced with improved error handling for multi-tenant scenarios
 */
export const useClaudeAI = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<ClaudeErrorResponse | null>(null);
  const [debugPrompt, setDebugPrompt] = useState<string | null>(null);
  const { createFinalPrompt } = usePromptAssembly();
  const { user } = useAuth();
  const { handleError } = useErrorHandling('ClaudeAI');

  /**
   * Generates content using Claude AI with enhanced error handling
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
        throw {
          message: 'User must be logged in to generate content',
          category: ClaudeErrorCategory.AUTHORIZATION,
          retryable: false
        } as ClaudeErrorResponse;
      }
      
      // Extract tenant ID from user email domain (simple approach)
      const tenantId = user.email ? user.email.split('@')[1] : undefined;
      
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

      // Generate content using Claude AI with tenant awareness
      const content = await generateContentWithClaude(prompt, contentType, idea, tenantId);
      
      return content;
    } catch (err) {
      // Handle different error types with appropriate UI feedback
      const claudeError = err as ClaudeErrorResponse;
      setError(claudeError);
      
      // Customize error message based on error category
      let errorMessage = claudeError.message;
      let severity: 'error' | 'warning' | 'info' = 'error';
      
      // Special handling for different error categories
      switch (claudeError.category) {
        case ClaudeErrorCategory.RATE_LIMIT:
          errorMessage = 'Rate limit exceeded. Please try again in a few minutes.';
          severity = 'warning';
          break;
        case ClaudeErrorCategory.CONTENT_POLICY:
          errorMessage = 'Content policy violation detected. Please revise your input.';
          break;
        case ClaudeErrorCategory.AUTHORIZATION:
          errorMessage = 'Authorization error. Please check your account settings.';
          break;
        case ClaudeErrorCategory.SERVER_ERROR:
          errorMessage = 'Server error. Our team has been notified.';
          break;
        case ClaudeErrorCategory.NETWORK_ERROR:
          errorMessage = 'Network connection issue. Please check your internet connection.';
          severity = 'warning';
          break;
        case ClaudeErrorCategory.TIMEOUT:
          errorMessage = 'Request timed out. Please try again.';
          severity = 'warning';
          break;
      }
      
      // Use the error handling hook for consistent error handling
      handleError(new Error(errorMessage), 'content generation', severity, {
        tenantId: user?.email?.split('@')[1],
        requestId: claudeError.requestId,
        timestamp: claudeError.timestamp
      });
      
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
    debugPrompt,
    // Add helper method to check if error is retryable
    canRetry: error?.retryable ?? false
  };
};
