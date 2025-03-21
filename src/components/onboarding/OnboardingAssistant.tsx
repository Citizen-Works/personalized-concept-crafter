
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Save } from 'lucide-react';
import { useOnboardingAssistant } from '@/hooks/useOnboardingAssistant';
import OnboardingChat from './OnboardingChat';
import ProfileReview from './ProfileReview';
import { saveProfileData } from '@/services/profileDataService';
import { useAuth } from '@/context/auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { OnboardingPath } from '@/pages/OnboardingPage';
import { OnboardingModule, getModulesForPath } from '@/hooks/onboarding/useOnboardingModules';

interface OnboardingAssistantProps {
  onClose?: () => void;
  showCloseButton?: boolean;
  onboardingPath?: OnboardingPath;
}

const OnboardingAssistant: React.FC<OnboardingAssistantProps> = ({ 
  onClose,
  showCloseButton = true,
  onboardingPath = 'guided'
}) => {
  const {
    messages,
    isLoading,
    extractedProfileData,
    isExtractionComplete,
    sendMessage,
    extractProfile,
    clearChat,
    progress,
    currentModule,
    setCurrentModule,
  } = useOnboardingAssistant(onboardingPath);
  
  const [currentStep, setCurrentStep] = useState<'chat' | 'review'>('chat');
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const modules = getModulesForPath(onboardingPath);
  
  // Add progress percentage calculation
  const progressPercentage = progress || 0;
  
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

  const handleSaveAndContinueLater = () => {
    toast.success('Your progress has been saved. You can continue later.');
    if (onClose) {
      onClose();
    } else {
      navigate('/dashboard');
    }
  };
  
  return (
    <div className="relative w-full max-w-4xl mx-auto h-[calc(100vh-200px)] sm:h-[calc(100vh-160px)]">
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
      
      {/* Modules and Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium">
            {currentModule ? `Module: ${currentModule.title}` : 'Getting started...'}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 text-xs" 
            onClick={handleSaveAndContinueLater}
          >
            <Save className="h-3 w-3" />
            Save & Continue Later
          </Button>
        </div>
        
        <Progress value={progressPercentage} className="h-2" />
        
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>{progressPercentage}% Complete</span>
          <span>{currentModule?.estimatedTime || ''}</span>
        </div>
        
        {/* Module Pills */}
        <div className="flex flex-wrap gap-2 mt-3">
          {modules.map((module, index) => (
            <div 
              key={module.id}
              className={`text-xs px-2 py-1 rounded-full ${
                currentModule?.id === module.id
                  ? 'bg-primary text-primary-foreground'
                  : progressPercentage >= (((index) / modules.length) * 100)
                    ? 'bg-primary/20 text-primary-foreground/90'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {module.title}
            </div>
          ))}
        </div>
      </div>
      
      {currentStep === 'chat' && (
        <OnboardingChat
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          onFinishChat={handleFinishChat}
          currentModule={currentModule}
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
