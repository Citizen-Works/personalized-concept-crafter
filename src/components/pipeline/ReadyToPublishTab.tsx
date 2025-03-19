
import React, { useState, useMemo } from 'react';
import { useDrafts } from '@/hooks/useDrafts';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { Calendar, Check, Copy, MoreHorizontal, Trash } from 'lucide-react';
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

interface ReadyToPublishTabProps {
  searchQuery: string;
  dateRange: [Date | undefined, Date | undefined];
  contentTypeFilter: ContentType | "all";
}

export const ReadyToPublishTab: React.FC<ReadyToPublishTabProps> = ({ 
  searchQuery, 
  dateRange, 
  contentTypeFilter 
}) => {
  const { drafts, isLoading, updateDraft, deleteDraft } = useDrafts();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Filter drafts based on search, date range, and content type
  const filteredDrafts = useMemo(() => {
    return drafts.filter(draft => {
      // Filter by status (show ready status)
      if (draft.status !== 'ready') return false;
      
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
  
  // Handle mark as published
  const handleMarkAsPublished = async (id: string) => {
    try {
      await updateDraft({ id, status: 'published' });
      toast.success("Content marked as published");
    } catch (error) {
      console.error("Error updating draft:", error);
      toast.error("Failed to update status");
    }
  };
  
  // Handle copy content
  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success("Content copied to clipboard");
    
    // Reset copied status after 2 seconds
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
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
  
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-6 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
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
        <h3 className="text-xl font-medium mb-2">No content ready to publish</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Content that is ready to be published will appear here after you mark drafts as ready.
        </p>
        <Button variant="outline" asChild>
          <a href="/pipeline?tab=drafts">Go to Drafts</a>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
      {/* Ready to publish content */}
      {filteredDrafts.map((draft) => (
        <Card key={draft.id} className="overflow-hidden transition-all duration-200">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle>{draft.ideaTitle}</CardTitle>
              <Badge className={getTypeBadgeClasses(draft.contentType)}>
                {draft.contentType.charAt(0).toUpperCase() + draft.contentType.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md whitespace-pre-wrap text-sm">
              {draft.content}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Ready {formatDistanceToNow(new Date(draft.createdAt), { addSuffix: true })}
            </div>
            <div className="flex gap-2">
              <Button 
                variant={copiedId === draft.id ? "outline" : "default"}
                onClick={() => handleCopy(draft.content, draft.id)}
              >
                <Copy className="h-4 w-4 mr-2" />
                {copiedId === draft.id ? "Copied!" : "Copy"}
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleMarkAsPublished(draft.id)}
              >
                <Check className="h-4 w-4 mr-2" />
                Mark as Published
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      disabled 
                      className="opacity-60"
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Schedule feature coming soon</p>
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
              This will permanently delete this content. This action cannot be undone.
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
