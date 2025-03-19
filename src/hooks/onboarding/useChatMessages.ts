
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ChatMessage, ProfileData, sendMessageToAssistant } from '@/services/onboardingAssistantService';
import { toast } from 'sonner';

export function useChatMessages(existingProfileData: ProfileData | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Initialize chat with welcome message
  useEffect(() => {
    if (existingProfileData && messages.length === 0) {
      const hasData = !!(
        existingProfileData.userProfile?.businessName || 
        (existingProfileData.contentPillars && existingProfileData.contentPillars.length > 0) ||
        (existingProfileData.targetAudiences && existingProfileData.targetAudiences.length > 0) ||
        existingProfileData.writingStyle?.voiceAnalysis
      );
      
      if (hasData) {
        // If user has existing data, acknowledge it with a more consultative approach
        setMessages([{
          role: 'assistant',
          content: `Welcome back! I'm your Content Strategy Consultant. I see you already have some information in your profile. What would you like to focus on today?

Would you like to:
• Refine your current content strategy?
• Update your business information?
• Explore new target audiences?
• Fine-tune your content pillars?
• Work on your writing style and voice?

Or is there something else specific you'd like to discuss about your content strategy?`
        }]);
      } else {
        // First time setup - consultative approach
        setMessages([{
          role: 'assistant',
          content: `Hi there! I'm your Content Strategy Consultant. I'm here to help you develop a content strategy that truly resonates with your audience and supports your business goals.

Let's start by understanding your business better. Could you tell me about what your business does, who you serve, and what makes your approach unique?`
        }]);
      }
    }
  }, [existingProfileData, messages.length]);

  // Send a message to the assistant
  const sendMessage = useCallback(async (content: string) => {
    if (!user?.id || !content.trim()) return;

    try {
      setIsLoading(true);
      
      // Add user message to chat
      const userMsg: ChatMessage = { role: 'user', content };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      
      // Get response from Claude
      const response = await sendMessageToAssistant(
        user.id,
        updatedMessages,
        existingProfileData || undefined
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
  }, [messages, user?.id, existingProfileData]);

  // Clear the chat history
  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat
  };
}
