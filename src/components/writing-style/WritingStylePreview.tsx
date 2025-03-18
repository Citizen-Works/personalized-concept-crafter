
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { WritingStyleProfile } from '@/types/writingStyle';
import { generatePreviewWithClaude } from '@/services/claudeAIService';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ContentType } from '@/types';

interface WritingStylePreviewProps {
  styleProfile: WritingStyleProfile;
}

export const WritingStylePreview: React.FC<WritingStylePreviewProps> = ({ styleProfile }) => {
  const [previewText, setPreviewText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [contentType, setContentType] = useState<ContentType>('linkedin');

  const generatePreview = async () => {
    if (!styleProfile.user_id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const preview = await generatePreviewWithClaude(styleProfile, contentType);
      setPreviewText(preview);
    } catch (err) {
      console.error('Failed to generate preview:', err);
      setError('Failed to generate preview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate preview when component mounts or profile changes significantly
  useEffect(() => {
    // Only generate if we have enough style data to work with
    const hasStyleData = styleProfile.general_style_guide || 
                          styleProfile.voice_analysis || 
                          styleProfile.vocabulary_patterns;
    
    if (hasStyleData && styleProfile.user_id) {
      generatePreview();
    }
  }, [
    styleProfile.user_id,
    styleProfile.general_style_guide,
    styleProfile.voice_analysis,
    styleProfile.vocabulary_patterns,
    contentType // Regenerate when content type changes
  ]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            See how your content would look with your writing style
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={generatePreview}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <ToggleGroup 
          type="single" 
          value={contentType}
          onValueChange={(value) => value && setContentType(value as ContentType)}
          className="justify-start"
        >
          <ToggleGroupItem value="linkedin">LinkedIn</ToggleGroupItem>
          <ToggleGroupItem value="newsletter">Newsletter</ToggleGroupItem>
          <ToggleGroupItem value="marketing">Marketing</ToggleGroupItem>
        </ToggleGroup>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : error ? (
          <div className="text-destructive py-2">{error}</div>
        ) : !previewText ? (
          <div className="text-muted-foreground py-2">
            Add some writing style details to generate a preview
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            {previewText.split('\n').map((paragraph, i) => (
              paragraph ? <p key={i}>{paragraph}</p> : <br key={i} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
