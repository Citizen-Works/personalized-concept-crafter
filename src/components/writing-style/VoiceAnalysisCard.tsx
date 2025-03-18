
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface VoiceAnalysisCardProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const VoiceAnalysisCard: React.FC<VoiceAnalysisCardProps> = ({ value, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice Analysis</CardTitle>
        <CardDescription>
          Describe your unique writing voice and tone
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          name="voice_analysis"
          value={value}
          onChange={onChange}
          placeholder="Describe your writing voice (e.g., professional but approachable, conversational with technical expertise)"
          className="min-h-32"
        />
      </CardContent>
    </Card>
  );
};
