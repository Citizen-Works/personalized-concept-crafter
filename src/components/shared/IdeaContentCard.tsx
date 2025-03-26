import React from 'react';
import { ContentCard } from './ContentCard';
import { ContentIdea, ContentStatus } from '@/types';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Trash, Lightbulb, CheckCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface IdeaContentCardProps {
  idea: ContentIdea;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  onGenerate?: (id: string) => void;
  showActions?: boolean;
  showCheckbox?: boolean;
  isUpdating?: boolean;
}

export const IdeaContentCard: React.FC<IdeaContentCardProps> = ({
  idea,
  isSelected = false,
  onToggleSelect,
  onDelete,
  onGenerate,
  showActions = true,
  showCheckbox = false,
  isUpdating = false,
}) => {
  const isMobile = useIsMobile();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(idea.id);
  };
  
  const handleToggleSelect = () => {
    if (onToggleSelect) onToggleSelect(idea.id);
  };
  
  // Format the creation date
  const createdDate = new Date(idea.createdAt);
  
  // Prepare actions for the card
  const actions = showActions ? (
    <>
      {onGenerate && (
        <Button 
          variant="default" 
          size={isMobile ? "sm" : "default"} 
          className={isMobile ? "px-2 py-1 text-xs" : ""}
          onClick={() => onGenerate(idea.id)}
        >
          <Lightbulb className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-1'}`} />
          Generate
        </Button>
      )}
      
      {onDelete && (
        <Button 
          variant="outline" 
          size="icon"
          className={`text-destructive hover:text-destructive ${isMobile ? 'h-7 w-7' : ''}`}
          onClick={handleDelete}
          disabled={isUpdating}
        >
          <Trash className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
        </Button>
      )}
    </>
  ) : null;
  
  const additionalContent = (
    <>
      {idea.hasBeenUsed && (
        <div className="flex items-center text-xs text-green-600 gap-1 mt-1">
          <CheckCircle className="h-3 w-3" />
          <span>Used for content</span>
        </div>
      )}
    </>
  );
  
  // Determine whether to use the checkbox
  const selectionElement = showCheckbox && onToggleSelect ? (
    <Checkbox 
      id={`select-${idea.id}`} 
      className="mr-2 mt-1"
      checked={isSelected}
      onCheckedChange={handleToggleSelect}
      disabled={isUpdating}
    />
  ) : null;
  
  return (
    <ContentCard
      id={idea.id}
      title={idea.title}
      description={idea.description}
      status={idea.status}
      statusType="content"
      createdAt={createdDate}
      detailPath={`/ideas/${idea.id}`}
      actions={actions}
      selectionElement={selectionElement}
      isSelected={isSelected}
    >
      {additionalContent}
    </ContentCard>
  );
};
