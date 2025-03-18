
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ContentIdea, ContentStatus } from '@/types';
import { useIdeas } from '@/hooks/ideas';

interface IdeaActionsProps {
  id: string;
  status: ContentStatus;
  onDeleteIdea: () => void;
  onEdit: () => void;
}

const IdeaActions: React.FC<IdeaActionsProps> = ({ id, status, onDeleteIdea, onEdit }) => {
  const { updateIdea } = useIdeas();
  
  const handleApproveIdea = async () => {
    try {
      await updateIdea({
        id,
        status: 'approved'
      });
      toast.success('Idea approved successfully');
    } catch (error) {
      console.error('Error approving idea:', error);
      toast.error('Failed to approve idea');
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status !== 'approved' && (
          <Button 
            variant="default" 
            className="w-full gap-1" 
            onClick={handleApproveIdea}
          >
            <CheckCircle className="h-4 w-4" />
            Approve Idea
          </Button>
        )}
        
        <Button 
          variant="outline" 
          className="w-full gap-1" 
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
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
