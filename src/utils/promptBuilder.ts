
import { ContentType, ContentIdea, WritingStyleProfile, User, ContentPillar, TargetAudience, LinkedinPost } from '@/types';

/**
 * Builds a base prompt with user context, content pillars, target audiences, and writing style
 */
export function buildBasePrompt(
  user: User | null, 
  contentPillars: ContentPillar[], 
  targetAudiences: TargetAudience[], 
  styleProfile: WritingStyleProfile | null,
  contentType: ContentType
): string {
  // Start building the prompt
  let prompt = 'You are an expert content creator helping ';
  
  if (user) {
    prompt += `${user.name} of ${user.businessName} `;
    
    if (contentType === 'linkedin') {
      prompt += 'create a LinkedIn post that perfectly matches their authentic voice and style.\n\n';
    } else if (contentType === 'newsletter') {
      prompt += 'create newsletter content that perfectly matches their authentic voice and style.\n\n';
    } else if (contentType === 'marketing') {
      prompt += 'create marketing copy that perfectly matches their authentic voice and style.\n\n';
    }

    // Add business context
    prompt += '# BUSINESS CONTEXT\n';
    prompt += `${user.businessDescription || 'Not specified'}\n\n`;
    
    if (user.jobTitle) {
      prompt += `Job Title: ${user.jobTitle}\n\n`;
    }
  } else {
    prompt += 'the user create content that perfectly matches their authentic voice and style.\n\n';
    prompt += '# BUSINESS CONTEXT\n';
    prompt += 'Not specified\n\n';
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
      if (audience.painPoints && audience.painPoints.length > 0) {
        prompt += `  Pain points: ${audience.painPoints.join(', ')}\n`;
      }
      if (audience.goals && audience.goals.length > 0) {
        prompt += `  Goals: ${audience.goals.join(', ')}\n`;
      }
    });
    prompt += '\n';
  } else {
    prompt += '- No target audiences defined\n\n';
  }
  
  // Add writing style guide
  if (styleProfile) {
    prompt += '# WRITING STYLE ANALYSIS\n';
    prompt += styleProfile.voiceAnalysis || 'No voice analysis available.\n';
    prompt += '\n';
    
    prompt += '# GENERAL STYLE GUIDE\n';
    prompt += styleProfile.generalStyleGuide || 'No general style guide available.\n';
    prompt += '\n';
    
    // Add content type specific style
    if (contentType === 'linkedin') {
      prompt += '# LINKEDIN-SPECIFIC STYLE\n';
      prompt += styleProfile.linkedinStyleGuide || 'No LinkedIn style guide available.\n';
      prompt += '\n';
    } else if (contentType === 'newsletter') {
      prompt += '# NEWSLETTER-SPECIFIC STYLE\n';
      prompt += styleProfile.newsletterStyleGuide || 'No Newsletter style guide available.\n';
      prompt += '\n';
    } else if (contentType === 'marketing') {
      prompt += '# MARKETING-SPECIFIC STYLE\n';
      prompt += styleProfile.marketingStyleGuide || 'No Marketing style guide available.\n';
      prompt += '\n';
    }
    
    // Add vocabulary patterns
    prompt += '# VOCABULARY PATTERNS TO USE\n';
    prompt += styleProfile.vocabularyPatterns || 'No vocabulary patterns specified.\n';
    prompt += '\n';
    
    // Add patterns to avoid
    prompt += '# PATTERNS TO AVOID\n';
    prompt += styleProfile.avoidPatterns || 'No patterns to avoid specified.\n';
    prompt += '\n';
  } else {
    prompt += '# WRITING STYLE GUIDE\nNo writing style profile available.\n\n';
  }
  
  // Add best practices based on content type
  prompt += '# BEST PRACTICES\n';
  if (contentType === 'linkedin') {
    prompt += `- Hook the reader in the first 3 lines with a compelling statement, question, or statistic
- Use short paragraphs (1-3 lines) with plenty of white space
- Write in a conversational tone that feels authentic and personal
- Include a personal story, insight, or lesson learned when relevant
- Create easily scannable content with bullet points, numbers, or emojis as separators
- End with a clear call-to-action or thought-provoking question
- Keep the total length between 1200-1400 characters for optimal engagement
- Use 3-5 relevant hashtags that align with your content pillars
- Avoid excessive formatting, links, or tagging that feels promotional
- Ensure the content provides value before asking for anything in return\n\n`;
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
  
  return prompt;
}

