
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
  onChange 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content-Specific Style Guides</CardTitle>
        <CardDescription>
          Customize your style for different content types
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">LinkedIn Style</label>
          <Textarea
            name="linkedin_style_guide"
            value={linkedinValue}
            onChange={onChange}
            placeholder="How you write LinkedIn posts (e.g., storytelling approach, use of emojis, post structure)"
            className="min-h-24"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Newsletter Style</label>
          <Textarea
            name="newsletter_style_guide"
            value={newsletterValue}
            onChange={onChange}
            placeholder="How you write newsletters (e.g., section structure, introduction style, sign-off)"
            className="min-h-24"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Marketing Style</label>
          <Textarea
            name="marketing_style_guide"
            value={marketingValue}
            onChange={onChange}
            placeholder="How you write marketing content (e.g., call-to-actions, value proposition style)"
            className="min-h-24"
          />
        </div>
      </CardContent>
    </Card>
  );
};
