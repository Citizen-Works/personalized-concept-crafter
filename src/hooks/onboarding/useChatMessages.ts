
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { ChatMessage, ProfileData, sendMessageToAssistant } from '@/services/onboardingAssistantService';
import { toast } from 'sonner';
import { OnboardingPath } from '@/pages/OnboardingPage';
import { OnboardingModule } from './useOnboardingModules';

export function useChatMessages(
  existingProfileData: ProfileData | null,
  onboardingPath: OnboardingPath = 'guided',
  currentModule?: OnboardingModule
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Initialize chat with welcome message based on onboarding path and module
  const initializeChat = useCallback((module?: OnboardingModule) => {
    if (!module) return;
    
    const hasExistingData = !!(
      existingProfileData && (
        existingProfileData.userProfile?.businessName || 
        (existingProfileData.contentPillars && existingProfileData.contentPillars.length > 0) ||
        (existingProfileData.targetAudiences && existingProfileData.targetAudiences.length > 0) ||
        existingProfileData.writingStyle?.voiceAnalysis
      )
    );
    
    let initialMessage = '';
    
    switch (module.id) {
      case 'business-foundations':
        initialMessage = hasExistingData 
          ? `I see you already have some business information in your profile. Let's review and enhance it. Could you tell me a bit more about what your business does and what makes your approach unique?`
          : `Let's start by understanding your business better. Could you tell me about what your business does, who you serve, and what makes your approach unique?`;
        break;
      case 'audience-analysis':
        initialMessage = hasExistingData && existingProfileData?.targetAudiences?.length > 0
          ? `I see you've already defined some target audiences. Let's review and refine them. What are the key pain points your content should address for your audience?`
          : `Now, let's identify your target audience. Who are the specific people you want to reach with your content? What challenges do they face that your business helps solve?`;
        break;
      case 'content-strategy':
        initialMessage = hasExistingData && existingProfileData?.contentPillars?.length > 0
          ? `You already have some content pillars defined. Let's review and refine your content strategy. What topics do you feel most confident speaking about related to your business?`
          : `Now let's develop your content pillars - these are the 3-5 key topics your content will focus on. What subject areas are most relevant to your business and audience?`;
        break;
      case 'voice-style':
        initialMessage = hasExistingData && existingProfileData?.writingStyle?.voiceAnalysis
          ? `I see you've already defined some aspects of your writing style. Let's refine it. How would you describe the tone you want to use in your content?`
          : `Finally, let's define your content's voice and style. How would you describe your brand's personality? For example: professional, conversational, authoritative, friendly, etc.`;
        break;
      default:
        initialMessage = `Welcome to the Content Engine onboarding process. I'm your Content Strategy Consultant. I'll guide you through setting up your profile with a ${onboardingPath} approach. What would you like to start with?`;
    }
    
    // Add path-specific depth to questions
    if (onboardingPath === 'discovery' && initialMessage) {
      initialMessage += ` Take your time to think deeply about this - we're building a foundation for all your future content.`;
    } else if (onboardingPath === 'express' && initialMessage) {
      initialMessage += ` Feel free to provide a concise overview so we can move efficiently through the process.`;
    }
    
    setMessages([{
      role: 'assistant',
      content: initialMessage
    }]);
  }, [existingProfileData, onboardingPath]);

  // Initialize on first load or module change
  useEffect(() => {
    if (currentModule && (messages.length === 0 || 
      (messages.length === 1 && messages[0].role === 'assistant'))) {
      initializeChat(currentModule);
    }
  }, [currentModule, messages.length, initializeChat]);

  // Send a message to the assistant
  const sendMessage = useCallback(async (content: string) => {
    if (!user?.id || !content.trim()) return;

    try {
      setIsLoading(true);
      
      // Add user message to chat
      const userMsg: ChatMessage = { role: 'user', content };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      
      // Include path and module context in metadata
      const contextMetadata = {
        onboardingPath,
        currentModule: currentModule?.id || 'unknown',
        moduleTitle: currentModule?.title || 'unknown'
      };
      
      // Get response from Claude
      const response = await sendMessageToAssistant(
        user.id,
        updatedMessages,
        existingProfileData || undefined,
        contextMetadata
      );
      
      // Add assistant response to chat
      const assistantMsg: ChatMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get response from assistant');
    } finally {
      setIsLoading(false);
    }
  }, [messages, user?.id, existingProfileData, onboardingPath, currentModule]);

  // Clear the chat history
  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    initializeChat
  };
}
