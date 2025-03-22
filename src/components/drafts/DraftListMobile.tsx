
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Edit, 
  ArrowRight, 
  Trash,
  MoreHorizontal,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { DraftWithIdea } from '@/hooks/useDrafts';
import { getTypeBadgeClasses } from '@/components/ideas/BadgeUtils';

interface DraftListMobileProps {
  drafts: DraftWithIdea[];
  selectedDrafts: string[];
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const DraftListMobile: React.FC<DraftListMobileProps> = ({ 
  drafts, 
  selectedDrafts, 
  onToggleSelect, 
  onDelete 
}) => {
  const handleDeleteDraft = (draftId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (window.confirm('Are you sure you want to delete this draft?')) {
      onDelete(draftId);
    }
  };

  return (
    <div className="space-y-3">
      {drafts.map((draft) => (
        <div 
          key={draft.id}
          className="border rounded-md p-3 relative bg-card"
        >
          <div className="flex items-start gap-3">
            <Checkbox
              checked={selectedDrafts.includes(draft.id)}
              onCheckedChange={() => onToggleSelect(draft.id)}
              aria-label={`Select draft ${draft.ideaTitle}`}
              className="mt-1 h-5 w-5"
            />
            <div className="flex-1">
              <Link to={`/drafts/${draft.id}`} className="block">
                <h3 className="font-medium line-clamp-1">{draft.ideaTitle}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {draft.content}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge className={getTypeBadgeClasses(draft.contentType)}>
                    {draft.contentType.charAt(0).toUpperCase() + draft.contentType.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                    v{draft.version}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(draft.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </Link>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/drafts/${draft.id}`}>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={`/drafts/${draft.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => handleDeleteDraft(draft.id, e)}
                  className="text-destructive"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
};
