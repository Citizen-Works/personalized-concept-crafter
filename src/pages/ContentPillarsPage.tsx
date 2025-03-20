
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddContentPillarDialog } from '@/components/ContentPillar/AddContentPillarDialog';
import { ContentPillarCard } from '@/components/ContentPillar/ContentPillarCard';
import { EmptyContentPillarsState } from '@/components/ContentPillar/EmptyContentPillarsState';
import { useContentPillars } from '@/hooks/useContentPillars';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContentPillarsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("active");
  const { 
    contentPillars, 
    isLoading, 
    isError, 
    refetch, 
    deleteContentPillar,
    updateContentPillar
  } = useContentPillars();

  const handleAdd = () => {
    // Open dialog handled by component
  };

  const handlePillarAdded = () => {
    refetch();
  };

  const handleDeletePillar = (id: string) => {
    deleteContentPillar.mutate(id);
  };

  const handleArchiveToggle = (id: string, isCurrentlyArchived: boolean) => {
    updateContentPillar.mutate({
      id,
      isArchived: !isCurrentlyArchived
    });
  };

  // Filter pillars based on active tab
  const filteredPillars = contentPillars.filter(pillar => {
    if (activeTab === "active") return !pillar.isArchived;
    if (activeTab === "archived") return pillar.isArchived;
    return true; // "all" tab
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Content Pillars</h1>
          <p className="text-muted-foreground">
            Manage the core topics and themes for your content strategy
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
        <AddContentPillarDialog onPillarAdded={handlePillarAdded} />
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
          ) : filteredPillars.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPillars.map((pillar) => (
                <ContentPillarCard
                  key={pillar.id}
                  pillar={pillar}
                  onEdit={handlePillarAdded}
                  onDelete={() => handleDeletePillar(pillar.id)}
                  onArchiveToggle={() => handleArchiveToggle(pillar.id, !!pillar.isArchived)}
                  isArchived={!!pillar.isArchived}
                />
              ))}
              {activeTab !== "archived" && (
                <EmptyContentPillarsState onClick={handleAdd} />
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <EmptyContentPillarsState onClick={handleAdd} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentPillarsPage;
