import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from 'lucide-react';
import { ContentStatus } from '@/types/content';

interface IdeaActionsProps {
  id: string;
  status: ContentStatus;
  onDeleteIdea: () => void;
  onEdit: () => void;
}

const IdeaActions: React.FC<IdeaActionsProps> = ({ id, status, onDeleteIdea, onEdit }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full gap-1" 
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
          Edit Idea
        </Button>
        <Button 
          variant="destructive" 
          className="w-full gap-1"
          onClick={onDeleteIdea}
        >
          <Trash className="h-4 w-4" />
          Delete Idea
        </Button>
      </CardContent>
    </Card>
  );
};

export default IdeaActions;
