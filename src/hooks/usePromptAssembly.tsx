
import { useState, useEffect, useCallback } from 'react';
import { ContentIdea, ContentType, User } from '@/types';
import { useAuth } from '@/context/auth';
import { useContentPillars } from './useContentPillars';
import { useTargetAudiences } from './useTargetAudiences';
import { useWritingStyle } from './useWritingStyle';
import { useUserSettings } from './useUserSettings';
import { useLinkedinPosts } from './useLinkedinPosts';
import { usePersonalStories } from './usePersonalStories';
import { 
  buildBasePrompt,
  addLinkedinPostsToPrompt,
  addContentIdeaToPrompt,
  addCustomInstructionsToPrompt,
  addTaskToPrompt,
  addPatternsToAvoidToPrompt,
  addPersonalStoriesToPrompt
} from '@/utils/promptBuilder';

/**
 * Hook for assembling prompts for AI content generation
 */
export function usePromptAssembly() {
  const { user } = useAuth();
  const { contentPillars } = useContentPillars();
  const { targetAudiences } = useTargetAudiences();
  const { settings } = useUserSettings();
  const { allPosts } = useLinkedinPosts();
  const { styleProfile } = useWritingStyle();
  const { stories } = usePersonalStories();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!!user && !!contentPillars && !!targetAudiences && !!settings && !!styleProfile) {
      setIsLoading(false);
    }
  }, [user, contentPillars, targetAudiences, settings, styleProfile]);

  /**
   * Creates a final prompt by assembling all components
   */
  const createFinalPrompt = useCallback(async (
    userId: string,
    idea: ContentIdea,
    contentType: ContentType
  ): Promise<string> => {
    // Step 1: Build the base prompt with user context, content pillars, target audiences, and writing style
    let prompt = buildBasePrompt(
      user, 
      contentPillars, 
      targetAudiences, 
      styleProfile,
      contentType
    );
    
    // Step 2: Add LinkedIn posts if generating LinkedIn content
    if (contentType === 'linkedin' && allPosts.length > 0) {
      prompt = addLinkedinPostsToPrompt(prompt, allPosts.slice(0, 5));
    }
    
    // Step 3: Add personal stories if available
    if (stories.length > 0) {
      prompt = addPersonalStoriesToPrompt(prompt, stories);
    }
    
    // Step 4: Add patterns to avoid from writing style
    prompt = addPatternsToAvoidToPrompt(prompt, styleProfile);
    
    // Step 5: Add content idea details
    prompt = addContentIdeaToPrompt(prompt, idea);
    
    // Step 6: Add custom instructions from user settings
    prompt = addCustomInstructionsToPrompt(prompt, settings?.custom_instructions || null);
    
    // Step 7: Add the task description based on content type
    prompt = addTaskToPrompt(prompt, contentType);
    
    return prompt;
  }, [
    user, 
    contentPillars, 
    targetAudiences, 
    styleProfile, 
    allPosts, 
    settings?.custom_instructions,
    stories
  ]);

  return {
    createFinalPrompt,
    isLoading
  };
}
