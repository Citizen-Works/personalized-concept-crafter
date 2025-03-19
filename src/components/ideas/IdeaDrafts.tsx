import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Bug } from 'lucide-react';
import { ContentIdea, ContentType } from '@/types';
import { useClaudeAI } from '@/hooks/useClaudeAI';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface IdeaDraftsProps {
  idea: ContentIdea;
  onGenerateDraft: (contentType: string, content: string) => Promise<void>;
}

const IdeaDrafts: React.FC<IdeaDraftsProps> = ({ idea, onGenerateDraft }) => {
  const { generateContent, isGenerating, debugPrompt } = useClaudeAI();
  const [showDebugDialog, setShowDebugDialog] = useState(false);
  
  const handleGenerateDraft = async () => {
    try {
      console.log("Generating draft for idea:", idea.id);
      const generatedContent = await generateContent(idea, idea.contentType as ContentType);
      
      if (generatedContent) {
        await onGenerateDraft(idea.contentType, generatedContent);
        toast.success(`Draft generated successfully`);
      } else {
        toast.error('No content was generated');
      }
    } catch (error) {
      console.error('Error generating draft:', error);
      toast.error('Failed to generate draft');
    }
  };
  
  const handleDebugPrompt = async () => {
    try {
      await generateContent(idea, idea.contentType as ContentType, true);
      setShowDebugDialog(true);
    } catch (error) {
      console.error('Error debugging prompt:', error);
      toast.error('Failed to generate debug prompt');
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Drafts</CardTitle>
            <div className="flex gap-2">
              <Button 
                className="gap-1" 
                disabled={isGenerating}
                onClick={handleGenerateDraft}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Generate Draft
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleDebugPrompt}
                title="Debug prompt"
              >
                <Bug className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            Drafts generated from this content idea
          </CardDescription>
        </CardHeader>
        <CardContent>
          {idea.status === 'drafted' ? (
            <div className="p-8 text-center border rounded-lg bg-blue-50">
              <p className="text-sm">
                Drafts have been generated for this idea
              </p>
              <Button 
                variant="outline"
                className="mt-4 gap-1"
                onClick={() => window.location.href = '/drafts'}
              >
                View All Drafts
              </Button>
            </div>
          ) : (
            <div className="p-8 text-center border rounded-lg bg-muted/10">
              <p className="text-sm text-muted-foreground">
                No drafts have been generated for this idea yet
              </p>
              <div className="flex justify-center gap-2 mt-4">
                <Button 
                  className="gap-1" 
                  disabled={isGenerating}
                  onClick={handleGenerateDraft}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Generate Draft
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDebugPrompt}
                  title="Debug prompt"
                >
                  <Bug className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDebugDialog} onOpenChange={setShowDebugDialog}>
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
            <Button variant="outline" onClick={() => setShowDebugDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IdeaDrafts;
