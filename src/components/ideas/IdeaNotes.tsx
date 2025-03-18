
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface IdeaNotesProps {
  id: string;
  notes: string;
}

const IdeaNotes: React.FC<IdeaNotesProps> = ({ id, notes }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Custom Instructions</CardTitle>
        <CardDescription>
          Specific instructions for content generation like "Keep it concise" or "Plug my Skool community"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{notes || '(No custom instructions provided)'}</p>
      </CardContent>
    </Card>
  );
};

export default IdeaNotes;
