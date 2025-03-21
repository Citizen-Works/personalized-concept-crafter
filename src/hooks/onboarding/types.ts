
import { ChatMessage, ProfileData } from '@/services/onboardingAssistantService';
import { OnboardingModule } from './useOnboardingModules';

export interface OnboardingAssistantState {
  messages: ChatMessage[];
  isLoading: boolean;
  profileData: ProfileData | null;
  existingProfileData: ProfileData | null;
  extractedProfileData: ProfileData | null;
  isExtractionComplete: boolean;
  progress: number;
  currentModule?: OnboardingModule;
}

export interface OnboardingAssistantActions {
  sendMessage: (content: string) => Promise<void>;
  extractProfile: () => Promise<void>;
  clearChat: () => void;
  setCurrentModule: (module: OnboardingModule) => void;
  goToNextModule: () => void;
}

export interface UseOnboardingAssistantReturn extends OnboardingAssistantState, OnboardingAssistantActions {}
