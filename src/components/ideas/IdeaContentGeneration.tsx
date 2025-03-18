
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Bug } from 'lucide-react';
import { ContentIdea, ContentType } from '@/types';
import { useClaudeAI } from '@/hooks/useClaudeAI';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface IdeaContentGenerationProps {
  idea: ContentIdea;
  onGenerateDraft: (contentType: string, content: string) => Promise<void>;
}

const IdeaContentGeneration: React.FC<IdeaContentGenerationProps> = ({ 
  idea, 
  onGenerateDraft 
}) => {
  const [generatingType, setGeneratingType] = useState<ContentType | null>(null);
  const [showDebugDialog, setShowDebugDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<ContentType>('linkedin');
  const { generateContent, isGenerating, debugPrompt } = useClaudeAI();

  const handleGenerateDraft = async (contentType: ContentType) => {
    setGeneratingType(contentType);
    
    try {
      console.log("Generating content of type:", contentType, "for idea:", idea.id);
      const generatedContent = await generateContent(idea, contentType);
      
      if (generatedContent) {
        await onGenerateDraft(contentType, generatedContent);
      }
    } catch (error) {
      console.error('Error in handleGenerateDraft:', error);
      toast.error(`Failed to generate ${contentType} content`);
    } finally {
      setGeneratingType(null);
    }
  };

  const handleDebugPrompt = async (contentType: ContentType) => {
    setSelectedType(contentType);
    try {
      await generateContent(idea, contentType, true);
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
          <CardTitle>Generate Content</CardTitle>
          <CardDescription>
            Create content based on this idea
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {['linkedin', 'newsletter', 'marketing'].map((type) => (
            <div key={type} className="flex gap-2">
              <Button 
                className="w-full gap-1" 
                disabled={isGenerating || generatingType !== null}
                onClick={() => handleGenerateDraft(type as ContentType)}
              >
                {generatingType === type ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Generate {type.charAt(0).toUpperCase() + type.slice(1)}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDebugPrompt(type as ContentType)}
                title={`Debug ${type} prompt`}
              >
                <Bug className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={showDebugDialog} onOpenChange={setShowDebugDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Debug Prompt for {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}</DialogTitle>
            <DialogDescription>
              This is the exact prompt that will be sent to Claude AI
            </DialogDescription>
          </DialogHeader>
          <div className="bg-slate-50 p-4 rounded border whitespace-pre-wrap font-mono text-sm">
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

export default IdeaContentGeneration;
