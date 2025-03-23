
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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Edit, 
  ArrowRight, 
  Trash,
  MoreHorizontal,
  Clock,
  Copy
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { DraftWithIdea } from '@/hooks/useDrafts';
import { TypeBadge, StatusBadge } from '@/components/ui/StatusBadge';
import { toast } from 'sonner';

interface DraftListTableProps {
  drafts: DraftWithIdea[];
  selectedDrafts: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onDelete: (id: string) => void;
}

export const DraftListTable: React.FC<DraftListTableProps> = ({ 
  drafts, 
  selectedDrafts, 
  onToggleSelect, 
  onToggleSelectAll,
  onDelete
}) => {
  const allSelected = drafts.length > 0 && selectedDrafts.length === drafts.length;
  
  const handleDeleteDraft = (draftId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (window.confirm('Are you sure you want to delete this draft?')) {
      onDelete(draftId);
    }
  };
  
  const handleCopyContent = (content: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    navigator.clipboard.writeText(content);
    toast.success("Content copied to clipboard");
  };

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
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="w-[140px]">Actions</TableHead>
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
                <TypeBadge type={draft.contentType} />
              </TableCell>
              <TableCell className="hidden md:table-cell p-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  v{draft.version}
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell p-4">
                <StatusBadge status={draft.status} type="draft" />
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
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => handleCopyContent(draft.content, e)}
                    title="Copy content"
                  >
                    <Copy className="h-4 w-4" />
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
