
import { supabase } from '@/integrations/supabase/client';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

// For creating new pillars and audiences during onboarding
export type NewContentPillar = {
  name: string;
  description: string;
};

export type NewTargetAudience = {
  name: string;
  description: string;
  painPoints: string[];
  goals: string[];
};

export type ProfileData = {
  userProfile: {
    businessName?: string;
    businessDescription?: string;
    linkedinUrl?: string;
    jobTitle?: string;
    email?: string;
    name?: string;
  };
  contentPillars: NewContentPillar[];
  targetAudiences: NewTargetAudience[];
  writingStyle: {
    voiceAnalysis?: string;
    generalStyleGuide?: string;
    linkedinStyleGuide?: string;
    newsletterStyleGuide?: string;
    marketingStyleGuide?: string;
    vocabularyPatterns?: string;
    avoidPatterns?: string;
  };
};

// Metadata to provide context for different onboarding paths and modules
export type OnboardingContextMetadata = {
  onboardingPath?: string;
  currentModule?: string;
  moduleTitle?: string;
};

/**
 * Sends a message to the onboarding assistant
 */
export async function sendMessageToAssistant(
  userId: string,
  messages: ChatMessage[],
  existingProfileData?: ProfileData,
  contextMetadata?: OnboardingContextMetadata
): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke("onboarding-assistant", {
      body: {
        userId,
        messages,
        existingProfileData,
        extractProfile: false,
        contextMetadata
      }
    });

    if (error) {
      throw new Error(error.message || 'Failed to communicate with assistant');
    }

    if (!data?.message) {
      throw new Error('No response from assistant');
    }

    return data.message;
  } catch (error) {
    console.error('Error sending message to assistant:', error);
    throw error;
  }
}

/**
 * Extracts profile data from the conversation history
 */
export async function extractProfileFromConversation(
  userId: string,
  messages: ChatMessage[]
): Promise<ProfileData | null> {
  try {
    const { data, error } = await supabase.functions.invoke("onboarding-assistant", {
      body: {
        userId,
        messages,
        extractProfile: true
      }
    });

    if (error) {
      throw new Error(error.message || 'Failed to extract profile data');
    }

    if (!data?.profileData) {
      console.error('No profile data extracted:', data);
      return null;
    }

    return data.profileData as ProfileData;
  } catch (error) {
    console.error('Error extracting profile data:', error);
    throw error;
  }
}
