
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface GeneralStyleCardProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const GeneralStyleCard: React.FC<GeneralStyleCardProps> = ({ value, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Style Guide</CardTitle>
        <CardDescription>
          Define overall writing preferences and guidelines
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          name="generalStyleGuide"
          value={value}
          onChange={onChange}
          placeholder="General writing preferences (e.g., sentence length, paragraph structure, use of jargon)"
          className="min-h-32"
        />
      </CardContent>
    </Card>
  );
};
