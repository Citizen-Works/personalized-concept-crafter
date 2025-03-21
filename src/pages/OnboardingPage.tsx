
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import OnboardingAssistant from '@/components/onboarding/OnboardingAssistant';
import OnboardingWelcome from '@/components/onboarding/OnboardingWelcome';
import { useIsMobile } from '@/hooks/use-mobile';

// Different onboarding paths with their estimated times
export type OnboardingPath = 'express' | 'guided' | 'discovery';

const OnboardingPage = () => {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedPath, setSelectedPath] = useState<OnboardingPath>('guided');
  
  // If authentication is loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="animate-pulse text-center">
          <div className="h-8 w-48 bg-primary/30 rounded mx-auto"></div>
          <div className="h-4 w-64 bg-primary/20 rounded mx-auto mt-4"></div>
        </div>
      </div>
    );
  }
  
  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Show welcome screen first, then the onboarding assistant
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 bg-background">
      <div className="w-full max-w-4xl mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">Welcome to Content Engine</h1>
        <p className="text-center text-muted-foreground mt-2 px-2">
          Let's set up your profile to help generate better content for your business.
        </p>
      </div>
      
      {showWelcome ? (
        <OnboardingWelcome 
          onStart={(path) => {
            setSelectedPath(path);
            setShowWelcome(false);
          }} 
        />
      ) : (
        <OnboardingAssistant 
          showCloseButton={false} 
          onboardingPath={selectedPath}
        />
      )}
    </div>
  );
};

export default OnboardingPage;
