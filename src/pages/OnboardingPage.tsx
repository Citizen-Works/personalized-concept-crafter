
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import OnboardingAssistant from '@/components/onboarding/OnboardingAssistant';

const OnboardingPage = () => {
  const { user, loading } = useAuth();
  
  // If authentication is loading, show nothing yet
  if (loading) {
    return null;
  }
  
  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-4xl mb-8">
        <h1 className="text-3xl font-bold text-center">Welcome to Content Engine</h1>
        <p className="text-center text-muted-foreground mt-2">
          Let's set up your profile to help generate better content for your business.
        </p>
      </div>
      
      <OnboardingAssistant showCloseButton={false} />
    </div>
  );
};

export default OnboardingPage;
