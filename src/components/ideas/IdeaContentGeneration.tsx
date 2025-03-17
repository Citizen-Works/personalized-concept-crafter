
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from 'lucide-react';
import { ContentIdea, ContentType } from '@/types';
import { useClaudeAI } from '@/hooks/useClaudeAI';
import { toast } from 'sonner';

interface IdeaContentGenerationProps {
  idea: ContentIdea;
  onGenerateDraft: (contentType: string, content: string) => Promise<void>;
}

const IdeaContentGeneration: React.FC<IdeaContentGenerationProps> = ({ 
  idea, 
  onGenerateDraft 
}) => {
  const [generatingType, setGeneratingType] = useState<ContentType | null>(null);
  const { generateContent, isGenerating } = useClaudeAI();

  const handleGenerateDraft = async (contentType: ContentType) => {
    if (idea.status !== 'approved') {
      toast.error('Only approved ideas can be used to generate drafts');
      return;
    }

    setGeneratingType(contentType);
    
    try {
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Generate Content</CardTitle>
        <CardDescription>
          Create content based on this idea
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          className="w-full gap-1" 
          disabled={idea.status !== 'approved' || isGenerating || generatingType !== null}
          onClick={() => handleGenerateDraft('linkedin')}
        >
          {generatingType === 'linkedin' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Generate LinkedIn Post
            </>
          )}
        </Button>
        <Button 
          className="w-full gap-1" 
          disabled={idea.status !== 'approved' || isGenerating || generatingType !== null}
          onClick={() => handleGenerateDraft('newsletter')}
        >
          {generatingType === 'newsletter' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Generate Newsletter
            </>
          )}
        </Button>
        <Button 
          className="w-full gap-1" 
          disabled={idea.status !== 'approved' || isGenerating || generatingType !== null}
          onClick={() => handleGenerateDraft('marketing')}
        >
          {generatingType === 'marketing' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Generate Marketing Copy
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default IdeaContentGeneration;
