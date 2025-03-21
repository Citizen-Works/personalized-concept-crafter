
import { OnboardingPath } from '@/pages/OnboardingPage';

// Define the structure for an onboarding module
export interface OnboardingModule {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  order: number;
  hint: string;
  initialPrompt: string;
}

// Define modules for each part of the onboarding process
export const ONBOARDING_MODULES: OnboardingModule[] = [
  {
    id: 'business-foundations',
    title: 'Business Foundations',
    description: 'Essential information about your business',
    estimatedTime: '5-10 min',
    order: 1,
    hint: 'Share details about your business, industry, and what makes you unique.',
    initialPrompt: 'business_foundations'
  },
  {
    id: 'audience-analysis',
    title: 'Audience Analysis',
    description: 'Define your target audiences',
    estimatedTime: '10-15 min',
    order: 2,
    hint: 'Describe who your content is for, their challenges, and goals.',
    initialPrompt: 'audience_analysis'
  },
  {
    id: 'content-strategy',
    title: 'Content Strategy',
    description: 'Plan your content approach',
    estimatedTime: '10-15 min',
    order: 3,
    hint: 'Define your content pillars and key topics you'll create content about.',
    initialPrompt: 'content_strategy'
  },
  {
    id: 'voice-style',
    title: 'Voice & Style',
    description: 'Establish your brand voice',
    estimatedTime: '5-10 min',
    order: 4,
    hint: 'Define how your content should sound and feel to readers.',
    initialPrompt: 'voice_style'
  }
];

// Get modules based on the selected onboarding path
export function getModulesForPath(path: OnboardingPath): OnboardingModule[] {
  const allModules = [...ONBOARDING_MODULES];
  
  switch (path) {
    case 'express':
      // Express path has fewer questions per module
      return allModules;
    case 'guided':
      // Guided path has all modules with standard questions
      return allModules;
    case 'discovery':
      // Discovery path has all modules with deeper questions
      return allModules;
    default:
      return allModules;
  }
}

// Get initial module for a path
export function getInitialModule(path: OnboardingPath): OnboardingModule {
  return getModulesForPath(path)[0];
}

// Get next module in sequence
export function getNextModule(currentModuleId: string, path: OnboardingPath): OnboardingModule | null {
  const modules = getModulesForPath(path);
  const currentIndex = modules.findIndex(m => m.id === currentModuleId);
  
  if (currentIndex === -1 || currentIndex === modules.length - 1) {
    return null; // No next module
  }
  
  return modules[currentIndex + 1];
}
