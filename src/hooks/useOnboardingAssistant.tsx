
import { useState, useCallback, useEffect } from 'react';
import { User, ContentPillar, TargetAudience } from '@/types';
import { WritingStyleProfile } from '@/types/writingStyle';
import { useAuth } from '@/context/AuthContext';
import { 
  ChatMessage, 
  ProfileData, 
  sendMessageToAssistant, 
  extractProfileFromConversation 
} from '@/services/onboardingAssistantService';
import { fetchUserProfile } from '@/services/profile';
import { fetchContentPillars } from '@/services/profile';
import { fetchTargetAudiences } from '@/services/profile';
import { fetchWritingStyleProfile } from '@/services/profile/writingStyleService';
import { toast } from 'sonner';

export function useOnboardingAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [existingProfileData, setExistingProfileData] = useState<ProfileData | null>(null);
  const [extractedProfileData, setExtractedProfileData] = useState<ProfileData | null>(null);
  const [isExtractionComplete, setIsExtractionComplete] = useState(false);
  const { user } = useAuth();

  // Fetch existing profile data
  const fetchExistingProfileData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      const [userProfile, contentPillars, targetAudiences, writingStyle] = await Promise.all([
        fetchUserProfile(user.id),
        fetchContentPillars(user.id),
        fetchTargetAudiences(user.id),
        fetchWritingStyleProfile(user.id)
      ]);
      
      setExistingProfileData({
        userProfile: userProfile || {},
        contentPillars: contentPillars || [],
        targetAudiences: targetAudiences || [],
        writingStyle: writingStyle || {}
      });
    } catch (error) {
      console.error('Error fetching existing profile data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);
  
  useEffect(() => {
    fetchExistingProfileData();
  }, [fetchExistingProfileData]);

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
        // If user has existing data, acknowledge it
        setMessages([{
          role: 'assistant',
          content: `Welcome back! I'm your Content Strategy Assistant. I'm here to help you set up or update your profile for better content generation. I can see you already have some information in your profile. Would you like to review what we have, or focus on updating specific areas?`
        }]);
      } else {
        // First time setup
        setMessages([{
          role: 'assistant',
          content: `Hi there! I'm your Content Strategy Assistant. I'm here to help you set up your profile for better content generation. Let's have a conversation about your business, content goals, target audience, and writing style preferences. This will help me generate more relevant content for you later. How about we start with you telling me about your business?`
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
      const updatedMessages = [
        ...messages,
        { role: 'user', content }
      ];
      setMessages(updatedMessages);
      
      // Get response from Claude
      const response = await sendMessageToAssistant(
        user.id,
        updatedMessages,
        existingProfileData || undefined
      );
      
      // Add assistant response to chat
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get response from assistant');
    } finally {
      setIsLoading(false);
    }
  }, [messages, user?.id, existingProfileData]);

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

  // Clear the chat history
  const clearChat = useCallback(() => {
    setMessages([]);
    setExtractedProfileData(null);
    setIsExtractionComplete(false);
  }, []);

  return {
    messages,
    isLoading,
    existingProfileData,
    extractedProfileData,
    isExtractionComplete,
    sendMessage,
    extractProfile,
    clearChat
  };
}
