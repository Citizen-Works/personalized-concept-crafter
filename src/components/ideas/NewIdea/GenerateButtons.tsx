
import React from 'react';
import { Button } from "@/components/ui/button";
import { Lightbulb, Loader2 } from 'lucide-react';
import { ContentType } from '@/types';

type GenerateButtonsProps = {
  isSubmitting: boolean;
  generatingType: ContentType | null;
  onSaveAndGenerate: (contentType: ContentType) => Promise<void>;
};

const GenerateButtons: React.FC<GenerateButtonsProps> = ({ 
  isSubmitting, 
  generatingType, 
  onSaveAndGenerate 
}) => {
  return (
    <div className="w-full border-t pt-4">
      <h3 className="text-sm font-medium mb-2">Save & Generate Content</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Button 
          type="button"
          variant="secondary"
          onClick={() => onSaveAndGenerate('linkedin')}
          disabled={isSubmitting || !!generatingType}
          className="w-full"
        >
          {generatingType === 'linkedin' ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating LinkedIn...
            </>
          ) : (
            <>
              <Lightbulb className="h-4 w-4 mr-2" />
              LinkedIn
            </>
          )}
        </Button>
        <Button 
          type="button"
          variant="secondary"
          onClick={() => onSaveAndGenerate('newsletter')}
          disabled={isSubmitting || !!generatingType}
          className="w-full"
        >
          {generatingType === 'newsletter' ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Newsletter...
            </>
          ) : (
            <>
              <Lightbulb className="h-4 w-4 mr-2" />
              Newsletter
            </>
          )}
        </Button>
        <Button 
          type="button"
          variant="secondary"
          onClick={() => onSaveAndGenerate('marketing')}
          disabled={isSubmitting || !!generatingType}
          className="w-full"
        >
          {generatingType === 'marketing' ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Marketing...
            </>
          ) : (
            <>
              <Lightbulb className="h-4 w-4 mr-2" />
              Marketing
            </>
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Save your idea and immediately generate a draft for the selected content type
      </p>
    </div>
  );
};

export default GenerateButtons;
