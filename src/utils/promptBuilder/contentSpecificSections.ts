
import { ContentIdea, ContentType, LinkedinPost } from '@/types';
import { PromptSection } from './types';

/**
 * Creates a section containing content idea details
 */
export function buildContentIdeaSection(idea: ContentIdea): PromptSection {
  let content = '';
  
  content += `Title: ${idea.title}\n`;
  if (idea.description) {
    content += `Description: ${idea.description}\n`;
  }
  if (idea.notes) {
    content += `Notes: ${idea.notes}\n`;
  }
  if (idea.meetingTranscriptExcerpt) {
    content += `Meeting Transcript Excerpt: ${idea.meetingTranscriptExcerpt}\n`;
  }
  content += '\n';
  
  return {
    title: '# CONTENT IDEA',
    content
  };
}

/**
 * Creates a section containing previous LinkedIn posts
 */
export function buildLinkedinPostsSection(posts: LinkedinPost[]): PromptSection {
  let content = '';
  
  if (posts.length > 0) {
    posts.forEach(post => {
      content += '---BEGIN POST---\n';
      content += post.content + '\n';
      content += '---END POST---\n\n';
    });
  } else {
    content += 'No previous LinkedIn posts available.\n\n';
  }
  
  return {
    title: '# EXAMPLES OF PREVIOUS LINKEDIN POSTS',
    content
  };
}

/**
 * Creates a section containing custom instructions
 */
export function buildCustomInstructionsSection(customInstructions: string | null): PromptSection | null {
  if (!customInstructions) return null;
  
  return {
    title: '# CUSTOM INSTRUCTIONS',
    content: customInstructions + '\n\n'
  };
}

/**
 * Creates a task section based on content type
 */
export function buildTaskSection(contentType: ContentType, promptText: string): PromptSection {
  let content = '';
  
  if (contentType === 'linkedin') {
    const userName = promptText.split('helping ')[1]?.split(' of ')[0] || 'the user';
    content += `Write a LinkedIn post that sounds exactly like ${userName} based on their authentic voice, writing style, and vocabulary patterns. The post should:\n\n`;
    content += `1. Address the specified target audience needs and pain points\n`;
    content += `2. Align with the relevant content pillars\n`;
    content += `3. Follow LinkedIn best practices for formatting and engagement\n`;
    content += `4. Maintain the authentic voice shown in the previous posts\n`;
    content += `5. Be ready for publishing with minimal editing\n\n`;
    content += `IMPORTANT: Provide ONLY the text of the LinkedIn post. Do not include any explanations, commentaries, or notes about the post - just the post itself as it would appear on LinkedIn.`;
  } else if (contentType === 'newsletter') {
    content += 'Create newsletter content based on the content idea above. Make sure it follows the user\'s writing style and adheres to the best practices for newsletter content. The content should sound authentic and match the voice of the user.';
  } else if (contentType === 'marketing') {
    content += 'Create marketing copy based on the content idea above. Make sure it follows the user\'s writing style and adheres to the best practices for marketing content. The copy should sound authentic and match the voice of the user.';
  }
  
  return {
    title: '# TASK',
    content
  };
}
