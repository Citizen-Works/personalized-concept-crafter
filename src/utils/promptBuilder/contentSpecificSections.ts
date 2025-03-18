
import { ContentIdea, ContentType, LinkedinPost, Document, WritingStyleProfile } from '@/types';
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
 * Creates a section containing newsletter examples
 */
export function buildNewsletterExamplesSection(examples: Document[]): PromptSection {
  let content = '';
  
  if (examples.length > 0) {
    examples.forEach(example => {
      content += '---BEGIN NEWSLETTER---\n';
      if (example.title) {
        content += `Title: ${example.title}\n\n`;
      }
      content += example.content + '\n';
      content += '---END NEWSLETTER---\n\n';
    });
  } else {
    content += 'No newsletter examples available.\n\n';
  }
  
  return {
    title: '# EXAMPLES OF PREVIOUS NEWSLETTERS',
    content
  };
}

/**
 * Creates a section containing marketing examples
 */
export function buildMarketingExamplesSection(examples: Document[]): PromptSection {
  let content = '';
  
  if (examples.length > 0) {
    examples.forEach(example => {
      content += '---BEGIN MARKETING CONTENT---\n';
      if (example.title) {
        content += `Title: ${example.title}\n\n`;
      }
      content += example.content + '\n';
      content += '---END MARKETING CONTENT---\n\n';
    });
  } else {
    content += 'No marketing examples available.\n\n';
  }
  
  return {
    title: '# EXAMPLES OF PREVIOUS MARKETING CONTENT',
    content
  };
}

/**
 * Creates a section containing business context from documents
 */
export function buildBusinessContextDocsSection(documents: Document[]): PromptSection {
  let content = '';
  
  if (documents.length > 0) {
    content += 'The following documents provide additional business context:\n\n';
    
    documents.forEach(doc => {
      content += `--- ${doc.title} ---\n`;
      content += doc.content + '\n\n';
    });
  } else {
    content += 'No additional business context documents available.\n\n';
  }
  
  return {
    title: '# ADDITIONAL BUSINESS CONTEXT',
    content
  };
}

/**
 * Creates a section containing patterns to avoid
 * This will be placed near the end of the prompt for emphasis
 */
export function buildAvoidPatternsSection(styleProfile: WritingStyleProfile | null): PromptSection {
  let content = '';
  
  // Add user-specific patterns to avoid if available
  if (styleProfile && styleProfile.avoidPatterns) {
    content += styleProfile.avoidPatterns + '\n\n';
  }
  
  // Add the common AI writing patterns to avoid
  content += 'Critically important patterns to avoid:\n';
  content += '- Avoid formulaic transitions and setups. Specifically, don\'t use short phrase + question mark/colon constructions (like \'The result?\' or \'Here\'s why:\' or \'My thoughts?\'). Instead, use more natural, varied sentence structures and transitions that flow organically without relying on these predictable patterns.\n';
  content += '- Avoid rhetorical questions as transitions.\n';
  content += '- Skip predictable setups and just state insights directly.\n';
  content += '- Use a more conversational flow without manufactured \'turning points\' in the content.\n';
  content += '- Avoid list-based structures unless specifically requested.\n';
  content += '- Avoid explicitly stating "In conclusion" or similar phrases that signal the end of the content.\n\n';
  
  return {
    title: '# PATTERNS TO AVOID',
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
    content += `IMPORTANT: Provide ONLY the text of the LinkedIn post. Do not include any explanations, commentaries, or notes about the post - just the post itself as it would appear on LinkedIn. Do not address the user.`;
  } else if (contentType === 'newsletter') {
    content += 'Create newsletter content based on the content idea above. Make sure it follows the user\'s writing style and adheres to the best practices for newsletter content. The content should sound authentic and match the voice of the user. Do not address the user in your output. Respond with ONLY the text of the newsletter without additional comments or notes.';
  } else if (contentType === 'marketing') {
    content += 'Create marketing copy based on the content idea above. Make sure it follows the user\'s writing style and adheres to the best practices for marketing content. The copy should sound authentic and match the voice of the user. Do not address the user in your output. Respond with ONLY the text of the marketing copy without additional comments or notes.';
  }
  
  return {
    title: '# TASK',
    content
  };
}
