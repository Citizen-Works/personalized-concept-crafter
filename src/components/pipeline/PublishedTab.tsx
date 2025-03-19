
import React, { useState, useMemo } from 'react';
import { useDrafts } from '@/hooks/useDrafts';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Archive, BarChart, ExternalLink, MoreHorizontal, Trash } from 'lucide-react';
import { ContentType } from '@/types';
import { getTypeBadgeClasses } from '@/components/ideas/BadgeUtils';

import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
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

interface PublishedTabProps {
  searchQuery: string;
  dateRange: [Date | undefined, Date | undefined];
  contentTypeFilter: ContentType | "all";
}

export const PublishedTab: React.FC<PublishedTabProps> = ({ 
  searchQuery, 
  dateRange, 
  contentTypeFilter 
}) => {
  const { drafts, isLoading, updateDraft, deleteDraft } = useDrafts();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  // Filter drafts based on search, date range, and content type
  const filteredDrafts = useMemo(() => {
    return drafts.filter(draft => {
      // Filter by status (show published status)
      if (draft.status !== 'published') return false;
      
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
  
  // Handle archive
  const handleArchive = async (id: string) => {
    try {
      await updateDraft({ id, status: 'archived' });
      toast.success("Content archived");
    } catch (error) {
      console.error("Error archiving draft:", error);
      toast.error("Failed to archive content");
    }
  };
  
  // Handle delete draft
  const handleDelete = async (id: string) => {
    try {
      await deleteDraft(id);
      toast.success("Content deleted");
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting draft:", error);
      toast.error("Failed to delete content");
    }
  };
  
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-6 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  if (filteredDrafts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/10">
        <h3 className="text-xl font-medium mb-2">No published content</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Content that has been published will appear here after you mark content as published.
        </p>
        <Button variant="outline" asChild>
          <a href="/pipeline?tab=ready">Go to Ready to Publish</a>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Published content */}
      {filteredDrafts.map((draft) => (
        <Card key={draft.id} className="overflow-hidden transition-all duration-200">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">{draft.ideaTitle}</CardTitle>
              <Badge className={getTypeBadgeClasses(draft.contentType)}>
                {draft.contentType.charAt(0).toUpperCase() + draft.contentType.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm line-clamp-4">
              {draft.content.substring(0, 200)}...
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Published on {format(new Date(draft.createdAt), 'MMM d, yyyy')}
            </div>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      disabled 
                      className="opacity-60"
                    >
                      <BarChart className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Performance metrics coming soon</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      disabled 
                      className="opacity-60"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View on platform feature coming soon</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleArchive(draft.id)}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
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
          </CardFooter>
        </Card>
      ))}
      
      {/* Delete confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this published content. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => itemToDelete && handleDelete(itemToDelete)}
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
