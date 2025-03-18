
import { supabase } from '@/integrations/supabase/client';
import { User, ContentPillar, TargetAudience, WritingStyleProfile } from '@/types';
import { WritingStyleProfile as StyleProfile } from '@/types/writingStyle';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ProfileData = {
  userProfile: Partial<User>;
  contentPillars: ContentPillar[];
  targetAudiences: TargetAudience[];
  writingStyle: Partial<StyleProfile>;
};

/**
 * Sends a message to the onboarding assistant
 */
export async function sendMessageToAssistant(
  userId: string,
  messages: ChatMessage[],
  existingProfileData?: ProfileData
): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke("onboarding-assistant", {
      body: {
        userId,
        messages,
        existingProfileData,
        extractProfile: false
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
