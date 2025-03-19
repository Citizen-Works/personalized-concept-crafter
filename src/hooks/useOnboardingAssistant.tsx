
import { useState } from 'react';
import { useProfileData } from './onboarding/useProfileData';
import { useChatMessages } from './onboarding/useChatMessages';
import { useProfileExtraction } from './onboarding/useProfileExtraction';
import { UseOnboardingAssistantReturn } from './onboarding/types';

export function useOnboardingAssistant(): UseOnboardingAssistantReturn {
  const [profileData, setProfileData] = useState(null);
  const { existingProfileData, isLoading: isLoadingProfile } = useProfileData();
  
  const { 
    messages, 
    sendMessage, 
    clearChat,
    isLoading: isLoadingChat 
  } = useChatMessages(existingProfileData);
  
  const {
    extractedProfileData,
    isExtractionComplete,
    extractProfile,
    isLoading: isLoadingExtraction
  } = useProfileExtraction(messages);
  
  // Combine clear chat to also clear extracted profile
  const handleClearChat = () => {
    clearChat();
    setProfileData(null);
  };
  
  // Determine if any async operation is loading
  const isLoading = isLoadingProfile || isLoadingChat || isLoadingExtraction;

  return {
    messages,
    isLoading,
    profileData,
    existingProfileData,
    extractedProfileData,
    isExtractionComplete,
    sendMessage,
    extractProfile,
    clearChat: handleClearChat
  };
}
