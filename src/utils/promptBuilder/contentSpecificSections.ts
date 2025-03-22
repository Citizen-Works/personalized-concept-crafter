
import { ContentType } from '@/types';
import { PromptSection } from './types';

/**
 * Get content-specific sections for prompt building
 */
export const getContentSpecificSections = (contentType: ContentType): PromptSection[] => {
  switch (contentType) {
    case 'linkedin':
      return [
        {
          title: 'LinkedIn Specific Guidelines',
          content: `
- Keep posts professional but conversational
- Include 2-3 relevant hashtags
- Keep paragraphs short for mobile readability
- Consider including a question to encourage engagement
- Ideal length: 1300-1500 characters`
        }
      ];
    case 'newsletter':
      return [
        {
          title: 'Newsletter Specific Guidelines',
          content: `
- Include a clear, engaging subject line
- Start with a personal greeting
- Structure content with headers and bullet points
- Include a clear call-to-action
- End with a personal sign-off
- Ideal length: 500-800 words`
        }
      ];
    case 'marketing':
      return [
        {
          title: 'Marketing Content Specific Guidelines',
          content: `
- Focus on benefits rather than features
- Use persuasive language and strong call-to-actions
- Include relevant statistics or social proof
- Address potential objections
- Maintain brand voice and messaging
- Ideal length depends on medium (social post vs. landing page)`
        }
      ];
    default:
      return [];
  }
};
