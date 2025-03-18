
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from 'lucide-react';

type RegenerateDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onRegenerate: (instructions: string) => Promise<void>;
  isLoading: boolean;
  contentType: string;
};

export const RegenerateDialog: React.FC<RegenerateDialogProps> = ({
  isOpen,
  onClose,
  onRegenerate,
  isLoading,
  contentType
}) => {
  const [instructions, setInstructions] = useState('');

  const handleSubmit = async () => {
    await onRegenerate(instructions);
    setInstructions('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Regenerate {contentType.charAt(0).toUpperCase() + contentType.slice(1)} Content</DialogTitle>
          <DialogDescription>
            Provide additional instructions on how to improve this draft
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g., Make it more conversational, include more specific examples, use fewer technical terms..."
            className="min-h-[150px]"
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              'Regenerate Content'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
