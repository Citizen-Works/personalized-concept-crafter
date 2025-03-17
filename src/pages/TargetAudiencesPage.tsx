
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from 'lucide-react';
import { AddTargetAudienceDialog } from '@/components/TargetAudience/AddTargetAudienceDialog';
import { TargetAudienceCard } from '@/components/TargetAudience/TargetAudienceCard';
import { EmptyTargetAudiencesState } from '@/components/TargetAudience/EmptyTargetAudiencesState';
import { useTargetAudiences } from '@/hooks/useTargetAudiences';
import { Skeleton } from '@/components/ui/skeleton';

const TargetAudiencesPage = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { 
    targetAudiences, 
    isLoading, 
    isError, 
    refetch, 
    deleteTargetAudience
  } = useTargetAudiences();

  const handleAdd = () => {
    setShowAddDialog(true);
  };

  const handleAudienceAdded = () => {
    refetch();
  };

  const handleDeleteAudience = (id: string) => {
    deleteTargetAudience.mutate(id);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Target Audiences</h1>
        <p className="text-muted-foreground">
          Define and manage your ideal customer profiles
        </p>
      </div>

      <div className="flex justify-end">
        <AddTargetAudienceDialog onAudienceAdded={handleAudienceAdded} />
      </div>
      
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-[240px]">
              <div className="p-6 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center p-8 text-destructive">
          <p>Failed to load target audiences. Please try again.</p>
          <Button variant="outline" onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      ) : targetAudiences.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {targetAudiences.map((audience) => (
            <TargetAudienceCard
              key={audience.id}
              audience={audience}
              onEdit={handleAudienceAdded}
              onDelete={() => handleDeleteAudience(audience.id)}
            />
          ))}
          <EmptyTargetAudiencesState onClick={handleAdd} />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <EmptyTargetAudiencesState onClick={handleAdd} />
        </div>
      )}
    </div>
  );
};

export default TargetAudiencesPage;
