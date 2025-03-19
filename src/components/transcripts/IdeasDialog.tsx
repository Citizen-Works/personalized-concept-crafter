
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
import { Copy, CheckCircle2 } from "lucide-react";
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Generated Content Ideas</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Content ideas extracted from your transcript
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4 p-4 bg-muted/50 rounded-md border border-border whitespace-pre-wrap text-sm">
          {ideas ? (
            ideas
          ) : (
            <div className="text-muted-foreground italic">No ideas were generated</div>
          )}
        </div>
        
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
