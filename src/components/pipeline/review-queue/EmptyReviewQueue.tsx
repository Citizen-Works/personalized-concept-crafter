
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

export const EmptyReviewQueue: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/10">
      <h3 className="text-xl font-medium mb-2">No items in review queue</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Content from meeting transcripts or other automated sources will appear here for review.
      </p>
      <Button variant="outline" asChild>
        <Link to="/transcripts">Upload a Meeting Transcript</Link>
      </Button>
    </div>
  );
};
