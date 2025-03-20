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
import { usePersonalStories } from "@/hooks/usePersonalStories";
import { addPersonalStoriesToPrompt } from "@/utils/promptBuilder";

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
    
    // Extract content goal and call to action from idea notes
    let contentGoal = "";
    let callToAction = "";
    
    if (idea.notes) {
      const goalMatch = idea.notes.match(/Content Goal: (.*?)(?:\n|$)/);
      if (goalMatch && goalMatch[1]) {
        contentGoal = goalMatch[1].trim();
      }
      
      const ctaMatch = idea.notes.match(/Call to Action: (.*?)(?:\n|$)/);
      if (ctaMatch && ctaMatch[1]) {
        callToAction = ctaMatch[1].trim();
      }
    }
    
    // Add content goal to prompt if found
    if (contentGoal) {
      finalPrompt += `\n\n# CONTENT GOAL\nThis content has the goal of: ${contentGoal}.\n`;
      
      // Add specific guidance based on content goal
      switch(contentGoal.toLowerCase().replace(' ', '_')) {
        case 'audience_building':
          finalPrompt += "Focus on creating engaging, shareable content that demonstrates expertise and value. Aim to increase visibility and followers.\n";
          break;
        case 'lead_generation':
          finalPrompt += "Create content that highlights a problem and positions our expertise as the solution. Include a clear way for potential leads to take the next step.\n";
          break;
        case 'nurturing':
          finalPrompt += "Provide valuable insights that build trust and demonstrate ongoing value. Assume the audience is already familiar with us but needs more reasons to engage further.\n";
          break;
        case 'conversion':
          finalPrompt += "Create compelling content that overcomes objections and emphasizes benefits. Show why taking action now is valuable and reduce perceived risk.\n";
          break;
        case 'retention':
          finalPrompt += "Focus on providing additional value to existing customers. Highlight features they might not be using, success stories, or additional ways they can benefit.\n";
          break;
      }
    }
    
    // Add call to action to prompt if found
    if (callToAction) {
      finalPrompt += `\n\n# CALL TO ACTION\nThis content should guide the reader to: ${callToAction}.\n`;
      finalPrompt += "Make sure this call to action is integrated naturally into the content and feels like a logical next step for the reader.\n";
    }
    
    // Add relevant personal stories (if available)
    const { stories } = usePersonalStories();
    const relevantStories = selectRelevantStories(stories, idea, contentType);
    if (relevantStories.length > 0) {
      finalPrompt = addPersonalStoriesToPrompt(finalPrompt, relevantStories);
    }
    
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

/**
 * Selects relevant personal stories based on content idea and type
 */
const selectRelevantStories = (stories: PersonalStory[] | undefined, idea: ContentIdea, contentType: ContentType): PersonalStory[] => {
  if (!stories || stories.length === 0) return [];
  
  // Filter out archived stories
  const activeStories = stories.filter(story => !story.isArchived);
  if (activeStories.length === 0) return [];
  
  // Start with all active stories
  let candidates = [...activeStories];
  
  // Filter by content type relevance if specified in usage guidance
  candidates = candidates.filter(story => {
    // If usage guidance doesn't specify content types, keep the story
    if (!story.usageGuidance) return true;
    
    // Check if usage guidance mentions this content type
    const lowercaseGuidance = story.usageGuidance.toLowerCase();
    return !((lowercaseGuidance.includes('only use for') || 
              lowercaseGuidance.includes('only include in')) && 
            !lowercaseGuidance.includes(contentType.toLowerCase()));
  });
  
  // Score each story based on relevance factors
  const scoredStories = candidates.map(story => {
    let score = 0;
    
    // Content pillar match (highest priority)
    if (idea.contentPillarId && story.contentPillarIds.includes(idea.contentPillarId)) {
      score += 30;
    }
    
    // Target audience match if available
    if (idea.targetAudienceId && story.targetAudienceIds.includes(idea.targetAudienceId)) {
      score += 20;
    }
    
    // Inverse usage count (to favor less-used stories)
    score += Math.max(10 - story.usageCount, 0);
    
    // Recency penalty (avoid using very recent stories)
    if (story.lastUsedDate) {
      const daysSinceLastUse = Math.floor((Date.now() - new Date(story.lastUsedDate).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLastUse < 7) {
        score -= (7 - daysSinceLastUse) * 2;
      }
    }
    
    return { story, score };
  });
  
  // Sort by score (descending) and take top 2 stories
  return scoredStories
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(item => item.story);
};
