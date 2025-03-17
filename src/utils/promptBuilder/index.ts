
import { ContentType, ContentIdea, WritingStyleProfile, User, ContentPillar, TargetAudience, LinkedinPost } from '@/types';
import { PromptSection, PromptStructure } from './types';
import { buildBasePromptStructure } from './basePromptBuilder';
import { getBestPracticesSection } from './contentBestPractices';
import { 
  buildContentIdeaSection,
  buildLinkedinPostsSection,
  buildCustomInstructionsSection,
  buildTaskSection
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
 * Adds content idea details to a prompt
 */
export function addContentIdeaToPrompt(basePrompt: string, idea: ContentIdea): string {
  const ideaSection = buildContentIdeaSection(idea);
  return basePrompt + ideaSection.title + '\n' + ideaSection.content;
}

/**
 * Adds custom instructions to a prompt
 */
export function addCustomInstructionsToPrompt(prompt: string, customInstructions: string | null): string {
  const instructionsSection = buildCustomInstructionsSection(customInstructions);
  if (!instructionsSection) return prompt;
  
  return prompt + instructionsSection.title + '\n' + instructionsSection.content;
}

/**
 * Adds the task description to a prompt based on content type
 */
export function addTaskToPrompt(prompt: string, contentType: ContentType): string {
  const taskSection = buildTaskSection(contentType, prompt);
  return prompt + taskSection.title + '\n' + taskSection.content;
}

// Re-export everything for backwards compatibility
export * from './types';
export * from './basePromptBuilder';
export * from './contentBestPractices';
export * from './contentSpecificSections';
