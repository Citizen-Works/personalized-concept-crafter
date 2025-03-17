
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { ContentIdea } from '@/types';

interface IdeaContentGenerationProps {
  idea: ContentIdea;
  onGenerateDraft: (contentType: string) => Promise<void>;
}

const IdeaContentGeneration: React.FC<IdeaContentGenerationProps> = ({ idea, onGenerateDraft }) => {
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
          disabled={idea.status !== 'approved'} 
          onClick={() => onGenerateDraft('linkedin')}
        >
          <Plus className="h-4 w-4" />
          Generate LinkedIn Post
        </Button>
        <Button 
          className="w-full gap-1" 
          disabled={idea.status !== 'approved'}
          onClick={() => onGenerateDraft('newsletter')}
        >
          <Plus className="h-4 w-4" />
          Generate Newsletter
        </Button>
        <Button 
          className="w-full gap-1" 
          disabled={idea.status !== 'approved'}
          onClick={() => onGenerateDraft('marketing')}
        >
          <Plus className="h-4 w-4" />
          Generate Marketing Copy
        </Button>
      </CardContent>
    </Card>
  );
};

export default IdeaContentGeneration;
