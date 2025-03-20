import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WritingStyleProfile } from '@/types/writingStyle';

export interface WritingStylePreviewProps {
  writingStyle: WritingStyleProfile;
}

export const WritingStylePreview: React.FC<WritingStylePreviewProps> = ({ writingStyle }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Writing Style Preview</CardTitle>
        <CardDescription>
          See a preview of your writing style in action
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          <strong>Voice Analysis:</strong> {writingStyle.voiceAnalysis}
        </p>
        <p>
          <strong>General Style Guide:</strong> {writingStyle.generalStyleGuide}
        </p>
        <p>
          <strong>Vocabulary Patterns:</strong> {writingStyle.vocabularyPatterns}
        </p>
        <p>
          <strong>Avoid Patterns:</strong> {writingStyle.avoidPatterns}
        </p>
        <p>
          <strong>LinkedIn Style Guide:</strong> {writingStyle.linkedinStyleGuide}
        </p>
        <p>
          <strong>Newsletter Style Guide:</strong> {writingStyle.newsletterStyleGuide}
        </p>
        <p>
          <strong>Marketing Style Guide:</strong> {writingStyle.marketingStyleGuide}
        </p>
      </CardContent>
    </Card>
  );
};
