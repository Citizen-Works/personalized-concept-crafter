
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { AddContentPillarDialog } from '@/components/ContentPillar/AddContentPillarDialog';
import { ContentPillarCard } from '@/components/ContentPillar/ContentPillarCard';
import { EmptyContentPillarsState } from '@/components/ContentPillar/EmptyContentPillarsState';
import { useContentPillars } from '@/hooks/useContentPillars';
import { Skeleton } from '@/components/ui/skeleton';

const ContentPillarsPage = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { 
    contentPillars, 
    isLoading, 
    isError, 
    refetch, 
    deleteContentPillar
  } = useContentPillars();

  const handleAdd = () => {
    setShowAddDialog(true);
  };

  const handlePillarAdded = () => {
    refetch();
  };

  const handleDeletePillar = (id: string) => {
    deleteContentPillar.mutate(id);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Content Pillars</h1>
        <p className="text-muted-foreground">
          Manage the core topics and themes for your content strategy
        </p>
      </div>

      <div className="flex justify-end">
        <AddContentPillarDialog onPillarAdded={handlePillarAdded} />
      </div>
      
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-[200px]">
              <div className="p-6 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-24 w-full" />
              </div>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center p-8 text-destructive">
          <p>Failed to load content pillars. Please try again.</p>
          <Button variant="outline" onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      ) : contentPillars.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contentPillars.map((pillar) => (
            <ContentPillarCard
              key={pillar.id}
              pillar={pillar}
              onEdit={handlePillarAdded}
              onDelete={() => handleDeletePillar(pillar.id)}
            />
          ))}
          <EmptyContentPillarsState onClick={handleAdd} />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <EmptyContentPillarsState onClick={handleAdd} />
        </div>
      )}
    </div>
  );
};

export default ContentPillarsPage;
