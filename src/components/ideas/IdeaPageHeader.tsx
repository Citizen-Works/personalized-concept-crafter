
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit } from 'lucide-react';
import { ContentIdea } from '@/types';
import { getStatusBadgeProps, getContentTypeBadgeProps } from './BadgeUtils';

interface IdeaPageHeaderProps {
  idea: ContentIdea;
  onEdit: () => void;
}

const IdeaPageHeader: React.FC<IdeaPageHeaderProps> = ({ idea, onEdit }) => {
  const navigate = useNavigate();
  const statusBadge = getStatusBadgeProps(idea.status);
  const contentTypeBadge = getContentTypeBadgeProps(idea.contentType);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => navigate('/ideas')}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Ideas
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
          Edit Idea
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Badge {...statusBadge} />
          <Badge {...contentTypeBadge} />
        </div>
        <h1 className="text-2xl font-semibold sm:text-3xl">{idea.title}</h1>
      </div>
    </div>
  );
};

export default IdeaPageHeader;
