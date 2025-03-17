
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from 'lucide-react';

interface IdeaActionsProps {
  id: string;
  onDeleteIdea: () => void;
}

const IdeaActions: React.FC<IdeaActionsProps> = ({ id, onDeleteIdea }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full gap-1" 
          asChild
        >
          <Link to={`/ideas/${id}/edit`}>
            <Edit className="h-4 w-4" />
            Edit Idea
          </Link>
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
