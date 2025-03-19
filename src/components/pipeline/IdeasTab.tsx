
import React, { useState, useMemo } from 'react';
import { useIdeas } from '@/hooks/ideas';
import { Link } from 'react-router-dom';
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
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
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
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { getTypeBadgeClasses, getStatusBadgeClasses } from '@/components/ideas/BadgeUtils';
import { ContentType } from "@/types";
import { ArrowUpRight, ChevronDown, Edit, FileEdit, MoreHorizontal, Plus, Trash } from "lucide-react";

interface IdeasTabProps {
  searchQuery: string;
  dateRange: [Date | undefined, Date | undefined];
  contentTypeFilter: ContentType | "all";
}

export const IdeasTab: React.FC<IdeasTabProps> = ({ 
  searchQuery, 
  dateRange, 
  contentTypeFilter 
}) => {
  const { ideas, isLoading, deleteIdea } = useIdeas();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  
  // Filter ideas based on search, date range, and content type
  const filteredIdeas = useMemo(() => {
    return ideas.filter(idea => {
      // Filter by approved status
      if (idea.status !== 'approved' && idea.status !== 'unreviewed') return false;
      
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
  
  // Sort filtered ideas
  const sortedIdeas = useMemo(() => {
    return [...filteredIdeas].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortOrder === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [filteredIdeas, sortOrder]);
  
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
    if (selectedItems.length === sortedIdeas.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedIdeas.map(idea => idea.id));
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
  
  // Handle batch delete
  const handleBatchDelete = async () => {
    try {
      const promises = selectedItems.map(id => deleteIdea(id));
      await Promise.all(promises);
      toast.success(`${selectedItems.length} items deleted`);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error batch deleting ideas:", error);
      toast.error("Failed to delete selected items");
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-12 w-full" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-8 w-20" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  if (sortedIdeas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/10">
        <h3 className="text-xl font-medium mb-2">No content ideas found</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Content ideas that have been approved or manually created will appear here.
        </p>
        <Button asChild>
          <Link to="/ideas/new">
            <Plus className="h-4 w-4 mr-1" />
            Create New Idea
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
            id="select-all" 
            checked={sortedIdeas.length > 0 && selectedItems.length === sortedIdeas.length}
            onCheckedChange={handleSelectAll}
          />
          <label htmlFor="select-all" className="text-sm font-medium ml-2 cursor-pointer">
            Select All
          </label>
        </div>
        
        <div className="flex gap-2">
          {selectedItems.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => {
                setDeleteConfirmOpen(true);
              }}
            >
              <Trash className="h-4 w-4 mr-1" />
              Delete Selected
            </Button>
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
          
          <Button asChild>
            <Link to="/ideas/new">
              <Plus className="h-4 w-4 mr-1" />
              New Idea
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Ideas list */}
      {sortedIdeas.map((idea) => (
        <Card key={idea.id} className="overflow-hidden transition-all duration-200">
          <CardHeader className="pb-2">
            <div className="flex items-start">
              <Checkbox 
                id={`select-${idea.id}`} 
                className="mr-2 mt-1"
                checked={selectedItems.includes(idea.id)}
                onCheckedChange={() => handleToggleSelect(idea.id)}
              />
              <div className="space-y-1 w-full">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{idea.title}</CardTitle>
                  <Badge className={getStatusBadgeClasses(idea.status)}>
                    {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Created {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
                </div>
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
              <Link to={`/ideas/${idea.id}`}>
                <ArrowUpRight className="h-4 w-4 mr-1" />
                View Details
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="default" 
                size="sm"
                asChild
              >
                <Link to={`/ideas/${idea.id}/generate`}>
                  <FileEdit className="h-4 w-4 mr-1" />
                  Generate Draft
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
                    <Link to={`/ideas/${idea.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => {
                      setItemToDelete(idea.id);
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
              This will permanently delete {itemToDelete ? 'this content idea' : `${selectedItems.length} selected ideas`}. 
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
