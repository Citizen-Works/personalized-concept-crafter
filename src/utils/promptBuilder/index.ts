
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

export default {
  buildPrompt
};
