
import React from 'react';
import { Link } from 'react-router-dom';
import { ContentCard } from './ContentCard';
import { DraftWithIdea } from '@/hooks/useDrafts';
import { Button } from "@/components/ui/button";
import { Copy, FileText, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from "@/components/ui/checkbox";

interface DraftContentCardProps {
  draft: DraftWithIdea;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCopy?: (content: string, id: string) => void;
  copiedId?: string | null;
  showActions?: boolean;
  showCheckbox?: boolean;
  contentPreviewLength?: number;
}

export const DraftContentCard: React.FC<DraftContentCardProps> = ({
  draft,
  isSelected = false,
  onToggleSelect,
  onDelete,
  onCopy,
  copiedId,
  showActions = true,
  showCheckbox = false,
  contentPreviewLength = 150,
}) => {
  const createdDate = new Date(draft.createdAt);
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(draft.id);
  };
  
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCopy) {
      onCopy(draft.content, draft.id);
    } else {
      navigator.clipboard.writeText(draft.content);
      toast.success("Content copied to clipboard");
    }
  };
  
  const handleToggleSelect = () => {
    if (onToggleSelect) onToggleSelect(draft.id);
  };
  
  // Truncate content for preview
  const contentPreview = draft.content.length > contentPreviewLength
    ? `${draft.content.substring(0, contentPreviewLength)}...`
    : draft.content;
  
  // Prepare actions for the card
  const actions = showActions ? (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className={copiedId === draft.id ? "bg-green-50 text-green-700" : ""}
      >
        <Copy className="h-4 w-4 mr-1" />
        {copiedId === draft.id ? "Copied!" : "Copy"}
      </Button>
      
      {onDelete && (
        <Button 
          variant="outline" 
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={handleDelete}
        >
          <Trash className="h-4 w-4 mr-1" />
          Delete
        </Button>
      )}
    </>
  ) : null;
  
  // Content to show inside the card
  const additionalContent = (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground line-clamp-3 mt-2">
        {contentPreview}
      </div>
    </div>
  );
  
  // Selection element (checkbox)
  const selectionElement = showCheckbox && onToggleSelect ? (
    <Checkbox 
      id={`select-${draft.id}`} 
      className="mr-2 mt-1"
      checked={isSelected}
      onCheckedChange={handleToggleSelect}
    />
  ) : null;
  
  return (
    <ContentCard
      id={draft.id}
      title={draft.ideaTitle}
      contentType={draft.contentType}
      status={draft.status}
      statusType="draft"
      createdAt={createdDate}
      detailPath={`/drafts/${draft.id}`}
      actions={actions}
      selectionElement={selectionElement}
      isSelected={isSelected}
    >
      {additionalContent}
    </ContentCard>
  );
};

export default DraftContentCard;
