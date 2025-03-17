
import { ContentType } from '@/types';
import { PromptSection } from './types';

/**
 * Provides the best practices section for different content types
 */
export function getBestPracticesSection(contentType: ContentType): PromptSection {
  let content = '';
  
  if (contentType === 'linkedin') {
    content = `## LINKEDIN CONTENT BEST PRACTICES:

FORMAT & STRUCTURE:
- Keep posts concise (1-7 paragraphs)
- Use short paragraphs (1-3 sentences maximum)
- Include line breaks between all paragraphs for readability
- Utilize strategic whitespace to improve engagement
- Start with an attention-grabbing hook that appears in previews and is 8 words or less.
- Do not use emojis

CONTENT APPROACH:
- Begin with a hook that addresses a pain point or surprising insight and specifically would appeal to my target audience
- Focus on ONE clear message per post
- Include specific, tangible metrics or results when possible
- Share a personal story, lesson, or experience when relevant
- End with an engaging question or clear call-to-action
- Avoid generic business advice; provide unique, counterintuitive insights
- Use realistic examples of user's work

ENGAGEMENT TACTICS:
- Craft content that's easy to skim yet valuable
- Incorporate questions that encourage comments
- Make strong, slightly controversial statements when appropriate
- Use "I" statements to make content feel personal and authentic
- Include a clear takeaway readers can implement immediately

- Hook the reader in the first 3 lines with a compelling statement, question, or statistic
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
    content = `- Include a compelling subject line/headline
- Start with an engaging introduction that connects with the reader
- Break content into scannable sections with clear subheadings
- Include practical, actionable insights
- Balance educational content with storytelling
- End with a clear call to action or next steps
- Maintain a consistent voice throughout\n\n`;
  } else if (contentType === 'marketing') {
    content = `- Lead with clear, benefit-focused messaging
- Use active voice and present tense
- Create a sense of urgency where appropriate
- Focus on solving customer problems, not just features
- Include specific, measurable results when possible
- End with a clear, compelling call to action
- Keep sentences and paragraphs short and impactful\n\n`;
  }
  
  return {
    title: '# BEST PRACTICES',
    content
  };
}
