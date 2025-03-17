
import { useCallback } from 'react';
import { ContentIdea, ContentType } from '@/types';
import { 
  fetchUserProfile, 
  fetchContentPillars, 
  fetchTargetAudiences, 
  fetchWritingStyleProfile,
  fetchCustomPromptInstructions
} from '@/services/profileDataService';
import { 
  buildBasePrompt, 
  addContentIdeaToPrompt, 
  addCustomInstructionsToPrompt, 
  addTaskToPrompt 
} from '@/utils/promptBuilder';
import { 
  getCachedPrompt, 
  cachePrompt, 
  invalidateUserCache as invalidateCache 
} from '@/utils/promptCache';

export const usePromptAssembly = () => {
  // Function to get a cached prompt or create a new one
  const getOrCreateBasePrompt = useCallback(async (userId: string, contentType: ContentType): Promise<string> => {
    // Check if we have a valid cached prompt
    const cachedPrompt = getCachedPrompt(userId, contentType);
    if (cachedPrompt) {
      return cachedPrompt;
    }
    
    console.log('Building new base prompt');
    // Fetch all necessary data
    const [user, contentPillars, targetAudiences, styleProfile] = await Promise.all([
      fetchUserProfile(userId),
      fetchContentPillars(userId),
      fetchTargetAudiences(userId),
      fetchWritingStyleProfile(userId)
    ]);
    
    // Build the base prompt
    const prompt = buildBasePrompt(user, contentPillars, targetAudiences, styleProfile, contentType);
    
    // Cache the base prompt
    cachePrompt(userId, contentType, prompt);
    
    return prompt;
  }, []);
  
  // Function to create the final prompt by adding content idea
  const createFinalPrompt = useCallback(async (userId: string, idea: ContentIdea, contentType: ContentType): Promise<string> => {
    // Get the base prompt
    const basePrompt = await getOrCreateBasePrompt(userId, contentType);
    
    // Add content idea details
    let finalPrompt = addContentIdeaToPrompt(basePrompt, idea);
    
    // Add custom instructions if available
    const customInstructions = await fetchCustomPromptInstructions(userId);
    finalPrompt = addCustomInstructionsToPrompt(finalPrompt, customInstructions);
    
    // Add the task
    finalPrompt = addTaskToPrompt(finalPrompt, contentType);
    
    return finalPrompt;
  }, [getOrCreateBasePrompt]);
  
  return {
    createFinalPrompt,
    invalidateUserCache: invalidateCache
  };
};
