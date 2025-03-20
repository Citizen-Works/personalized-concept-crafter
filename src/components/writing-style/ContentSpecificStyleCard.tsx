
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ContentSpecificStyleCardProps {
  linkedinValue: string;
  newsletterValue: string;
  marketingValue: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const ContentSpecificStyleCard: React.FC<ContentSpecificStyleCardProps> = ({
  linkedinValue,
  newsletterValue,
  marketingValue,
  onChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform-Specific Writing Styles</CardTitle>
        <CardDescription>
          Define how your voice adapts across different platforms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">LinkedIn Style</label>
          <Textarea
            name="linkedinStyleGuide"
            value={linkedinValue}
            onChange={onChange}
            placeholder="How you write specifically for LinkedIn"
            className="min-h-24"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Newsletter Style</label>
          <Textarea
            name="newsletterStyleGuide"
            value={newsletterValue}
            onChange={onChange}
            placeholder="How you write for email newsletters"
            className="min-h-24"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Marketing Style</label>
          <Textarea
            name="marketingStyleGuide"
            value={marketingValue}
            onChange={onChange}
            placeholder="How you write for marketing materials"
            className="min-h-24"
          />
        </div>
      </CardContent>
    </Card>
  );
};
