
import { ChatMessage, ProfileData } from '@/services/onboardingAssistantService';

export interface OnboardingAssistantState {
  messages: ChatMessage[];
  isLoading: boolean;
  profileData: ProfileData | null;
  existingProfileData: ProfileData | null;
  extractedProfileData: ProfileData | null;
  isExtractionComplete: boolean;
}

export interface OnboardingAssistantActions {
  sendMessage: (content: string) => Promise<void>;
  extractProfile: () => Promise<void>;
  clearChat: () => void;
}

export interface UseOnboardingAssistantReturn extends OnboardingAssistantState, OnboardingAssistantActions {}
