
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
import { Copy, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from 'sonner';

interface IdeasDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ideas: string | null;
}

const IdeasDialog: React.FC<IdeasDialogProps> = ({
  isOpen,
  onOpenChange,
  ideas,
}) => {
  const [isCopied, setIsCopied] = React.useState(false);
  
  const handleCopy = async () => {
    if (!ideas) return;
    
    try {
      await navigator.clipboard.writeText(ideas);
      setIsCopied(true);
      toast.success("Ideas copied to clipboard");
      
      // Reset copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy ideas:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  const noIdeasFound = ideas?.includes("No valuable content ideas found");

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
              <p className="whitespace-pre-wrap text-sm">{ideas}</p>
              <p className="mt-2 text-sm">Try a different transcript or edit this one to include more detailed discussions.</p>
            </div>
          </div>
        ) : (
          <div className="my-4 p-4 bg-muted/50 rounded-md border border-border whitespace-pre-wrap text-sm">
            {ideas ? (
              ideas
            ) : (
              <div className="text-muted-foreground italic">No ideas were generated</div>
            )}
          </div>
        )}
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!ideas || isCopied}
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
