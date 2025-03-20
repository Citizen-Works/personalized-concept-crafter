
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentSpecificStyleCard } from './ContentSpecificStyleCard';

interface PlatformStyleTabProps {
  linkedinStyleGuide: string;
  newsletterStyleGuide: string;
  marketingStyleGuide: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const PlatformStyleTab: React.FC<PlatformStyleTabProps> = ({
  linkedinStyleGuide,
  newsletterStyleGuide,
  marketingStyleGuide,
  handleInputChange,
}) => {
  return (
    <div className="space-y-8">
      <ContentSpecificStyleCard 
        linkedinValue={linkedinStyleGuide} 
        newsletterValue={newsletterStyleGuide} 
        marketingValue={marketingStyleGuide} 
        onChange={handleInputChange} 
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Style Tips</CardTitle>
          <CardDescription>
            Tips for platform-specific writing styles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">LinkedIn</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                <li>Keep paragraphs short and skimmable</li>
                <li>Start with a compelling hook</li>
                <li>Use line breaks to create visual rhythm</li>
                <li>End with a clear call to action or question</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium">Newsletter</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                <li>Personal and conversational tone works best</li>
                <li>Create consistent sections readers can expect</li>
                <li>Use subheadings and bullet points for scanability</li>
                <li>Include a mix of content types: insights, tips, news, etc.</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium">Marketing</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                <li>Focus on benefits rather than features</li>
                <li>Use active voice and present tense</li>
                <li>Address objections proactively</li>
                <li>Create a sense of urgency when appropriate</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
