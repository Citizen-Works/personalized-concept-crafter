import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { IdeaItem } from '@/hooks/transcripts/useTranscriptProcessing';

interface ProcessingProgressDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isProcessing: boolean;
  ideas: IdeaItem[];
  error?: string;
  onViewIdeas?: () => void;
}

export const ProcessingProgressDialog: React.FC<ProcessingProgressDialogProps> = ({
  isOpen,
  onOpenChange,
  isProcessing,
  ideas,
  error,
  onViewIdeas
}) => {
  // Add effect to log state changes
  React.useEffect(() => {
    console.log('ProcessingProgressDialog: State changed:', {
      isOpen,
      isProcessing,
      hasIdeas: ideas?.length > 0,
      error
    });
  }, [isOpen, isProcessing, ideas, error]);

  // Prevent closing during processing
  const handleOpenChange = React.useCallback((open: boolean) => {
    console.log('ProcessingProgressDialog: Open change requested:', { open, isProcessing });
    if (!open && isProcessing) {
      console.log('ProcessingProgressDialog: Preventing close during processing');
      return;
    }
    onOpenChange(open);
  }, [isProcessing, onOpenChange]);

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="sm:max-w-lg z-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing Document
              </>
            ) : error ? (
              <>
                <XCircle className="h-5 w-5 text-destructive" />
                Processing Failed
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Processing Complete
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isProcessing && (
            <>
              <Progress value={undefined} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                Analyzing document content and generating ideas...
              </p>
            </>
          )}

          {error && (
            <div className="text-sm text-destructive text-center">
              {error}
            </div>
          )}

          {!isProcessing && !error && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm">
                <Lightbulb className="h-4 w-4" />
                {ideas.length > 0 ? (
                  <span>Found {ideas.length} content ideas</span>
                ) : (
                  <span>No content ideas found</span>
                )}
              </div>

              {ideas.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Generated Ideas:</h4>
                  <ul className="space-y-2 text-sm">
                    {ideas.map((idea, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-muted-foreground">{index + 1}.</span>
                        <span>{idea.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 justify-end mt-4">
                {onViewIdeas && ideas.length > 0 && (
                  <Button 
                    onClick={onViewIdeas}
                    className="flex-1"
                  >
                    View All Ideas
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 