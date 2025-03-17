
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { ContentIdea } from '@/types';

interface IdeaDraftsProps {
  idea: ContentIdea;
  onGenerateDraft: (contentType: string) => Promise<void>;
}

const IdeaDrafts: React.FC<IdeaDraftsProps> = ({ idea, onGenerateDraft }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Drafts</CardTitle>
          <Button 
            className="gap-1" 
            disabled={idea.status !== 'approved'}
            onClick={() => onGenerateDraft(idea.contentType)}
          >
            <Plus className="h-4 w-4" />
            Generate Draft
          </Button>
        </div>
        <CardDescription>
          Drafts generated from this content idea
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-8 text-center border rounded-lg bg-muted/10">
          <p className="text-sm text-muted-foreground">
            No drafts have been generated for this idea yet
          </p>
          <Button 
            className="mt-4 gap-1" 
            disabled={idea.status !== 'approved'}
            onClick={() => onGenerateDraft(idea.contentType)}
          >
            <Plus className="h-4 w-4" />
            Generate Draft
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeaDrafts;
