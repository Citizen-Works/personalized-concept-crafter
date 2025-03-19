
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';
import { ContentIdea, ContentType } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useClaudeAI } from '@/hooks/useClaudeAI';

interface IdeaContentGenerationProps {
  idea: ContentIdea;
  onGenerateDraft: (contentType: string, content: string) => Promise<void>;
}

const IdeaContentGeneration: React.FC<IdeaContentGenerationProps> = ({
  idea,
  onGenerateDraft
}) => {
  const [selectedContentType, setSelectedContentType] = useState<ContentType>(idea.contentType || 'linkedin');
  const [generatedContent, setGeneratedContent] = useState('');
  const { generateContent, isGenerating, error } = useClaudeAI();
  
  // Extract content goal and call to action from the idea
  const extractContentGoal = () => {
    if (!idea.description) return null;
    
    const goalMatch = idea.description.match(/Content Goal: (.*?)(?:\n|$)/);
    if (goalMatch && goalMatch[1]) {
      return goalMatch[1].trim();
    }
    return null;
  };
  
  const extractCallToAction = () => {
    if (!idea.notes) return null;
    
    const ctaMatch = idea.notes.match(/Call to Action: (.*?)(?:\n|$)/);
    if (ctaMatch && ctaMatch[1]) {
      return ctaMatch[1].trim();
    }
    return null;
  };
  
  const contentGoal = extractContentGoal();
  const callToAction = extractCallToAction();
  
  const handleGenerateContent = async () => {
    try {
      const content = await generateContent(idea, selectedContentType);
      if (content) {
        setGeneratedContent(content);
      }
    } catch (error) {
      console.error('Error generating content:', error);
    }
  };
  
  const handleSaveAsDraft = async () => {
    await onGenerateDraft(selectedContentType, generatedContent);
    // Optionally clear the content after saving
    setGeneratedContent('');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Generate Content</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {contentGoal && (
          <div className="mb-4">
            <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
              Goal: {contentGoal}
            </Badge>
            {callToAction && (
              <div className="mt-2">
                <Badge variant="outline" className="bg-secondary/10 text-secondary hover:bg-secondary/20">
                  CTA: {callToAction}
                </Badge>
              </div>
            )}
          </div>
        )}
        
        <Tabs defaultValue={selectedContentType} onValueChange={(value) => setSelectedContentType(value as ContentType)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="linkedin" className="space-y-4">
            <p className="text-sm text-muted-foreground">Generate a professional LinkedIn post based on this idea.</p>
          </TabsContent>
          <TabsContent value="newsletter" className="space-y-4">
            <p className="text-sm text-muted-foreground">Generate an engaging newsletter article based on this idea.</p>
          </TabsContent>
          <TabsContent value="marketing" className="space-y-4">
            <p className="text-sm text-muted-foreground">Generate compelling marketing copy based on this idea.</p>
          </TabsContent>
        </Tabs>
        
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        {!isGenerating && !generatedContent ? (
          <Button 
            onClick={handleGenerateContent} 
            className="w-full"
            disabled={isGenerating}
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            Generate {selectedContentType.charAt(0).toUpperCase() + selectedContentType.slice(1)} Content
          </Button>
        ) : (
          <div className="space-y-4">
            {isGenerating ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Generating content...</span>
              </div>
            ) : (
              <>
                <Textarea 
                  value={generatedContent} 
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="min-h-[300px]"
                  placeholder="Generated content will appear here"
                />
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setGeneratedContent('')}
                    className="flex-1"
                  >
                    Clear
                  </Button>
                  <Button 
                    onClick={handleGenerateContent}
                    variant="outline"
                    className="flex-1"
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                  <Button 
                    onClick={handleSaveAsDraft}
                    className="flex-1"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Save as Draft
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IdeaContentGeneration;
