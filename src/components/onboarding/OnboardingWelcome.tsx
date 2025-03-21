
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Lightbulb, Rocket, CompassIcon } from 'lucide-react';
import { OnboardingPath } from '@/pages/OnboardingPage';

interface OnboardingPathOption {
  id: OnboardingPath;
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  forWho: string;
}

interface OnboardingWelcomeProps {
  onStart: (path: OnboardingPath) => void;
}

const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({ onStart }) => {
  const pathOptions: OnboardingPathOption[] = [
    {
      id: 'express',
      title: 'Express Setup',
      description: 'Quick setup for those who already know their content strategy',
      duration: '15 minutes',
      icon: <Rocket className="h-8 w-8 text-blue-500" />,
      forWho: 'For users who have strategy elements ready'
    },
    {
      id: 'guided',
      title: 'Guided Setup',
      description: 'Structured guidance to help you develop your content strategy',
      duration: '30 minutes',
      icon: <CompassIcon className="h-8 w-8 text-green-500" />,
      forWho: 'For users with partial strategy elements'
    },
    {
      id: 'discovery',
      title: 'Discovery Process',
      description: 'In-depth consultative approach to build your content strategy from scratch',
      duration: '45+ minutes',
      icon: <Lightbulb className="h-8 w-8 text-amber-500" />,
      forWho: 'For users starting from scratch'
    }
  ];

  return (
    <div className="w-full max-w-4xl animate-in fade-in duration-700">
      <Card className="border-2">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">AI Onboarding Consultant</CardTitle>
          <CardDescription className="max-w-md mx-auto">
            Our AI consultant will guide you through setting up your content strategy with a personalized, conversational experience.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pathOptions.map((option) => (
              <Card 
                key={option.id} 
                className="border cursor-pointer hover:border-primary hover:shadow-md transition-all"
                onClick={() => onStart(option.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                    {option.icon}
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm mt-1">
                    <Clock className="h-3 w-3 mr-1" /> {option.duration}
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                  <p className="text-xs bg-muted inline-block px-2 py-1 rounded-sm">{option.forWho}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="bg-muted p-4 rounded-lg mt-6">
            <h3 className="font-medium mb-2">What you'll set up:</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                Business profile
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                Target audiences
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                Content pillars
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                Writing style
              </li>
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="flex-col space-y-2">
          <div className="text-center w-full">
            <Button 
              className="w-full sm:w-auto" 
              size="lg"
              onClick={() => onStart('guided')}
            >
              Start Guided Setup
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Your progress will be saved automatically. You can continue later if needed.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingWelcome;
