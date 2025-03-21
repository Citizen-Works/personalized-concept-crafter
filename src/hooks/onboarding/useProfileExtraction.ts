
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/auth';
import { ChatMessage, ProfileData, extractProfileFromConversation } from '@/services/onboardingAssistantService';
import { toast } from 'sonner';

export function useProfileExtraction(messages: ChatMessage[]) {
  const [extractedProfileData, setExtractedProfileData] = useState<ProfileData | null>(null);
  const [isExtractionComplete, setIsExtractionComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Extract profile data from conversation
  const extractProfile = useCallback(async () => {
    if (!user?.id || messages.length === 0) return;
    
    try {
      setIsLoading(true);
      setIsExtractionComplete(false);
      
      const extractedData = await extractProfileFromConversation(user.id, messages);
      
      if (extractedData) {
        setExtractedProfileData(extractedData);
        setIsExtractionComplete(true);
      } else {
        toast.error('Could not extract profile information from conversation');
      }
    } catch (error) {
      console.error('Error extracting profile:', error);
      toast.error('Failed to analyze conversation');
    } finally {
      setIsLoading(false);
    }
  }, [messages, user?.id]);

  return {
    extractedProfileData,
    isExtractionComplete,
    isLoading,
    extractProfile
  };
}
