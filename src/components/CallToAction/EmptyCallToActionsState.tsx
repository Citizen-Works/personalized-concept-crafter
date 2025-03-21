
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquareShare } from 'lucide-react';
import { useDialogOpen } from '@/hooks/useDialogOpen'; // If this hook doesn't exist, we'll implement it

interface EmptyCallToActionsStateProps {
  onClick: () => void;
}

export const EmptyCallToActionsState: React.FC<EmptyCallToActionsStateProps> = ({ onClick }) => {
  return (
    <Card className="flex flex-col items-center justify-center h-full min-h-[200px] border-dashed">
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <MessageSquareShare className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-medium mb-2">Add a Call To Action</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Create effective calls to action for your audience to engage with your content
        </p>
        <Button onClick={onClick} className="gap-1">
          <Plus className="h-4 w-4" />
          Add Call To Action
        </Button>
      </CardContent>
    </Card>
  );
};
