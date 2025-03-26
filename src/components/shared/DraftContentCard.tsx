import React from 'react';
import { Link } from 'react-router-dom';
import { ContentCard } from './ContentCard';
import { DraftWithIdea } from '@/hooks/useDrafts';
import { Button } from "@/components/ui/button";
import { Copy, FileText, Trash, Archive, CheckCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from "@/components/ui/checkbox";
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';
import { ContentType, DraftStatus } from '@/types';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface DraftContentCardProps {
  id: string;
  title: string;
  content: string;
  contentType: ContentType;
  status: DraftStatus;
  createdAt: string | Date;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onStatusChange?: (id: string, status: DraftStatus) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  showCheckbox?: boolean;
  isUpdating?: boolean;
}

export const DraftContentCard: React.FC<DraftContentCardProps> = ({
  id,
  title,
  content,
  contentType,
  status,
  createdAt,
  isSelected = false,
  onToggleSelect,
  onStatusChange,
  onArchive,
  onDelete,
  showCheckbox = false,
  isUpdating = false,
}) => {
  const isMobile = useIsMobile();
  const [isCopied, setIsCopied] = React.useState(false);
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(id);
  };
  
  const handleToggleSelect = () => {
    if (onToggleSelect) onToggleSelect(id);
  };
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      toast.success("Content copied to clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy content:", error);
      toast.error("Failed to copy to clipboard");
    }
  };
  
  // Format the creation date
  const createdDate = new Date(createdAt);
  
  // Prepare actions for the card
  const actions = (
    <div className="flex items-center gap-2">
      {status === 'ready' && onStatusChange && (
        <Button
          variant="default"
          size={isMobile ? "sm" : "default"}
          onClick={() => onStatusChange(id, 'published')}
          className="gap-1"
        >
          <CheckCircle className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          Mark as Published
        </Button>
      )}
      
      <Button
        variant={isCopied ? "outline" : "default"}
        size={isMobile ? "sm" : "default"}
        onClick={handleCopy}
        className="gap-1"
      >
        <Copy className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
        {isCopied ? "Copied!" : "Copy"}
      </Button>
      
      {status === 'published' && (
        <>
          <Button 
            variant="outline" 
            size="icon"
            disabled 
            className="opacity-60"
          >
            <ExternalLink className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          </Button>
        </>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={isMobile ? 'h-3 w-3' : 'h-4 w-4'}
            >
              <path
                d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onStatusChange && status === 'published' && (
            <>
              <DropdownMenuItem onClick={() => onStatusChange(id, 'draft')}>
                <FileText className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
                Move to Draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(id, 'ready')}>
                <CheckCircle className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
                Move to Ready
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {onStatusChange && status === 'ready' && (
            <>
              <DropdownMenuItem onClick={() => onStatusChange(id, 'draft')}>
                <FileText className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
                Move to Draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(id, 'published')}>
                <CheckCircle className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
                Mark as Published
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {onArchive && (
            <DropdownMenuItem onClick={() => onArchive(id)}>
              <Archive className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
              Archive
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-destructive"
              disabled={isUpdating}
            >
              <Trash className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
  
  // Determine whether to use the checkbox
  const selectionElement = showCheckbox && onToggleSelect ? (
    <Checkbox 
      id={`select-${id}`} 
      className="mr-2 mt-1"
      checked={isSelected}
      onCheckedChange={handleToggleSelect}
      disabled={isUpdating}
    />
  ) : null;
  
  return (
    <ContentCard
      id={id}
      title={title}
      description={content}
      contentType={contentType}
      status={status}
      statusType="draft"
      createdAt={createdDate}
      actions={actions}
      selectionElement={selectionElement}
      isSelected={isSelected}
    />
  );
};

export default DraftContentCard;
