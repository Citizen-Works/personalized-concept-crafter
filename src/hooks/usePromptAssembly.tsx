
import { useCallback, useMemo } from 'react';
import { ContentIdea, ContentType, WritingStyleProfile, User, ContentPillar, TargetAudience } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Cache for storing assembled base prompts
const promptCache: Record<string, { prompt: string; timestamp: number }> = {};
// Cache expiration time - 30 minutes
const CACHE_EXPIRATION = 30 * 60 * 1000;

export const usePromptAssembly = () => {
  // Function to get a cached prompt or create a new one
  const getOrCreateBasePrompt = useCallback(async (userId: string, contentType: ContentType): Promise<string> => {
    const cacheKey = `${userId}_${contentType}`;
    const cachedPrompt = promptCache[cacheKey];
    
    // If we have a valid cached prompt, return it
    if (cachedPrompt && Date.now() - cachedPrompt.timestamp < CACHE_EXPIRATION) {
      console.log('Using cached base prompt');
      return cachedPrompt.prompt;
    }
    
    console.log('Building new base prompt');
    // Otherwise, build a new prompt
    return buildBasePrompt(userId, contentType);
  }, []);
  
  // Helper function to fetch user profile
  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return {
      id: data.id,
      email: '',
      name: data.name || '',
      businessName: data.business_name || '',
      businessDescription: data.business_description || '',
      linkedinUrl: data.linkedin_url || '',
      createdAt: new Date(data.created_at),
    };
  };
  
  // Helper function to fetch content pillars
  const fetchContentPillars = async (userId: string): Promise<ContentPillar[]> => {
    const { data, error } = await supabase
      .from('content_pillars')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching content pillars:', error);
      return [];
    }
    
    return data.map(pillar => ({
      id: pillar.id,
      userId: pillar.user_id,
      name: pillar.name,
      description: pillar.description || '',
      createdAt: new Date(pillar.created_at),
    }));
  };
  
  // Helper function to fetch target audiences
  const fetchTargetAudiences = async (userId: string): Promise<TargetAudience[]> => {
    const { data, error } = await supabase
      .from('target_audiences')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching target audiences:', error);
      return [];
    }
    
    return data.map(audience => ({
      id: audience.id,
      userId: audience.user_id,
      name: audience.name,
      description: audience.description || '',
      painPoints: audience.pain_points || [],
      goals: audience.goals || [],
      createdAt: new Date(audience.created_at),
    }));
  };
  
  // Helper function to fetch writing style profile
  const fetchWritingStyleProfile = async (userId: string): Promise<WritingStyleProfile | null> => {
    const { data, error } = await supabase
      .from('writing_style_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching writing style profile:', error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      userId: data.user_id,
      voiceAnalysis: data.voice_analysis || '',
      generalStyleGuide: data.general_style_guide || '',
      exampleQuotes: data.example_quotes || [],
      vocabularyPatterns: data.vocabulary_patterns || '',
      avoidPatterns: data.avoid_patterns || '',
      customPromptInstructions: data.custom_prompt_instructions || '',
      linkedinStyleGuide: data.linkedin_style_guide || '',
      linkedinExamples: data.linkedin_examples || [],
      newsletterStyleGuide: data.newsletter_style_guide || '',
      newsletterExamples: data.newsletter_examples || [],
      marketingStyleGuide: data.marketing_style_guide || '',
      marketingExamples: data.marketing_examples || [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  };
  
  // Function to build the base prompt
  const buildBasePrompt = async (userId: string, contentType: ContentType): Promise<string> => {
    // Fetch all necessary data
    const [user, contentPillars, targetAudiences, styleProfile] = await Promise.all([
      fetchUserProfile(userId),
      fetchContentPillars(userId),
      fetchTargetAudiences(userId),
      fetchWritingStyleProfile(userId)
    ]);
    
    // Start building the prompt
    let prompt = '# USER CONTEXT\n';
    
    if (user) {
      prompt += `- Name: ${user.name || 'Not specified'}\n`;
      prompt += `- Business: ${user.businessName || 'Not specified'}\n`;
      prompt += `- Business Description: ${user.businessDescription || 'Not specified'}\n\n`;
    } else {
      prompt += '- User information not available\n\n';
    }
    
    // Add content pillars
    prompt += '# CONTENT PILLARS\n';
    if (contentPillars.length > 0) {
      contentPillars.forEach(pillar => {
        prompt += `- ${pillar.name}: ${pillar.description}\n`;
      });
      prompt += '\n';
    } else {
      prompt += '- No content pillars defined\n\n';
    }
    
    // Add target audiences
    prompt += '# TARGET AUDIENCES\n';
    if (targetAudiences.length > 0) {
      targetAudiences.forEach(audience => {
        prompt += `- ${audience.name}: ${audience.description}\n`;
        if (audience.painPoints.length > 0) {
          prompt += `  Pain Points: ${audience.painPoints.join(', ')}\n`;
        }
        if (audience.goals.length > 0) {
          prompt += `  Goals: ${audience.goals.join(', ')}\n`;
        }
      });
      prompt += '\n';
    } else {
      prompt += '- No target audiences defined\n\n';
    }
    
    // Add writing style guide
    if (styleProfile) {
      prompt += '# WRITING STYLE GUIDE\n';
      prompt += styleProfile.generalStyleGuide || 'No general style guide available.\n';
      prompt += '\n';
      
      // Add content type specific style
      prompt += '# CONTENT TYPE SPECIFIC STYLE\n';
      if (contentType === 'linkedin') {
        prompt += styleProfile.linkedinStyleGuide || 'No LinkedIn style guide available.\n';
      } else if (contentType === 'newsletter') {
        prompt += styleProfile.newsletterStyleGuide || 'No Newsletter style guide available.\n';
      } else if (contentType === 'marketing') {
        prompt += styleProfile.marketingStyleGuide || 'No Marketing style guide available.\n';
      }
      prompt += '\n';
      
      // Add vocabulary patterns
      prompt += '# VOCABULARY PATTERNS\n';
      prompt += styleProfile.vocabularyPatterns || 'No vocabulary patterns specified.\n';
      prompt += '\n';
      
      // Add patterns to avoid
      prompt += '# PATTERNS TO AVOID\n';
      prompt += styleProfile.avoidPatterns || 'No patterns to avoid specified.\n';
      prompt += '\n';
      
      // Add examples
      prompt += '# EXAMPLES\n';
      if (contentType === 'linkedin' && styleProfile.linkedinExamples.length > 0) {
        styleProfile.linkedinExamples.forEach((example, index) => {
          prompt += `Example ${index + 1}:\n${example}\n\n`;
        });
      } else if (contentType === 'newsletter' && styleProfile.newsletterExamples.length > 0) {
        styleProfile.newsletterExamples.forEach((example, index) => {
          prompt += `Example ${index + 1}:\n${example}\n\n`;
        });
      } else if (contentType === 'marketing' && styleProfile.marketingExamples.length > 0) {
        styleProfile.marketingExamples.forEach((example, index) => {
          prompt += `Example ${index + 1}:\n${example}\n\n`;
        });
      } else {
        prompt += 'No examples available for this content type.\n\n';
      }
    } else {
      prompt += '# WRITING STYLE GUIDE\nNo writing style profile available.\n\n';
    }
    
    // Add best practices based on content type
    prompt += '# BEST PRACTICES\n';
    if (contentType === 'linkedin') {
      prompt += `- Keep posts concise (under 1300 characters)
- Use line breaks for readability
- Include a hook in the first 1-3 lines to grab attention
- End with a question or call to action to drive engagement
- Include relevant hashtags if appropriate (no more than 3-5)
- Format with emojis sparingly to highlight key points
- Write in a conversational, authentic tone\n\n`;
    } else if (contentType === 'newsletter') {
      prompt += `- Include a compelling subject line/headline
- Start with an engaging introduction that connects with the reader
- Break content into scannable sections with clear subheadings
- Include practical, actionable insights
- Balance educational content with storytelling
- End with a clear call to action or next steps
- Maintain a consistent voice throughout\n\n`;
    } else if (contentType === 'marketing') {
      prompt += `- Lead with clear, benefit-focused messaging
- Use active voice and present tense
- Create a sense of urgency where appropriate
- Focus on solving customer problems, not just features
- Include specific, measurable results when possible
- End with a clear, compelling call to action
- Keep sentences and paragraphs short and impactful\n\n`;
    }
    
    // Cache the base prompt
    const cacheKey = `${userId}_${contentType}`;
    promptCache[cacheKey] = {
      prompt,
      timestamp: Date.now()
    };
    
    return prompt;
  };
  
  // Function to create the final prompt by adding content idea
  const createFinalPrompt = useCallback(async (userId: string, idea: ContentIdea, contentType: ContentType): Promise<string> => {
    // Get the base prompt
    const basePrompt = await getOrCreateBasePrompt(userId, contentType);
    
    // Add content idea details
    let finalPrompt = basePrompt;
    
    finalPrompt += '# CONTENT IDEA\n';
    finalPrompt += `Title: ${idea.title}\n`;
    if (idea.description) {
      finalPrompt += `Description: ${idea.description}\n`;
    }
    if (idea.notes) {
      finalPrompt += `Notes: ${idea.notes}\n`;
    }
    finalPrompt += '\n';
    
    // Add custom instructions if available
    const { data } = await supabase
      .from('writing_style_profiles')
      .select('custom_prompt_instructions')
      .eq('user_id', userId)
      .single();
      
    if (data?.custom_prompt_instructions) {
      finalPrompt += '# CUSTOM INSTRUCTIONS\n';
      finalPrompt += data.custom_prompt_instructions + '\n\n';
    }
    
    // Add the task
    finalPrompt += '# TASK\n';
    if (contentType === 'linkedin') {
      finalPrompt += 'Create a LinkedIn post based on the content idea above. Make sure it follows the user\'s writing style and adheres to the best practices for LinkedIn content. The post should sound authentic and match the voice of the user.';
    } else if (contentType === 'newsletter') {
      finalPrompt += 'Create newsletter content based on the content idea above. Make sure it follows the user\'s writing style and adheres to the best practices for newsletter content. The content should sound authentic and match the voice of the user.';
    } else if (contentType === 'marketing') {
      finalPrompt += 'Create marketing copy based on the content idea above. Make sure it follows the user\'s writing style and adheres to the best practices for marketing content. The copy should sound authentic and match the voice of the user.';
    }
    
    return finalPrompt;
  }, [getOrCreateBasePrompt]);
  
  // Function to invalidate cache for a user
  const invalidateUserCache = useCallback((userId: string) => {
    const contentTypes: ContentType[] = ['linkedin', 'newsletter', 'marketing'];
    contentTypes.forEach(type => {
      const cacheKey = `${userId}_${type}`;
      if (promptCache[cacheKey]) {
        delete promptCache[cacheKey];
        console.log(`Invalidated cache for ${cacheKey}`);
      }
    });
  }, []);
  
  return {
    createFinalPrompt,
    invalidateUserCache
  };
};
