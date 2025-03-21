
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Edit, 
  ArrowRight, 
  Trash,
  MoreHorizontal,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { DraftWithIdea } from '@/hooks/useDrafts';
import { getTypeBadgeClasses } from '@/components/ideas/BadgeUtils';

interface DraftListProps {
  drafts: DraftWithIdea[];
  selectedDrafts: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onDelete: (id: string) => void;
  isMobile?: boolean;
}

export const DraftList: React.FC<DraftListProps> = ({ 
  drafts, 
  selectedDrafts, 
  onToggleSelect, 
  onToggleSelectAll,
  onDelete,
  isMobile = false
}) => {
  const allSelected = drafts.length > 0 && selectedDrafts.length === drafts.length;
  
  const handleDeleteDraft = (draftId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (window.confirm('Are you sure you want to delete this draft?')) {
      onDelete(draftId);
    }
  };

  // Mobile list view
  if (isMobile) {
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
  }

  // Desktop table view
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={allSelected} 
                onCheckedChange={onToggleSelectAll}
                aria-label="Select all drafts"
              />
            </TableHead>
            <TableHead>Draft</TableHead>
            <TableHead className="hidden md:table-cell">Content Type</TableHead>
            <TableHead className="hidden md:table-cell">Version</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drafts.map((draft) => (
            <TableRow 
              key={draft.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onToggleSelect(draft.id)}
            >
              <TableCell className="p-4">
                <Checkbox 
                  checked={selectedDrafts.includes(draft.id)} 
                  onCheckedChange={() => onToggleSelect(draft.id)}
                  aria-label={`Select draft ${draft.ideaTitle}`}
                  onClick={(e) => e.stopPropagation()}
                />
              </TableCell>
              <TableCell className="font-medium p-4">
                <div className="space-y-1">
                  <div>{draft.ideaTitle}</div>
                  <div className="text-sm text-muted-foreground line-clamp-1">
                    {draft.content}
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell p-4">
                <Badge className={getTypeBadgeClasses(draft.contentType)}>
                  {draft.contentType.charAt(0).toUpperCase() + draft.contentType.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell p-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                  v{draft.version}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground p-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDistanceToNow(new Date(draft.createdAt), { addSuffix: true })}
                </div>
              </TableCell>
              <TableCell className="p-4">
                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/drafts/${draft.id}`}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
