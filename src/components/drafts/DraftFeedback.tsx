
import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type DraftFeedbackProps = {
  initialFeedback: string;
  onSaveFeedback: (feedback: string) => Promise<void>;
};

export const DraftFeedback: React.FC<DraftFeedbackProps> = ({ 
  initialFeedback,
  onSaveFeedback
}) => {
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFeedback(initialFeedback || '');
  }, [initialFeedback]);

  const handleSaveFeedback = async () => {
    setIsSubmitting(true);
    try {
      await onSaveFeedback(feedback);
    } catch (error) {
      console.error('Error saving feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Feedback</CardTitle>
        <CardDescription>
          Provide feedback on this draft
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button variant="outline" className="flex-1 gap-1">
            <ThumbsDown className="h-4 w-4" />
            Needs Work
          </Button>
          <Button variant="outline" className="flex-1 gap-1">
            <ThumbsUp className="h-4 w-4" />
            Looks Good
          </Button>
        </div>
        
        <Textarea 
          placeholder="Add specific feedback here..."
          className="min-h-24 resize-none"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <Button 
          className="w-full"
          onClick={handleSaveFeedback}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Feedback'}
        </Button>
      </CardContent>
    </Card>
  );
};
