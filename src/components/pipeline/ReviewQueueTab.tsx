
import React, { useState, useMemo } from 'react';
import { useIdeas } from '@/hooks/ideas';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
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
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Eye, Check, X, ArrowUpRight, Trash } from "lucide-react";
import { ContentType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { getTypeBadgeClasses } from '@/components/ideas/BadgeUtils';

interface ReviewQueueTabProps {
  searchQuery: string;
  dateRange: [Date | undefined, Date | undefined];
  contentTypeFilter: ContentType | "all";
}

export const ReviewQueueTab: React.FC<ReviewQueueTabProps> = ({ 
  searchQuery, 
  dateRange, 
  contentTypeFilter 
}) => {
  const { ideas, isLoading, updateIdea, deleteIdea } = useIdeas();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [previewItem, setPreviewItem] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  // Filter ideas based on search, date range, and content type
  const filteredIdeas = useMemo(() => {
    return ideas.filter(idea => {
      // Filter by status
      if (idea.status !== 'unreviewed') return false;
      
      // Filter by source being meeting (or allow manual for demo purposes)
      // Comment out this condition if you want to see all unreviewed ideas
      // if (idea.source !== 'meeting') return false;
      
      // Filter by search query
      if (searchQuery && !idea.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !idea.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by date range
      const ideaDate = new Date(idea.createdAt);
      if (dateRange[0] && ideaDate < dateRange[0]) return false;
      if (dateRange[1]) {
        const endDate = new Date(dateRange[1]);
        endDate.setHours(23, 59, 59, 999);
        if (ideaDate > endDate) return false;
      }
      
      // Filter by content type
      if (contentTypeFilter !== "all" && idea.contentType !== contentTypeFilter) {
        return false;
      }
      
      return true;
    });
  }, [ideas, searchQuery, dateRange, contentTypeFilter]);
  
  // Get preview idea
  const previewIdea = useMemo(() => {
    if (!previewItem) return null;
    return ideas.find(idea => idea.id === previewItem) || null;
  }, [previewItem, ideas]);
  
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
    if (selectedItems.length === filteredIdeas.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredIdeas.map(idea => idea.id));
    }
  };
  
  // Handle approve idea
  const handleApprove = async (id: string) => {
    try {
      await updateIdea({ id, status: 'approved' });
      toast.success("Content idea approved");
    } catch (error) {
      console.error("Error approving idea:", error);
      toast.error("Failed to approve content idea");
    }
  };
  
  // Handle archive idea
  const handleArchive = async (id: string) => {
    try {
      await updateIdea({ id, status: 'archived' });
      toast.success("Content idea archived");
    } catch (error) {
      console.error("Error archiving idea:", error);
      toast.error("Failed to archive content idea");
    }
  };
  
  // Handle delete idea
  const handleDelete = async (id: string) => {
    try {
      await deleteIdea(id);
      toast.success("Content idea deleted");
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting idea:", error);
      toast.error("Failed to delete content idea");
    }
  };
  
  // Handle batch approve
  const handleBatchApprove = async () => {
    try {
      const promises = selectedItems.map(id => updateIdea({ id, status: 'approved' }));
      await Promise.all(promises);
      toast.success(`${selectedItems.length} items approved`);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error batch approving ideas:", error);
      toast.error("Failed to approve selected items");
    }
  };
  
  // Handle batch archive
  const handleBatchArchive = async () => {
    try {
      const promises = selectedItems.map(id => updateIdea({ id, status: 'archived' }));
      await Promise.all(promises);
      toast.success(`${selectedItems.length} items archived`);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error batch archiving ideas:", error);
      toast.error("Failed to archive selected items");
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-12 w-full" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-8 w-20" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  if (filteredIdeas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/10">
        <h3 className="text-xl font-medium mb-2">No items in review queue</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Content from meeting transcripts or other automated sources will appear here for review.
        </p>
        <Button variant="outline" asChild>
          <a href="/transcripts">Upload a Meeting Transcript</a>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Batch actions */}
      {selectedItems.length > 0 && (
        <div className="bg-muted/30 p-3 rounded-md flex items-center justify-between">
          <span className="text-sm font-medium">{selectedItems.length} items selected</span>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleBatchApprove}>
              <Check className="h-4 w-4 mr-1" />
              Approve All
            </Button>
            <Button size="sm" variant="outline" onClick={handleBatchArchive}>
              <X className="h-4 w-4 mr-1" />
              Archive All
            </Button>
          </div>
        </div>
      )}
      
      {/* Select all */}
      <div className="flex items-center mb-2">
        <Checkbox 
          id="select-all" 
          checked={filteredIdeas.length > 0 && selectedItems.length === filteredIdeas.length}
          onCheckedChange={handleSelectAll}
        />
        <label htmlFor="select-all" className="text-sm font-medium ml-2 cursor-pointer">
          Select All
        </label>
      </div>
      
      {/* Review items */}
      {filteredIdeas.map((idea) => (
        <Card key={idea.id} className="overflow-hidden transition-all duration-200">
          <CardHeader className="pb-2">
            <div className="flex items-start">
              <Checkbox 
                id={`select-${idea.id}`} 
                className="mr-2 mt-1"
                checked={selectedItems.includes(idea.id)}
                onCheckedChange={() => handleToggleSelect(idea.id)}
              />
              <div>
                <CardTitle className="text-base">{idea.title}</CardTitle>
                <CardDescription>
                  {idea.source === 'meeting' ? 'From meeting transcript' : 'Manually created'} • {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {idea.description || "No description provided"}
              </p>
              <Badge className={`ml-2 shrink-0 ${getTypeBadgeClasses(idea.contentType)}`}>
                {idea.contentType.charAt(0).toUpperCase() + idea.contentType.slice(1)}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" asChild>
              <a href={`/ideas/${idea.id}`} target="_blank" rel="noopener noreferrer">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                View Details
              </a>
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setPreviewItem(idea.id)}
                title="Quick View"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                variant="default" 
                size="icon" 
                onClick={() => handleApprove(idea.id)}
                title="Approve"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleArchive(idea.id)}
                title="Archive"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  setItemToDelete(idea.id);
                  setDeleteConfirmOpen(true);
                }}
                title="Delete"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
      
      {/* Quick preview dialog */}
      <Dialog open={!!previewItem} onOpenChange={(open) => !open && setPreviewItem(null)}>
        {previewIdea && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>{previewIdea.title}</DialogTitle>
              <DialogDescription>
                Created {formatDistanceToNow(new Date(previewIdea.createdAt), { addSuffix: true })}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm">{previewIdea.description || "No description provided"}</p>
              </div>
              
              {previewIdea.meetingTranscriptExcerpt && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Meeting Transcript Excerpt</h4>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    {previewIdea.meetingTranscriptExcerpt}
                  </div>
                </div>
              )}
              
              {previewIdea.notes && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Notes</h4>
                  <p className="text-sm">{previewIdea.notes}</p>
                </div>
              )}
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setPreviewItem(null)}>
                  Close
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => {
                    handleApprove(previewIdea.id);
                    setPreviewItem(null);
                  }}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleArchive(previewIdea.id);
                    setPreviewItem(null);
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Archive
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
      
      {/* Delete confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this content idea. This action cannot be undone.
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
