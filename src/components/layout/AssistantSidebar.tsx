
import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot } from 'lucide-react';
import OnboardingAssistant from '@/components/onboarding/OnboardingAssistant';

const AssistantSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        variant="ghost" 
        className="flex w-full justify-start items-center gap-2 px-3"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="h-4 w-4" />
        <span>Content Assistant</span>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <OnboardingAssistant onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssistantSidebar;
