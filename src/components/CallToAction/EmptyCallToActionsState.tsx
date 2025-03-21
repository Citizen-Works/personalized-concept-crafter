
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquareShare } from 'lucide-react';
import { AddCallToActionDialog } from './AddCallToActionDialog';

interface EmptyCallToActionsStateProps {
  onRefresh: () => void;
}

export const EmptyCallToActionsState: React.FC<EmptyCallToActionsStateProps> = ({ onRefresh }) => {
  return (
    <Card className="flex flex-col items-center justify-center h-full min-h-[200px] border-dashed">
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <MessageSquareShare className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-medium mb-2">Add a Call To Action</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Create effective calls to action for your audience to engage with your content
        </p>
        <AddCallToActionDialog onCallToActionAdded={onRefresh} buttonLabel="Add Call To Action" />
      </CardContent>
    </Card>
  );
};
