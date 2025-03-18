
import { useCallback } from 'react';
import { ContentIdea, ContentType, LinkedinPost, Document } from '@/types';
import { 
  fetchUserProfile, 
  fetchContentPillars, 
  fetchTargetAudiences, 
  fetchWritingStyleProfile,
  fetchCustomPromptInstructions,
  fetchRecentLinkedinPosts,
  fetchNewsletterExamples,
  fetchMarketingExamples,
  fetchBusinessContextDocuments
} from '@/services/profile';
import { 
  buildBasePrompt, 
  addContentIdeaToPrompt, 
  addCustomInstructionsToPrompt, 
  addTaskToPrompt,
  addLinkedinPostsToPrompt,
  addNewsletterExamplesToPrompt,
  addMarketingExamplesToPrompt,
  addBusinessContextDocsToPrompt,
  addPatternsToAvoidToPrompt
} from '@/utils/promptBuilder';
import { 
  getCachedPrompt, 
  cachePrompt, 
  invalidateUserCache as invalidateCache 
} from '@/utils/promptCache';
import { WritingStyleProfile } from '@/types/writingStyle';

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
    const [user, contentPillars, targetAudiences, styleProfile, businessDocuments] = await Promise.all([
      fetchUserProfile(userId),
      fetchContentPillars(userId),
      fetchTargetAudiences(userId),
      fetchWritingStyleProfile(userId),
      fetchBusinessContextDocuments(userId)
    ]);
    
    // Convert from WritingStyleProfile in writingStyle.ts to the format expected by buildBasePrompt
    const formattedStyleProfile = styleProfile ? {
      id: styleProfile.id || '', // Set a default empty string if id is undefined
      userId: styleProfile.userId || styleProfile.user_id,
      voiceAnalysis: styleProfile.voiceAnalysis || styleProfile.voice_analysis,
      generalStyleGuide: styleProfile.generalStyleGuide || styleProfile.general_style_guide,
      exampleQuotes: styleProfile.exampleQuotes || [],
      vocabularyPatterns: styleProfile.vocabularyPatterns || styleProfile.vocabulary_patterns,
      avoidPatterns: styleProfile.avoidPatterns || styleProfile.avoid_patterns,
      linkedinStyleGuide: styleProfile.linkedinStyleGuide || styleProfile.linkedin_style_guide,
      linkedinExamples: styleProfile.linkedinExamples || [],
      newsletterStyleGuide: styleProfile.newsletterStyleGuide || styleProfile.newsletter_style_guide,
      newsletterExamples: styleProfile.newsletterExamples || [],
      marketingStyleGuide: styleProfile.marketingStyleGuide || styleProfile.marketing_style_guide,
      marketingExamples: styleProfile.marketingExamples || [],
      customPromptInstructions: styleProfile.customPromptInstructions,
      createdAt: styleProfile.createdAt || new Date(),
      updatedAt: styleProfile.updatedAt || new Date()
    } : null;
    
    // Build the base prompt
    let prompt = buildBasePrompt(user, contentPillars, targetAudiences, formattedStyleProfile, contentType);
    
    // Add business context documents (early in the prompt)
    prompt = addBusinessContextDocsToPrompt(prompt, businessDocuments);
    
    // Cache the base prompt
    cachePrompt(userId, contentType, prompt);
    
    return prompt;
  }, []);
  
  // Function to create the final prompt by adding content idea
  const createFinalPrompt = useCallback(async (
    userId: string, 
    idea: ContentIdea & { regenerationInstructions?: string }, 
    contentType: ContentType
  ): Promise<string> => {
    // Get the base prompt
    const basePrompt = await getOrCreateBasePrompt(userId, contentType);
    
    // Get the style profile (needed for patterns to avoid)
    const styleProfile = await fetchWritingStyleProfile(userId);
    
    let finalPrompt = basePrompt;
    
    // Add examples based on content type (early-mid in the prompt)
    if (contentType === 'linkedin') {
      const recentPosts = await fetchRecentLinkedinPosts(userId, 5);
      finalPrompt = addLinkedinPostsToPrompt(finalPrompt, recentPosts);
    } else if (contentType === 'newsletter') {
      const newsletterExamples = await fetchNewsletterExamples(userId, 5);
      finalPrompt = addNewsletterExamplesToPrompt(finalPrompt, newsletterExamples);
    } else if (contentType === 'marketing') {
      const marketingExamples = await fetchMarketingExamples(userId, 5);
      finalPrompt = addMarketingExamplesToPrompt(finalPrompt, marketingExamples);
    }
    
    // Add patterns to avoid (moved toward the end for emphasis)
    const formattedStyleProfile = styleProfile ? {
      id: styleProfile.id || '',
      userId: styleProfile.userId || styleProfile.user_id,
      voiceAnalysis: styleProfile.voiceAnalysis || styleProfile.voice_analysis,
      generalStyleGuide: styleProfile.generalStyleGuide || styleProfile.general_style_guide,
      exampleQuotes: styleProfile.exampleQuotes || [],
      vocabularyPatterns: styleProfile.vocabularyPatterns || styleProfile.vocabulary_patterns,
      avoidPatterns: styleProfile.avoidPatterns || styleProfile.avoid_patterns,
      linkedinStyleGuide: styleProfile.linkedinStyleGuide || styleProfile.linkedin_style_guide,
      linkedinExamples: styleProfile.linkedinExamples || [],
      newsletterStyleGuide: styleProfile.newsletterStyleGuide || styleProfile.newsletter_style_guide,
      newsletterExamples: styleProfile.newsletterExamples || [],
      marketingStyleGuide: styleProfile.marketingStyleGuide || styleProfile.marketing_style_guide,
      marketingExamples: styleProfile.marketingExamples || [],
      customPromptInstructions: styleProfile.customPromptInstructions,
      createdAt: styleProfile.createdAt || new Date(),
      updatedAt: styleProfile.updatedAt || new Date()
    } : null;
    
    finalPrompt = addPatternsToAvoidToPrompt(finalPrompt, formattedStyleProfile);
    
    // Add content idea details (toward the end)
    finalPrompt = addContentIdeaToPrompt(finalPrompt, idea);
    
    // Add custom instructions (toward the end)
    const customInstructions = await fetchCustomPromptInstructions(userId);
    finalPrompt = addCustomInstructionsToPrompt(finalPrompt, customInstructions);
    
    // Add regeneration instructions if provided (just before task)
    if (idea.regenerationInstructions) {
      finalPrompt += `\n# REGENERATION INSTRUCTIONS\n${idea.regenerationInstructions}\n\n`;
    }
    
    // Add the task (last section, maximizes recency bias)
    finalPrompt = addTaskToPrompt(finalPrompt, contentType);
    
    return finalPrompt;
  }, [getOrCreateBasePrompt]);
  
  return {
    createFinalPrompt,
    invalidateUserCache: invalidateCache
  };
};
