
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DebugPromptDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  debugPrompt: string | null;
}

const DebugPromptDialog: React.FC<DebugPromptDialogProps> = ({ 
  showDialog, 
  setShowDialog, 
  debugPrompt 
}) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Debug Prompt</DialogTitle>
          <DialogDescription>
            This is the exact prompt that will be sent to Claude AI
          </DialogDescription>
        </DialogHeader>
        <div className="bg-slate-800 p-4 rounded border border-slate-700 whitespace-pre-wrap font-mono text-sm text-slate-100">
          {debugPrompt}
        </div>
        <div className="flex justify-end gap-2">
          <Button 
            onClick={() => {
              if (debugPrompt) {
                navigator.clipboard.writeText(debugPrompt);
                toast.success('Prompt copied to clipboard');
              }
            }}
          >
            Copy to Clipboard
          </Button>
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DebugPromptDialog;
