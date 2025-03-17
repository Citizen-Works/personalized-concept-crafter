
import { ContentType, ContentIdea, WritingStyleProfile, User, ContentPillar, TargetAudience } from '@/types';

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
  
  return prompt;
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
    finalPrompt += 'Create a LinkedIn post based on the content idea above. Make sure it follows the user\'s writing style and adheres to the best practices for LinkedIn content. The post should sound authentic and match the voice of the user.';
  } else if (contentType === 'newsletter') {
    finalPrompt += 'Create newsletter content based on the content idea above. Make sure it follows the user\'s writing style and adheres to the best practices for newsletter content. The content should sound authentic and match the voice of the user.';
  } else if (contentType === 'marketing') {
    finalPrompt += 'Create marketing copy based on the content idea above. Make sure it follows the user\'s writing style and adheres to the best practices for marketing content. The copy should sound authentic and match the voice of the user.';
  }
  
  return finalPrompt;
}
