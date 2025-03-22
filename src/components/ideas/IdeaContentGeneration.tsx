
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';
import { ContentIdea, ContentType } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useClaudeAI } from '@/hooks/useClaudeAI';
import { useIdeas } from '@/hooks/ideas';
import { toast } from 'sonner';
import { Progress } from "@/components/ui/progress";

interface IdeaContentGenerationProps {
  idea: ContentIdea;
  onGenerateDraft: (contentType: ContentType, content: string) => Promise<void>;
}

const IdeaContentGeneration: React.FC<IdeaContentGenerationProps> = ({
  idea,
  onGenerateDraft
}) => {
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('linkedin');
  const [generatedContent, setGeneratedContent] = useState('');
  const { generateContent, isGenerating, error } = useClaudeAI();
  const { updateIdea } = useIdeas();
  const [progress, setProgress] = useState(0);
  
  // Progress animation effect when generating content
  useEffect(() => {
    let progressInterval: ReturnType<typeof setInterval>;
    
    if (isGenerating) {
      // Reset progress when starting generation
      setProgress(0);
      
      // Create a realistic-looking progress animation
      progressInterval = setInterval(() => {
        setProgress(currentProgress => {
          // Move quickly to 70%, then slow down to simulate waiting for the API
          if (currentProgress < 70) {
            return currentProgress + 2;
          } else {
            // Slow down as we approach 90%
            return Math.min(currentProgress + 0.5, 90);
          }
        });
      }, 150);
    } else if (progress > 0) {
      // When generation completes, jump to 100%
      setProgress(100);
      
      // Reset progress after a delay
      const resetTimeout = setTimeout(() => {
        setProgress(0);
      }, 1000);
      
      return () => clearTimeout(resetTimeout);
    }
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isGenerating, progress]);
  
  // Extract call to action from the idea notes
  const extractCallToAction = () => {
    if (!idea.notes) return null;
    
    const ctaMatch = idea.notes.match(/Call to Action: (.*?)(?:\n|$)/);
    if (ctaMatch && ctaMatch[1]) {
      return ctaMatch[1].trim();
    }
    return null;
  };
  
  const callToAction = extractCallToAction();
  
  const handleGenerateContent = async () => {
    try {
      // Create temporary object with contentType for generation
      const ideaWithType = {
        ...idea,
        contentType: selectedContentType // Temporary for generation only
      };
      
      const content = await generateContent(ideaWithType, selectedContentType);
      if (content) {
        setGeneratedContent(content);
      }
    } catch (error) {
      console.error('Error generating content:', error);
    }
  };
  
  const handleSaveAsDraft = async () => {
    try {
      await onGenerateDraft(selectedContentType, generatedContent);
      
      // Mark the idea as used if not already
      if (!idea.hasBeenUsed) {
        await updateIdea({
          id: idea.id,
          hasBeenUsed: true
        });
      }
      
      // Optionally clear the content after saving
      setGeneratedContent('');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Generate Content</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {callToAction && (
          <div className="mb-4">
            <Badge variant="outline" className="bg-secondary/10 text-secondary hover:bg-secondary/20">
              CTA: {callToAction}
            </Badge>
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
            <span>{error.message || "An unknown error occurred"}</span>
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
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <span className="text-muted-foreground font-medium">Generating content...</span>
                </div>
                
                {progress > 0 && (
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      {progress < 100 ? 'Thinking and crafting content...' : 'Complete!'}
                    </p>
                  </div>
                )}
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
