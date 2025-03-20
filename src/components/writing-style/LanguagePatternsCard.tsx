
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface LanguagePatternsCardProps {
  vocabularyValue: string;
  avoidValue: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const LanguagePatternsCard: React.FC<LanguagePatternsCardProps> = ({ 
  vocabularyValue, 
  avoidValue, 
  onChange 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Language Patterns</CardTitle>
        <CardDescription>
          Define specific vocabulary and patterns to use or avoid
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Vocabulary & Phrases to Use</label>
          <Textarea
            name="vocabularyPatterns"
            value={vocabularyValue}
            onChange={onChange}
            placeholder="Words, phrases or expressions you frequently use"
            className="min-h-24"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Patterns to Avoid</label>
          <Textarea
            name="avoidPatterns"
            value={avoidValue}
            onChange={onChange}
            placeholder="Words, phrases or structures you never use"
            className="min-h-24"
          />
        </div>
      </CardContent>
    </Card>
  );
};
