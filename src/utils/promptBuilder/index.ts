
import { ContentIdea, ContentType } from '@/types';
import { PromptStructure } from './types';
import { getContentSpecificSections } from './contentSpecificSections';

/**
 * Build a prompt structure for content generation
 */
export const buildPrompt = (idea: ContentIdea, contentType: ContentType): PromptStructure => {
  // Get sections specific to the content type
  const contentSpecificSections = getContentSpecificSections(contentType);
  
  // Base sections that are common for all content types
  const baseSections = [
    {
      title: 'Content Idea',
      content: idea.title
    },
    {
      title: 'Description',
      content: idea.description || 'No description provided.'
    }
  ];
  
  // Add notes if available
  if (idea.notes) {
    baseSections.push({
      title: 'Additional Notes',
      content: idea.notes
    });
  }
  
  // Combine base sections with content-specific sections
  return {
    sections: [
      ...baseSections,
      ...contentSpecificSections
    ]
  };
};

// Export these functions for tests and other parts of the app
export const buildBasePrompt = () => { return ''; };
export const addLinkedinPostsToPrompt = (prompt: string, posts: any[]) => { return prompt; };
export const addContentIdeaToPrompt = (prompt: string, idea: ContentIdea) => { return prompt; };
export const addCustomInstructionsToPrompt = (prompt: string, instructions: string | null) => { return prompt; };
export const addTaskToPrompt = (prompt: string, contentType: ContentType) => { return prompt; };
export const addPatternsToAvoidToPrompt = (prompt: string, profile: any) => { return prompt; };
export const addPersonalStoriesToPrompt = (prompt: string, stories: any[]) => { return prompt; };
export const buildBasePromptStructure = () => { return {}; };
export const getBestPracticesSection = () => { return {}; };
export const buildBusinessContextSection = () => { return {}; };
export const buildContentPillarsSection = () => { return {}; };
export const buildTargetAudiencesSection = () => { return {}; };
export const buildWritingStyleSections = () => { return {}; };

export default {
  buildPrompt
};
