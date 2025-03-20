import { ContentType, ContentIdea, WritingStyleProfile, User, ContentPillar, TargetAudience, LinkedinPost, Document } from '@/types';
import { PromptSection, PromptStructure } from './types';
import { buildBasePromptStructure } from './basePromptBuilder';
import { getBestPracticesSection } from './contentBestPractices';
import { 
  buildContentIdeaSection,
  buildLinkedinPostsSection,
  buildCustomInstructionsSection,
  buildTaskSection,
  buildNewsletterExamplesSection,
  buildMarketingExamplesSection,
  buildBusinessContextDocsSection,
  buildAvoidPatternsSection,
  buildPersonalStoriesSection
} from './contentSpecificSections';

/**
 * Converts a prompt structure to a string
 */
function promptStructureToString(structure: PromptStructure): string {
  return structure.sections
    .filter(section => section && section.content)
    .map(section => `${section.title ? section.title + '\n' : ''}${section.content}`)
    .join('');
}

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
  // Build the base prompt structure
  const promptStructure = buildBasePromptStructure(
    user,
    contentPillars,
    targetAudiences,
    styleProfile,
    contentType
  );
  
  // Add best practices based on content type
  promptStructure.sections.push(getBestPracticesSection(contentType));
  
  // Convert the structure to string
  return promptStructureToString(promptStructure);
}

/**
 * Adds LinkedIn posts to a prompt
 */
export function addLinkedinPostsToPrompt(prompt: string, posts: LinkedinPost[]): string {
  const postsSection = buildLinkedinPostsSection(posts);
  return prompt + postsSection.title + '\n' + postsSection.content;
}

/**
 * Adds newsletter examples to a prompt
 */
export function addNewsletterExamplesToPrompt(prompt: string, examples: Document[]): string {
  const examplesSection = buildNewsletterExamplesSection(examples);
  return prompt + examplesSection.title + '\n' + examplesSection.content;
}

/**
 * Adds marketing examples to a prompt
 */
export function addMarketingExamplesToPrompt(prompt: string, examples: Document[]): string {
  const examplesSection = buildMarketingExamplesSection(examples);
  return prompt + examplesSection.title + '\n' + examplesSection.content;
}

/**
 * Adds business context documents to a prompt
 */
export function addBusinessContextDocsToPrompt(prompt: string, documents: Document[]): string {
  const docsSection = buildBusinessContextDocsSection(documents);
  return prompt + docsSection.title + '\n' + docsSection.content;
}

/**
 * Adds patterns to avoid section to prompt (moved toward the end)
 */
export function addPatternsToAvoidToPrompt(prompt: string, styleProfile: WritingStyleProfile | null): string {
  const patternsSection = buildAvoidPatternsSection(styleProfile);
  return prompt + patternsSection.title + '\n' + patternsSection.content;
}

/**
 * Adds content idea details to a prompt (moved toward the end)
 */
export function addContentIdeaToPrompt(basePrompt: string, idea: ContentIdea): string {
  const ideaSection = buildContentIdeaSection(idea);
  return basePrompt + ideaSection.title + '\n' + ideaSection.content;
}

/**
 * Adds custom instructions to a prompt (moved toward the end)
 */
export function addCustomInstructionsToPrompt(prompt: string, customInstructions: string | null): string {
  const instructionsSection = buildCustomInstructionsSection(customInstructions);
  if (!instructionsSection) return prompt;
  
  return prompt + instructionsSection.title + '\n' + instructionsSection.content;
}

/**
 * Adds the task description to a prompt based on content type (final section)
 */
export function addTaskToPrompt(prompt: string, contentType: ContentType): string {
  const taskSection = buildTaskSection(contentType, prompt);
  return prompt + taskSection.title + '\n' + taskSection.content;
}

/**
 * Adds personal stories to a prompt
 */
export function addPersonalStoriesToPrompt(prompt: string, stories: PersonalStory[]): string {
  const storiesSection = buildPersonalStoriesSection(stories);
  return prompt + storiesSection.title + '\n' + storiesSection.content;
}

// Re-export everything for backwards compatibility
export * from './types';
export * from './basePromptBuilder';
export * from './contentBestPractices';
export * from './contentSpecificSections';
