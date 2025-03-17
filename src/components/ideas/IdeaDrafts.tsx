
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from 'lucide-react';
import { ContentIdea } from '@/types';
import { useClaudeAI } from '@/hooks/useClaudeAI';

interface IdeaDraftsProps {
  idea: ContentIdea;
  onGenerateDraft: (contentType: string) => Promise<void>;
}

const IdeaDrafts: React.FC<IdeaDraftsProps> = ({ idea, onGenerateDraft }) => {
  const { isGenerating } = useClaudeAI();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Drafts</CardTitle>
          <Button 
            className="gap-1" 
            disabled={idea.status !== 'approved' || isGenerating}
            onClick={() => onGenerateDraft(idea.contentType)}
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
            <Button 
              className="mt-4 gap-1" 
              disabled={idea.status !== 'approved' || isGenerating}
              onClick={() => onGenerateDraft(idea.contentType)}
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IdeaDrafts;
