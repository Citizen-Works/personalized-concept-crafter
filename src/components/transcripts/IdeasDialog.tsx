
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

// Define the structure of an idea item
interface IdeaItem {
  id: string;
  title: string;
  description: string;
}

// Updated props to handle structured idea data
interface IdeasDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ideas: {
    message: string;
    ideas: IdeaItem[];
  } | string | null;
}

const IdeasDialog: React.FC<IdeasDialogProps> = ({
  isOpen,
  onOpenChange,
  ideas,
}) => {
  const [isCopied, setIsCopied] = React.useState(false);
  
  // Check if ideas is a string (old format) or an object (new format)
  const isLegacyFormat = typeof ideas === 'string';
  const ideasObj = isLegacyFormat ? { message: ideas || '', ideas: [] } : ideas || { message: '', ideas: [] };
  
  const hasIdeas = !isLegacyFormat && ideasObj.ideas && ideasObj.ideas.length > 0;
  const noIdeasFound = ideasObj.message?.includes("No valuable content ideas") || ideasObj.message?.includes("No content ideas were identified");

  const handleCopy = async () => {
    if (!ideasObj.message) return;
    
    try {
      await navigator.clipboard.writeText(ideasObj.message);
      setIsCopied(true);
      toast.success("Ideas copied to clipboard");
      
      // Reset copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy ideas:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {noIdeasFound ? "No Content Ideas Found" : "Generated Content Ideas"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {noIdeasFound 
              ? "AI analysis didn't find valuable content ideas in this transcript" 
              : "Content ideas extracted from your transcript"
            }
          </DialogDescription>
        </DialogHeader>
        
        {noIdeasFound ? (
          <div className="my-4 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-md border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="whitespace-pre-wrap text-sm">{ideasObj.message}</p>
              <p className="mt-2 text-sm">Try a different transcript or edit this one to include more detailed discussions.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="my-4 p-4 bg-muted/50 rounded-md border border-border">
              <p className="text-sm mb-4">{ideasObj.message}</p>
              
              {hasIdeas && (
                <div className="space-y-3 mt-4">
                  <h3 className="text-sm font-semibold">Created Ideas:</h3>
                  {ideasObj.ideas.map((idea) => (
                    <div key={idea.id} className="p-3 bg-background rounded-md border border-input">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-sm">{idea.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{idea.description}</p>
                        </div>
                        <Link 
                          to={`/ideas/${idea.id}`} 
                          className="ml-2 p-1 hover:bg-muted rounded-md"
                          title="View idea details"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        
        <DialogFooter className="flex items-center justify-between flex-row">
          <div>
            {hasIdeas && (
              <Button asChild variant="default" size="sm" className="gap-1">
                <Link to="/ideas">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View All Ideas
                </Link>
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!ideasObj.message || isCopied}
            className="gap-2"
          >
            {isCopied ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IdeasDialog;
