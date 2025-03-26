import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Pencil, Save, X, CheckCircle } from 'lucide-react';
import { ContentIdea } from '@/types';
import { getStatusBadgeClasses } from './BadgeUtils';

interface IdeaPageHeaderProps {
  idea: ContentIdea;
  onEdit: () => void;
  onCancel: () => void;
  isEditing?: boolean;
  onApprove?: () => void;
}

const IdeaPageHeader: React.FC<IdeaPageHeaderProps> = ({ 
  idea, 
  onEdit,
  onCancel,
  isEditing = false,
  onApprove 
}) => {
  const navigate = useNavigate();
  const statusBadgeClass = getStatusBadgeClasses(idea.status);
  
  const handleSaveClick = () => {
    // Find and submit the form
    const form = document.getElementById('idea-edit-form') as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  };
  
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
        
        {idea.status !== 'approved' && onApprove && !isEditing && (
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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold sm:text-3xl">{idea.title}</h1>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  size="sm"
                  className="gap-1"
                  onClick={handleSaveClick}
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  className="gap-1"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={onEdit}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaPageHeader;
