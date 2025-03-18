
import React, { useState } from 'react';
import { DraftsHeader } from '@/components/drafts/DraftsHeader';
import { DraftsFilters } from '@/components/drafts/DraftsFilters';
import { DraftList } from '@/components/drafts/DraftList';
import { DraftsEmptyState } from '@/components/drafts/DraftsEmptyState';
import { BulkActions } from '@/components/drafts/BulkActions';
import { ContentType, DraftStatus } from '@/types';
import { useDrafts } from '@/hooks/useDrafts';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const DraftsPage = () => {
  const { drafts, isLoading, isError, deleteDraft, updateDraft } = useDrafts();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');
  const [selectedDrafts, setSelectedDrafts] = useState<string[]>([]);
  
  // Filter drafts based on search query and filters
  const filteredDrafts = drafts.filter((draft) => {
    const matchesSearch = draft.ideaTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           draft.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || draft.contentType === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const hasFilters = searchQuery !== '' || typeFilter !== 'all';
  
  // Selection handling
  const toggleSelectAll = () => {
    if (selectedDrafts.length === filteredDrafts.length) {
      setSelectedDrafts([]);
    } else {
      setSelectedDrafts(filteredDrafts.map(draft => draft.id));
    }
  };

  const toggleSelectDraft = (draftId: string) => {
    setSelectedDrafts(prev => 
      prev.includes(draftId) 
        ? prev.filter(id => id !== draftId)
        : [...prev, draftId]
    );
  };
  
  // Bulk actions
  const handleBulkDelete = async () => {
    if (selectedDrafts.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedDrafts.length} drafts?`)) {
      try {
        // Delete each selected draft
        for (const draftId of selectedDrafts) {
          await deleteDraft(draftId);
        }
        
        toast.success(`${selectedDrafts.length} drafts deleted successfully`);
        setSelectedDrafts([]);
      } catch (error) {
        console.error('Error deleting drafts:', error);
        toast.error('Failed to delete drafts');
      }
    }
  };
  
  const handleBulkStatusChange = async (status: DraftStatus) => {
    if (selectedDrafts.length === 0) return;
    
    try {
      // Update status for each selected draft
      for (const draftId of selectedDrafts) {
        await updateDraft({ id: draftId, status });
      }
      
      toast.success(`${selectedDrafts.length} drafts updated to ${status}`);
      setSelectedDrafts([]);
    } catch (error) {
      console.error('Error updating drafts:', error);
      toast.error('Failed to update drafts');
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <DraftsHeader />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 w-full">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex items-center gap-2 mt-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-8">
        <DraftsHeader />
        <div className="p-6 border rounded-lg bg-destructive/10 text-destructive">
          <p className="font-medium">Error loading drafts</p>
          <p className="text-sm mt-1">
            There was an error loading your drafts. Please try again or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <DraftsHeader />
      
      <DraftsFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />
      
      {selectedDrafts.length > 0 && (
        <BulkActions 
          selectedCount={selectedDrafts.length}
          onDelete={handleBulkDelete}
          onStatusChange={handleBulkStatusChange}
        />
      )}
      
      {filteredDrafts.length > 0 ? (
        <DraftList 
          drafts={filteredDrafts}
          selectedDrafts={selectedDrafts}
          onToggleSelect={toggleSelectDraft}
          onToggleSelectAll={toggleSelectAll}
          onDelete={deleteDraft}
        />
      ) : (
        <DraftsEmptyState hasFilters={hasFilters} />
      )}
    </div>
  );
};

export default DraftsPage;
