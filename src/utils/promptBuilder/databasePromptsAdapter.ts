
import { ContentType, ContentIdea, WritingStyleProfile, User, ContentPillar, TargetAudience, LinkedinPost, Document, PersonalStory } from '@/types';
import { getPromptTemplate } from '@/services/admin/promptGeneratorService';

/**
 * Builds a base prompt with user context, content pillars, target audiences, and writing style
 * This version uses database-stored templates when available
 */
export async function buildBasePromptFromDb(
  user: User | null, 
  contentPillars: ContentPillar[], 
  targetAudiences: TargetAudience[], 
  styleProfile: WritingStyleProfile | null,
  contentType: ContentType
): Promise<string> {
  let prompt = '';
  
  // Add user context
  if (user) {
    prompt += `# USER CONTEXT\n`;
    prompt += `Name: ${user.name || 'Not specified'}\n`;
    prompt += `Business: ${user.business_name || 'Not specified'}\n`;
    prompt += `Job Title: ${user.job_title || 'Not specified'}\n`;
    
    if (user.business_description) {
      prompt += `\n## Business Description\n${user.business_description}\n\n`;
    }
  }
  
  // Add content pillars
  if (contentPillars.length > 0) {
    prompt += `# CONTENT PILLARS\n`;
    contentPillars.forEach((pillar, index) => {
      prompt += `## ${index + 1}. ${pillar.name}\n`;
      if (pillar.description) {
        prompt += `${pillar.description}\n\n`;
      }
    });
  }
  
  // Add target audiences
  if (targetAudiences.length > 0) {
    prompt += `# TARGET AUDIENCES\n`;
    targetAudiences.forEach((audience, index) => {
      prompt += `## ${index + 1}. ${audience.name}\n`;
      
      if (audience.description) {
        prompt += `Description: ${audience.description}\n`;
      }
      
      if (audience.pain_points && audience.pain_points.length > 0) {
        prompt += `\nPain Points:\n`;
        audience.pain_points.forEach(point => prompt += `- ${point}\n`);
      }
      
      if (audience.goals && audience.goals.length > 0) {
        prompt += `\nGoals:\n`;
        audience.goals.forEach(goal => prompt += `- ${goal}\n`);
      }
      
      prompt += '\n';
    });
  }
  
  // Add writing style
  if (styleProfile) {
    prompt += `# WRITING STYLE\n`;
    
    if (styleProfile.voiceAnalysis) {
      prompt += `## Voice Analysis\n${styleProfile.voiceAnalysis}\n\n`;
    }
    
    if (styleProfile.generalStyleGuide) {
      prompt += `## General Style Guidelines\n${styleProfile.generalStyleGuide}\n\n`;
    }
    
    if (styleProfile.vocabularyPatterns) {
      prompt += `## Vocabulary and Language Patterns\n${styleProfile.vocabularyPatterns}\n\n`;
    }
    
    // Add content-specific style guides based on content type
    if (contentType === 'linkedin' && styleProfile.linkedinStyleGuide) {
      prompt += `## LinkedIn-Specific Style\n${styleProfile.linkedinStyleGuide}\n\n`;
    } else if (contentType === 'newsletter' && styleProfile.newsletterStyleGuide) {
      prompt += `## Newsletter-Specific Style\n${styleProfile.newsletterStyleGuide}\n\n`;
    } else if (contentType === 'marketing' && styleProfile.marketingStyleGuide) {
      prompt += `## Marketing-Specific Style\n${styleProfile.marketingStyleGuide}\n\n`;
    }
  }
  
  // Add best practices based on content type from database
  const bestPracticesTemplate = await getPromptTemplate(`best_practices_${contentType}`);
  if (bestPracticesTemplate) {
    prompt += `# BEST PRACTICES\n${bestPracticesTemplate}\n\n`;
  }
  
  return prompt;
}

/**
 * Adds LinkedIn posts to a prompt using the database template
 */
export async function addLinkedinPostsToPromptFromDb(prompt: string, posts: LinkedinPost[]): Promise<string> {
  const template = await getPromptTemplate('linkedin_posts_section');
  if (!template) return prompt;
  
  // Format the posts
  const formattedPosts = posts.map((post, index) => 
    `Example ${index + 1}:\n${post.content}\n---\n`
  ).join('\n');
  
  // Replace placeholder with actual content
  return prompt + template.replace('{posts}', formattedPosts) + '\n\n';
}

