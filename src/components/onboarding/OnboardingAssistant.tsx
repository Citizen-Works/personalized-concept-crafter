
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, X } from 'lucide-react';
import { useOnboardingAssistant } from '@/hooks/useOnboardingAssistant';
import OnboardingChat from './OnboardingChat';
import ProfileReview from './ProfileReview';
import { saveProfileData } from '@/services/profileDataService';
import { useAuth } from '@/context/AuthContext';

interface OnboardingAssistantProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

const OnboardingAssistant: React.FC<OnboardingAssistantProps> = ({ 
  onClose,
  showCloseButton = true
}) => {
  const {
    messages,
    isLoading,
    extractedProfileData,
    isExtractionComplete,
    sendMessage,
    extractProfile,
    clearChat,
  } = useOnboardingAssistant();
  
  const [currentStep, setCurrentStep] = useState<'chat' | 'review'>('chat');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleFinishChat = async () => {
    try {
      await extractProfile();
      setCurrentStep('review');
    } catch (error) {
      console.error('Error extracting profile:', error);
      toast.error('Failed to analyze conversation');
    }
  };
  
  const handleContinueChat = () => {
    setCurrentStep('chat');
  };
  
  const handleSaveProfile = async (profileData: any) => {
    if (!user?.id) {
      toast.error('You must be logged in to save profile data');
      return;
    }
    
    const success = await saveProfileData(user.id, profileData);
    
    if (success) {
      toast.success('Profile data saved successfully!');
      // Clear the chat after saving
      clearChat();
      
      // Navigate to dashboard or close the assistant
      if (onClose) {
        onClose();
      } else {
        navigate('/dashboard');
      }
    } else {
      toast.error('Failed to save profile data');
    }
  };
  
  return (
    <div className="relative w-full max-w-4xl mx-auto h-[calc(100vh-120px)]">
      {showCloseButton && onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      
      {currentStep === 'chat' && (
        <OnboardingChat
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          onFinishChat={handleFinishChat}
        />
      )}
      
      {currentStep === 'review' && extractedProfileData && (
        <ProfileReview
          profileData={extractedProfileData}
          onApprove={handleSaveProfile}
          onContinueChat={handleContinueChat}
        />
      )}
    </div>
  );
};

export default OnboardingAssistant;
