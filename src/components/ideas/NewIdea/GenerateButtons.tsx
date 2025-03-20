
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Lightbulb, Loader2 } from 'lucide-react';
import { ContentType } from '@/types';
import { Progress } from "@/components/ui/progress";

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
  const [progress, setProgress] = useState(0);
  
  // Progress animation effect when generating content
  useEffect(() => {
    let progressInterval: ReturnType<typeof setInterval>;
    
    if (generatingType) {
      // Reset progress when starting generation
      setProgress(0);
      
      // Create a realistic-looking progress animation
      progressInterval = setInterval(() => {
        setProgress(currentProgress => {
          // Move quickly to 70%, then slow down to simulate waiting for the API
          if (currentProgress < 70) {
            return currentProgress + 2;
          } else {
            // Slow down as we approach 90%
            return Math.min(currentProgress + 0.5, 90);
          }
        });
      }, 150);
    } else if (progress > 0) {
      // When generation completes, jump to 100%
      setProgress(100);
      
      // Reset progress after a delay
      const resetTimeout = setTimeout(() => {
        setProgress(0);
      }, 1000);
      
      return () => clearTimeout(resetTimeout);
    }
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [generatingType, progress]);
  
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
      
      {generatingType && (
        <div className="mt-4 space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            {progress < 100 ? 'Creating and saving your content...' : 'Complete!'}
          </p>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground mt-2">
        Save your idea and immediately generate a draft for the selected content type
      </p>
    </div>
  );
};

export default GenerateButtons;
