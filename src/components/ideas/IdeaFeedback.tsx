
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface IdeaFeedbackProps {
  feedback: string;
  defaultNotes: string;
  onFeedbackChange: (feedback: string) => void;
  onSaveFeedback: () => void;
}

const IdeaFeedback: React.FC<IdeaFeedbackProps> = ({ 
  feedback, 
  defaultNotes, 
  onFeedbackChange, 
  onSaveFeedback 
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Feedback</CardTitle>
        <CardDescription>
          Add notes or feedback about this idea
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea 
          placeholder="Add your feedback or notes here..."
          className="min-h-24 resize-none"
          value={feedback || defaultNotes || ''}
          onChange={(e) => onFeedbackChange(e.target.value)}
        />
        <Button 
          className="w-full"
          onClick={onSaveFeedback}
        >
          Save Feedback
        </Button>
      </CardContent>
    </Card>
  );
};

export default IdeaFeedback;
