
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Check, Eye, MoreHorizontal, Trash } from 'lucide-react';
import { DraftWithIdea } from '@/hooks/useDrafts';
import { getTypeBadgeClasses } from '@/components/ideas/BadgeUtils';

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
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface DraftsTableProps {
  drafts: DraftWithIdea[];
  selectedItems: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onMarkAsReady: (id: string) => void;
  onRequestDelete: (id: string) => void;
}

export const DraftsTable: React.FC<DraftsTableProps> = ({
  drafts,
  selectedItems,
  onToggleSelect,
  onToggleSelectAll,
  onMarkAsReady,
  onRequestDelete
}) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={drafts.length > 0 && selectedItems.length === drafts.length}
                onCheckedChange={onToggleSelectAll}
                aria-label="Select all drafts"
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drafts.map((draft) => (
            <TableRow key={draft.id}>
              <TableCell>
                <Checkbox 
                  checked={selectedItems.includes(draft.id)} 
                  onCheckedChange={() => onToggleSelect(draft.id)}
                  aria-label={`Select draft ${draft.ideaTitle}`}
                />
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{draft.ideaTitle}</div>
                  <div className="text-sm text-muted-foreground truncate max-w-xs">
                    {draft.content.substring(0, 60)}...
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getTypeBadgeClasses(draft.contentType)}>
                  {draft.contentType.charAt(0).toUpperCase() + draft.contentType.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">v{draft.version}</Badge>
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(draft.createdAt), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => onMarkAsReady(draft.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark as Ready
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
                          <Eye className="h-4 w-4 mr-2" />
                          View Draft
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onRequestDelete(draft.id)}
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
