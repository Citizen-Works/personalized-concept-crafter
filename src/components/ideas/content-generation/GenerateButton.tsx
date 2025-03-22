
import React from 'react';
import { Button } from "@/components/ui/button";
import { Lightbulb } from 'lucide-react';
import { ContentType } from '@/types';

interface GenerateButtonProps {
  contentType: ContentType;
  onClick: () => void;
  disabled: boolean;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ contentType, onClick, disabled }) => {
  const contentTypeLabel = contentType.charAt(0).toUpperCase() + contentType.slice(1);
  
  return (
    <Button 
      onClick={onClick} 
      className="w-full"
      disabled={disabled}
    >
      <Lightbulb className="mr-2 h-4 w-4" />
      Generate {contentTypeLabel} Content
    </Button>
  );
};

export default GenerateButton;
