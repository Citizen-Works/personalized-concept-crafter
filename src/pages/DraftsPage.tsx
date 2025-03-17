
import React, { useState } from 'react';
import { DraftsHeader } from '@/components/drafts/DraftsHeader';
import { DraftsFilters } from '@/components/drafts/DraftsFilters';
import { DraftListItem } from '@/components/drafts/DraftListItem';
import { DraftsEmptyState } from '@/components/drafts/DraftsEmptyState';
import { ContentType } from '@/types';
import { useDrafts } from '@/hooks/useDrafts';
import { Skeleton } from '@/components/ui/skeleton';

const DraftsPage = () => {
  const { drafts, isLoading, isError, deleteDraft } = useDrafts();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');
  
  // Filter drafts based on search query and filters
  const filteredDrafts = drafts.filter((draft) => {
    const matchesSearch = draft.ideaTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           draft.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || draft.contentType === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const hasFilters = searchQuery !== '' || typeFilter !== 'all';
  
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
    <div className="space-y-8">
      <DraftsHeader />
      
      <DraftsFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />
      
      <div className="space-y-4">
        {filteredDrafts.length > 0 ? (
          filteredDrafts.map((draft) => (
            <DraftListItem 
              key={draft.id} 
              draft={draft} 
              onDelete={deleteDraft}
            />
          ))
        ) : (
          <DraftsEmptyState hasFilters={hasFilters} />
        )}
      </div>
    </div>
  );
};

export default DraftsPage;
