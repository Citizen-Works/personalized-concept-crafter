
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Edit, RefreshCcw, Loader2, FileText, Lightbulb, Trash2, Save } from 'lucide-react';
import { ContentIdea } from '@/types';

interface DraftPreviewCardProps {
  selectedIdea: ContentIdea | null;
  isGenerating: boolean;
  generatedContent: string;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  setGeneratedContent: (content: string) => void;
  handleGenerate: () => void;
  handleSaveDraft: () => void;
  progress: number;
}

const DraftPreviewCard: React.FC<DraftPreviewCardProps> = ({
  selectedIdea,
  isGenerating,
  generatedContent,
  isEditing,
  setIsEditing,
  setGeneratedContent,
  handleGenerate,
  handleSaveDraft,
  progress
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Draft Preview</span>
          {generatedContent && !isGenerating && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4 mr-1" />
                {isEditing ? "View" : "Edit"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGenerate}
              >
                <RefreshCcw className="h-4 w-4 mr-1" />
                Regenerate
              </Button>
            </div>
          )}
        </CardTitle>
        <CardDescription>
          {selectedIdea ? 
            `Preview for: ${selectedIdea.title}` : 
            "Select an idea to generate content"}
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[500px] flex flex-col">
        {isGenerating ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="text-center space-y-2">
              <p>Generating draft content...</p>
              <p className="text-sm text-muted-foreground">This may take a moment</p>
              {progress > 0 && (
                <div className="w-full max-w-xs mx-auto">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    {progress < 100 ? 'Thinking and crafting content...' : 'Complete!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : !selectedIdea ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
            <FileText className="h-12 w-12 mb-4 opacity-20" />
            <h3 className="text-lg font-medium">No idea selected</h3>
            <p className="max-w-sm">
              Select a content idea from the left panel to generate a draft
            </p>
          </div>
        ) : generatedContent ? (
          isEditing ? (
            <Textarea 
              value={generatedContent} 
              onChange={(e) => setGeneratedContent(e.target.value)}
              className="flex-1 min-h-[450px] resize-none"
            />
          ) : (
            <div className="flex-1 whitespace-pre-wrap bg-card rounded-md p-4 overflow-y-auto">
              {generatedContent}
            </div>
          )
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
            <Lightbulb className="h-12 w-12 mb-4 opacity-20" />
            <h3 className="text-lg font-medium">Ready to generate</h3>
            <p className="max-w-sm">
              Click the "Generate Draft" button to create content based on your selected idea
            </p>
          </div>
        )}
        
        {generatedContent && !isGenerating && (
          <div className="mt-6 flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setGeneratedContent("")}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Discard
            </Button>
            <Button onClick={handleSaveDraft}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DraftPreviewCard;