/**
 * Adds newsletter examples to a prompt using the database template
 */
export async function addNewsletterExamplesToPromptFromDb(prompt: string, examples: Document[]): Promise<string> {
  const template = await getPromptTemplate('newsletter_examples_section');
  if (!template) return prompt;
  
  // Format the examples
  const formattedExamples = examples.map((doc, index) => 
    `Example ${index + 1}: ${doc.title}\n${doc.content || 'No content available'}\n---\n`
  ).join('\n');
  
  // Replace placeholder with actual content
  return prompt + template.replace('{examples}', formattedExamples) + '\n\n';
}

/**
 * Adds marketing examples to a prompt using the database template
 */
export async function addMarketingExamplesToPromptFromDb(prompt: string, examples: Document[]): Promise<string> {
  const template = await getPromptTemplate('marketing_examples_section');
  if (!template) return prompt;
  
  // Format the examples
  const formattedExamples = examples.map((doc, index) => 
    `Example ${index + 1}: ${doc.title}\n${doc.content || 'No content available'}\n---\n`
  ).join('\n');
  
  // Replace placeholder with actual content
  return prompt + template.replace('{examples}', formattedExamples) + '\n\n';
}

/**
 * Adds business context documents to a prompt using the database template
 */
export async function addBusinessContextDocsToPromptFromDb(prompt: string, documents: Document[]): Promise<string> {
  const template = await getPromptTemplate('business_context_section');
  if (!template) return prompt;
  
  // Format the documents
  const formattedDocs = documents.map((doc, index) => 
    `Document ${index + 1}: ${doc.title}\n${doc.content || 'No content available'}\n---\n`
  ).join('\n');
  
  // Replace placeholder with actual content
  return prompt + template.replace('{documents}', formattedDocs) + '\n\n';
}

/**
 * Adds patterns to avoid section to prompt using the database template
 */
export async function addPatternsToAvoidToPromptFromDb(prompt: string, styleProfile: WritingStyleProfile | null): Promise<string> {
  if (!styleProfile || !styleProfile.avoidPatterns) return prompt;
  
  const template = await getPromptTemplate('patterns_to_avoid_section');
  if (!template) return prompt;
  
  // Replace placeholder with actual content
  return prompt + template.replace('{patterns}', styleProfile.avoidPatterns) + '\n\n';
}

/**
 * Adds content idea details to a prompt using the database template
 */
export async function addContentIdeaToPromptFromDb(basePrompt: string, idea: ContentIdea): Promise<string> {
  const template = await getPromptTemplate('content_idea_section');
  if (!template) return basePrompt;
  
  // Replace placeholders with actual content
  let content = template
    .replace('{title}', idea.title)
    .replace('{description}', idea.description || 'No description provided')
    .replace('{contentType}', idea.contentType || 'Not specified')
    .replace('{notes}', idea.notes || 'No additional notes');
  
  return basePrompt + content + '\n\n';
}

/**
 * Adds personal stories to a prompt using the database template
 */
export async function addPersonalStoriesToPromptFromDb(prompt: string, stories: PersonalStory[]): Promise<string> {
  if (!stories || stories.length === 0) return prompt;
  
  const template = await getPromptTemplate('personal_stories_section');
  if (!template) return prompt;
  
  // Format the stories
  const formattedStories = stories.map((story, index) => 
    `Story ${index + 1}: ${story.title}\n${story.content}\n${story.lesson ? `Lesson: ${story.lesson}` : ''}\n---\n`
  ).join('\n');
  
  // Replace placeholder with actual content
  return prompt + template.replace('{stories}', formattedStories) + '\n\n';
}

/**
 * Adds the task description to a prompt based on content type using the database template
 */
export async function addTaskToPromptFromDb(prompt: string, contentType: ContentType): Promise<string> {
  const template = await getPromptTemplate(`task_${contentType}`);
  if (!template) return prompt;
  
  return prompt + template + '\n\n';
}

/**
 * Adds custom instructions to a prompt
 */
export function addCustomInstructionsToPromptFromDb(prompt: string, customInstructions: string | null): string {
  if (!customInstructions) return prompt;
  
  return prompt + `# CUSTOM INSTRUCTIONS\n${customInstructions}\n\n`;
}
