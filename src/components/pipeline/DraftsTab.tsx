
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDrafts } from '@/hooks/useDrafts';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { Check, ChevronDown, Eye, MoreHorizontal, Trash } from 'lucide-react';
import { ContentType } from '@/types';
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
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface DraftsTabProps {
  searchQuery: string;
  dateRange: [Date | undefined, Date | undefined];
  contentTypeFilter: ContentType | "all";
}

export const DraftsTab: React.FC<DraftsTabProps> = ({ 
  searchQuery, 
  dateRange, 
  contentTypeFilter 
}) => {
  const { drafts, isLoading, updateDraft, deleteDraft } = useDrafts();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  
  // Filter drafts based on search, date range, and content type
  const filteredDrafts = useMemo(() => {
    return drafts.filter(draft => {
      // Filter by status (show drafted status)
      if (draft.status !== 'draft') return false;
      
      // Filter by search query
      if (searchQuery && !draft.ideaTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !draft.content.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by date range
      const draftDate = new Date(draft.createdAt);
      if (dateRange[0] && draftDate < dateRange[0]) return false;
      if (dateRange[1]) {
        const endDate = new Date(dateRange[1]);
        endDate.setHours(23, 59, 59, 999);
        if (draftDate > endDate) return false;
      }
      
      // Filter by content type
      if (contentTypeFilter !== "all" && draft.contentType !== contentTypeFilter) {
        return false;
      }
      
      return true;
    });
  }, [drafts, searchQuery, dateRange, contentTypeFilter]);
  
  // Sort filtered drafts
  const sortedDrafts = useMemo(() => {
    return [...filteredDrafts].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortOrder === 'alphabetical') {
        return a.ideaTitle.localeCompare(b.ideaTitle);
      }
      return 0;
    });
  }, [filteredDrafts, sortOrder]);
  
  // Handle toggle select
  const handleToggleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.length === sortedDrafts.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedDrafts.map(draft => draft.id));
    }
  };
  
  // Handle mark as ready
  const handleMarkAsReady = async (id: string) => {
    try {
      await updateDraft({ id, status: 'ready' });
      toast.success("Draft marked as ready to publish");
    } catch (error) {
      console.error("Error updating draft:", error);
      toast.error("Failed to update draft status");
    }
  };
  
  // Handle batch mark as ready
  const handleBatchMarkAsReady = async () => {
    try {
      const promises = selectedItems.map(id => updateDraft({ id, status: 'ready' }));
      await Promise.all(promises);
      toast.success(`${selectedItems.length} drafts marked as ready to publish`);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error batch updating drafts:", error);
      toast.error("Failed to update selected drafts");
    }
  };
  
  // Handle delete draft
  const handleDelete = async (id: string) => {
    try {
      await deleteDraft(id);
      toast.success("Draft deleted");
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting draft:", error);
      toast.error("Failed to delete draft");
    }
  };
  
  // Handle batch delete
  const handleBatchDelete = async () => {
    try {
      const promises = selectedItems.map(id => deleteDraft(id));
      await Promise.all(promises);
      toast.success(`${selectedItems.length} drafts deleted`);
      setSelectedItems([]);
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error("Error batch deleting drafts:", error);
      toast.error("Failed to delete selected drafts");
    }
  };
  
  if (isLoading) {
    return (
      <div className="border rounded-md overflow-hidden">
        <div className="p-4">
          <Skeleton className="h-8 w-32" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Skeleton className="h-4 w-4" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="h-4 w-16 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-full max-w-xs" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  
  if (sortedDrafts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/10">
        <h3 className="text-xl font-medium mb-2">No drafts found</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Draft content that has been generated from content ideas will appear here.
        </p>
        <Button asChild>
          <Link to="/ideas">
            Go to Content Ideas
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Top controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Checkbox 
            id="select-all-drafts" 
            checked={sortedDrafts.length > 0 && selectedItems.length === sortedDrafts.length}
            onCheckedChange={handleSelectAll}
          />
          <label htmlFor="select-all-drafts" className="text-sm font-medium ml-2 cursor-pointer">
            Select All
          </label>
        </div>
        
        <div className="flex gap-2">
          {selectedItems.length > 0 && (
            <>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleBatchMarkAsReady}
              >
                <Check className="h-4 w-4 mr-1" />
                Mark Selected as Ready
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setDeleteConfirmOpen(true)}
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete Selected
              </Button>
            </>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Sort by: {sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1)}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOrder('newest')}>
                Newest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('oldest')}>
                Oldest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('alphabetical')}>
                Alphabetical
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Drafts table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={sortedDrafts.length > 0 && selectedItems.length === sortedDrafts.length}
                  onCheckedChange={handleSelectAll}
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
            {sortedDrafts.map((draft) => (
              <TableRow key={draft.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedItems.includes(draft.id)} 
                    onCheckedChange={() => handleToggleSelect(draft.id)}
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
                      onClick={() => handleMarkAsReady(draft.id)}
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
                          onClick={() => {
                            setItemToDelete(draft.id);
                            setDeleteConfirmOpen(true);
                          }}
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
      
      {/* Delete confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {itemToDelete ? 'this draft' : `${selectedItems.length} selected drafts`}. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (itemToDelete) {
                  handleDelete(itemToDelete);
                } else {
                  handleBatchDelete();
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
