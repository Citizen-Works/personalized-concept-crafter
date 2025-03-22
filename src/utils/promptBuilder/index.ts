
import { ContentIdea, ContentType, ContentPillar, TargetAudience } from '@/types';
import { User } from '@/types/user';
import { WritingStyleProfile } from '@/types/writingStyle';
import { PromptSection, PromptStructure } from './types';
import { buildBasePromptStructure, buildBusinessContextSection, buildContentPillarsSection, buildTargetAudiencesSection, buildWritingStyleSections } from './basePromptBuilder';
import { getBestPracticesSection } from './contentBestPractices';
import { getContentSpecificSections } from './contentSpecificSections';

/**
 * Builds a base prompt structure without requiring arguments
 */
export const buildBasePrompt = (): string => {
  return "I'll help you create effective content based on your inputs.\n\n";
};

/**
 * Adds LinkedIn posts examples to the prompt
 */
export const addLinkedinPostsToPrompt = (prompt: string, posts: any[]): string => {
  if (!posts || posts.length === 0) return prompt;
  
  prompt += "\n## RECENT LINKEDIN POSTS EXAMPLES\n\n";
  posts.slice(0, 3).forEach((post, index) => {
    prompt += `Post ${index + 1}:\n${post.content}\n\n`;
  });
  
  return prompt;
};

/**
 * Adds content idea information to the prompt
 */
export const addContentIdeaToPrompt = (prompt: string, idea: ContentIdea): string => {
  prompt += "\n## CONTENT IDEA\n\n";
  prompt += `${idea.title}\n\n`;
  
  if (idea.description) {
    prompt += "## DESCRIPTION\n\n";
    prompt += `${idea.description}\n\n`;
  }
  
  if (idea.notes) {
    prompt += "## NOTES\n\n";
    prompt += `${idea.notes}\n\n`;
  }
  
  return prompt;
};

/**
 * Adds custom instructions to the prompt
 */
export const addCustomInstructionsToPrompt = (prompt: string, instructions: string | null): string => {
  if (!instructions) return prompt;
  
  prompt += "\n## CUSTOM INSTRUCTIONS\n\n";
  prompt += `${instructions}\n\n`;
  
  return prompt;
};

/**
 * Adds the task description to the prompt
 */
export const addTaskToPrompt = (prompt: string, contentType: ContentType): string => {
  prompt += "\n## TASK\n\n";
  
  if (contentType === 'linkedin') {
    prompt += "Create a compelling LinkedIn post based on the content idea provided above. Follow the style guidelines and best practices to craft engaging, professional content that resonates with the target audience.\n\n";
  } else if (contentType === 'newsletter') {
    prompt += "Create newsletter content based on the idea provided above. Follow the style guidelines and best practices to craft informative, valuable content that readers will appreciate.\n\n";
  } else if (contentType === 'marketing') {
    prompt += "Create marketing copy based on the idea provided above. Follow the style guidelines and best practices to craft persuasive, conversion-focused content that drives action.\n\n";
  }
  
  return prompt;
};

/**
 * Adds patterns to avoid to the prompt
 */
export const addPatternsToAvoidToPrompt = (prompt: string, styleProfile: WritingStyleProfile | null): string => {
  if (!styleProfile || !styleProfile.avoidPatterns) return prompt;
  
  prompt += "\n## PATTERNS TO AVOID\n\n";
  prompt += `${styleProfile.avoidPatterns}\n\n`;
  
  return prompt;
};

/**
 * Adds personal stories to the prompt
 */
export const addPersonalStoriesToPrompt = (prompt: string, stories: any[]): string => {
  if (!stories || stories.length === 0) return prompt;
  
  prompt += "\n## PERSONAL STORIES TO REFERENCE\n\n";
  stories.slice(0, 2).forEach((story, index) => {
    prompt += `Story ${index + 1}: ${story.title}\n${story.content}\n\n`;
  });
  
  return prompt;
};

/**
 * Build a complete prompt structure with all content sections
 * Function kept for compatibility with test files
 */
export function buildPrompt(idea: ContentIdea, contentType: ContentType): PromptStructure {
  // Create basic sections from the idea
  const sections: PromptSection[] = [
    {
      title: 'Content Idea',
      content: idea.title
    },
    {
      title: 'Description',
      content: idea.description
    }
  ];
  
  // Add content-specific guidelines
  const contentTypeSections = getContentSpecificSections(contentType);
  sections.push(...contentTypeSections);
  
  // Return the complete structure
  return { sections };
}
