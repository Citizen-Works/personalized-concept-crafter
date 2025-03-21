
import { useState, useCallback, useEffect } from 'react';
import { useProfileData } from './onboarding/useProfileData';
import { useChatMessages } from './onboarding/useChatMessages';
import { useProfileExtraction } from './onboarding/useProfileExtraction';
import { UseOnboardingAssistantReturn } from './onboarding/types';
import { OnboardingPath } from '@/pages/OnboardingPage';
import { 
  OnboardingModule, 
  getInitialModule, 
  getNextModule, 
  getModulesForPath
} from './onboarding/useOnboardingModules';

export function useOnboardingAssistant(
  onboardingPath: OnboardingPath = 'guided'
): UseOnboardingAssistantReturn {
  const [profileData, setProfileData] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentModule, setCurrentModule] = useState<OnboardingModule | undefined>(
    getInitialModule(onboardingPath)
  );
  
  const { existingProfileData, isLoading: isLoadingProfile } = useProfileData();
  
  const { 
    messages, 
    sendMessage, 
    clearChat,
    isLoading: isLoadingChat,
    initializeChat 
  } = useChatMessages(existingProfileData, onboardingPath, currentModule);
  
  const {
    extractedProfileData,
    isExtractionComplete,
    extractProfile,
    isLoading: isLoadingExtraction
  } = useProfileExtraction(messages);
  
  // Track progress based on messages and modules
  useEffect(() => {
    if (messages.length === 0) return;
    
    const modules = getModulesForPath(onboardingPath);
    const userMessages = messages.filter(m => m.role === 'user');
    
    // Calculate progress based on the number of user responses and total modules
    const messagesWeight = 0.7; // 70% weight to message count
    const moduleWeight = 0.3; // 30% weight to module progression
    
    const messageProgress = Math.min(
      userMessages.length / (modules.length * 5), // Assume ~5 messages per module
      1
    ) * 100 * messagesWeight;
    
    const currentModuleIndex = currentModule 
      ? modules.findIndex(m => m.id === currentModule.id)
      : 0;
    
    const moduleProgress = (currentModuleIndex / modules.length) * 100 * moduleWeight;
    
    setProgress(Math.min(Math.round(messageProgress + moduleProgress), 99));
  }, [messages, currentModule, onboardingPath]);
  
  // Track module progression based on conversation context
  useEffect(() => {
    if (messages.length < 6) return; // Need a few exchanges before evaluating
    
    const lastAssistantMessage = [...messages]
      .reverse()
      .find(m => m.role === 'assistant')?.content || '';
    
    // Check if current module seems complete based on message content
    const moduleCompletionPhrases = [
      "move on to the next section",
      "let's talk about your target audience",
      "now let's discuss your content strategy",
      "let's define your writing style",
      "great, we've completed"
    ];
    
    const seemsComplete = moduleCompletionPhrases.some(phrase => 
      lastAssistantMessage.toLowerCase().includes(phrase.toLowerCase())
    );
    
    if (seemsComplete && currentModule) {
      const nextModule = getNextModule(currentModule.id, onboardingPath);
      if (nextModule) {
        setCurrentModule(nextModule);
      }
    }
  }, [messages, currentModule, onboardingPath]);
  
  // Clear chat and reset progress
  const handleClearChat = useCallback(() => {
    clearChat();
    setProfileData(null);
    setProgress(0);
    setCurrentModule(getInitialModule(onboardingPath));
  }, [clearChat, onboardingPath]);
  
  // Handle transitions between modules
  const goToNextModule = useCallback(() => {
    if (!currentModule) return;
    
    const nextModule = getNextModule(currentModule.id, onboardingPath);
    if (nextModule) {
      setCurrentModule(nextModule);
      // Optionally send a transition message to the AI
      sendMessage(`I'd like to move on to ${nextModule.title} now.`);
    }
  }, [currentModule, onboardingPath, sendMessage]);
  
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
    clearChat: handleClearChat,
    progress,
    currentModule,
    setCurrentModule,
    goToNextModule
  };
}
