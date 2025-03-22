
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Pencil, CheckCircle } from 'lucide-react';
import { ContentIdea } from '@/types';
import { getStatusBadgeClasses } from './BadgeUtils';

interface IdeaPageHeaderProps {
  idea: ContentIdea;
  onEdit: () => void;
  onApprove?: () => void;
}

const IdeaPageHeader: React.FC<IdeaPageHeaderProps> = ({ 
  idea, 
  onEdit,
  onApprove 
}) => {
  const navigate = useNavigate();
  
  // Use the utility function directly instead of importing a non-existent function
  const statusBadgeClass = getStatusBadgeClasses(idea.status);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => navigate('/ideas')}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Ideas
        </Button>
        
        <div className="flex gap-2">
          {idea.status !== 'approved' && onApprove && (
            <Button
              variant="default"
              size="sm"
              className="gap-1"
              onClick={onApprove}
            >
              <CheckCircle className="h-4 w-4" />
              Approve Idea
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
            Edit Idea
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Badge className={statusBadgeClass}>
            {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
          </Badge>
          {idea.hasBeenUsed && (
            <Badge className="bg-blue-50 text-blue-700 border-blue-200">
              Used in Drafts
            </Badge>
          )}
        </div>
        <h1 className="text-2xl font-semibold sm:text-3xl">{idea.title}</h1>
      </div>
    </div>
  );
};

export default IdeaPageHeader;
