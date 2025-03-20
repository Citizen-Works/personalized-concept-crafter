
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, ArrowLeft } from 'lucide-react';
import { AddTargetAudienceDialog } from '@/components/TargetAudience/AddTargetAudienceDialog';
import { TargetAudienceCard } from '@/components/TargetAudience/TargetAudienceCard';
import { EmptyTargetAudiencesState } from '@/components/TargetAudience/EmptyTargetAudiencesState';
import { useTargetAudiences } from '@/hooks/useTargetAudiences';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from 'react-router-dom';

const TargetAudiencesPage = () => {
  const [activeTab, setActiveTab] = useState<string>("active");
  const { 
    targetAudiences, 
    isLoading, 
    isError, 
    refetch, 
    deleteTargetAudience,
    updateTargetAudience
  } = useTargetAudiences();

  const handleAdd = () => {
    // Handled by component
  };

  const handleAudienceAdded = () => {
    refetch();
  };

  const handleDeleteAudience = (id: string) => {
    deleteTargetAudience.mutate(id);
  };

  const handleArchiveToggle = (id: string, isCurrentlyArchived: boolean) => {
    updateTargetAudience.mutate({
      id,
      isArchived: !isCurrentlyArchived
    });
  };

  // Filter audiences based on active tab
  const filteredAudiences = targetAudiences.filter(audience => {
    if (activeTab === "active") return !audience.isArchived;
    if (activeTab === "archived") return audience.isArchived;
    return true; // "all" tab
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Target Audiences</h1>
          <p className="text-muted-foreground">
            Define and manage your ideal customer profiles
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/strategy" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Strategy
          </Link>
        </Button>
      </div>

      <div className="flex justify-end">
        <AddTargetAudienceDialog onAudienceAdded={handleAudienceAdded} />
      </div>
      
      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
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
          ) : filteredAudiences.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAudiences.map((audience) => (
                <TargetAudienceCard
                  key={audience.id}
                  audience={audience}
                  onEdit={handleAudienceAdded}
                  onDelete={() => handleDeleteAudience(audience.id)}
                  onArchiveToggle={() => handleArchiveToggle(audience.id, !!audience.isArchived)}
                  isArchived={!!audience.isArchived}
                />
              ))}
              {activeTab !== "archived" && (
                <EmptyTargetAudiencesState onClick={handleAdd} />
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <EmptyTargetAudiencesState onClick={handleAdd} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TargetAudiencesPage;