/**
 * Adds LinkedIn posts to a prompt
 */
export function addLinkedinPostsToPrompt(prompt: string, posts: LinkedinPost[]): string {
  let finalPrompt = prompt;
  
  finalPrompt += '# EXAMPLES OF PREVIOUS LINKEDIN POSTS\n';
  if (posts.length > 0) {
    posts.forEach(post => {
      finalPrompt += '---BEGIN POST---\n';
      finalPrompt += post.content + '\n';
      finalPrompt += '---END POST---\n\n';
    });
  } else {
    finalPrompt += 'No previous LinkedIn posts available.\n\n';
  }
  
  return finalPrompt;
}

/**
 * Adds content idea details to a prompt
 */
export function addContentIdeaToPrompt(basePrompt: string, idea: ContentIdea): string {
  let finalPrompt = basePrompt;
  
  finalPrompt += '# CONTENT IDEA\n';
  finalPrompt += `Title: ${idea.title}\n`;
  if (idea.description) {
    finalPrompt += `Description: ${idea.description}\n`;
  }
  if (idea.notes) {
    finalPrompt += `Notes: ${idea.notes}\n`;
  }
  if (idea.meetingTranscriptExcerpt) {
    finalPrompt += `Meeting Transcript Excerpt: ${idea.meetingTranscriptExcerpt}\n`;
  }
  finalPrompt += '\n';
  
  return finalPrompt;
}

/**
 * Adds custom instructions to a prompt
 */
export function addCustomInstructionsToPrompt(prompt: string, customInstructions: string | null): string {
  if (!customInstructions) return prompt;
  
  let finalPrompt = prompt;
  finalPrompt += '# CUSTOM INSTRUCTIONS\n';
  finalPrompt += customInstructions + '\n\n';
  
  return finalPrompt;
}

/**
 * Adds the task description to a prompt based on content type
 */
export function addTaskToPrompt(prompt: string, contentType: ContentType): string {
  let finalPrompt = prompt;
  
  finalPrompt += '# TASK\n';
  if (contentType === 'linkedin') {
    const userName = prompt.split('helping ')[1]?.split(' of ')[0] || 'the user';
    finalPrompt += `Write a LinkedIn post that sounds exactly like ${userName} based on their authentic voice, writing style, and vocabulary patterns. The post should:\n\n`;
    finalPrompt += `1. Address the specified target audience needs and pain points\n`;
    finalPrompt += `2. Align with the relevant content pillars\n`;
    finalPrompt += `3. Follow LinkedIn best practices for formatting and engagement\n`;
    finalPrompt += `4. Maintain the authentic voice shown in the previous posts\n`;
    finalPrompt += `5. Be ready for publishing with minimal editing\n\n`;
    finalPrompt += `IMPORTANT: Provide ONLY the text of the LinkedIn post. Do not include any explanations, commentaries, or notes about the post - just the post itself as it would appear on LinkedIn. Include relevant hashtags at the end if appropriate.`;
  } else if (contentType === 'newsletter') {
    finalPrompt += 'Create newsletter content based on the content idea above. Make sure it follows the user\'s writing style and adheres to the best practices for newsletter content. The content should sound authentic and match the voice of the user.';
  } else if (contentType === 'marketing') {
    finalPrompt += 'Create marketing copy based on the content idea above. Make sure it follows the user\'s writing style and adheres to the best practices for marketing content. The copy should sound authentic and match the voice of the user.';
  }
  
  return finalPrompt;
}
