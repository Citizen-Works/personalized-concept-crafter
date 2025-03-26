import React, { useState, useMemo } from 'react';
import { useDrafts } from '@/hooks/useDrafts';
import { toast } from 'sonner';
import { ContentType } from '@/types';
import {
  EmptyPublishedState,
  PublishedContentSkeleton,
  DeleteConfirmDialog
} from './published';
import { DraftContentCard } from '@/components/shared/DraftContentCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
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

  // Sort drafts based on selected sort order
  const sortedDrafts = useMemo(() => {
    const sorted = [...filteredDrafts];
    return sorted.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [filteredDrafts, sortOrder]);
  
  // Handle status change
  const handleStatusChange = async (id: string, status: 'draft' | 'ready') => {
    try {
      await updateDraft({ id, status });
      toast.success(`Content moved to ${status === 'draft' ? 'drafts' : 'ready to publish'}`);
    } catch (error) {
      console.error("Error updating draft status:", error);
      toast.error("Failed to update status");
    }
  };
  
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

  // Handle delete request
  const handleDeleteRequest = (id: string) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };
  
  if (isLoading) {
    return <PublishedContentSkeleton />;
  }
  
  if (filteredDrafts.length === 0) {
    return <EmptyPublishedState />;
  }
  
  return (
    <>
      {/* Sorting dropdown */}
      <div className="flex justify-end mb-6">
        <Select
          value={sortOrder}
          onValueChange={(value) => setSortOrder(value as 'newest' | 'oldest')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content list */}
      <div className="space-y-4">
        {sortedDrafts.map((draft) => (
          <DraftContentCard
            key={draft.id}
            id={draft.id}
            title={draft.ideaTitle}
            content={draft.content}
            contentType={draft.contentType}
            status={draft.status}
            createdAt={draft.createdAt}
            onStatusChange={handleStatusChange}
            onArchive={handleArchive}
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>
      
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={() => itemToDelete && handleDelete(itemToDelete)}
      />
    </>
  );
};
