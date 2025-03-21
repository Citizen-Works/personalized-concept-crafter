
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquareShare } from 'lucide-react';
import { useCallToActions } from '@/hooks/useCallToActions';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CallToActionCard } from '@/components/CallToAction/CallToActionCard';
import { EmptyCallToActionsState } from '@/components/CallToAction/EmptyCallToActionsState';
import { AddCallToActionDialog } from '@/components/CallToAction/AddCallToActionDialog';

const CallToActionsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { 
    callToActions, 
    isLoading, 
    isError, 
    refetch, 
    deleteCallToAction
  } = useCallToActions();

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
  };

  const handleCallToActionAdded = () => {
    refetch();
    setDialogOpen(false);
  };

  const handleDeleteCallToAction = (id: string) => {
    deleteCallToAction.mutate(id);
  };

  // Filter CTAs based on active tab and archived status
  const filteredCallToActions = callToActions.filter(cta => {
    if (activeTab === "all") return !cta.isArchived;
    if (activeTab === "archived") return cta.isArchived;
    return cta.type === activeTab && !cta.isArchived;
  });

  // Get unique CTA types for tabs
  const ctaTypes = [...new Set(callToActions.filter(cta => !cta.isArchived).map(cta => cta.type))];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Call To Actions</h1>
        <p className="text-muted-foreground">
          Create and manage effective calls to action for your content
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleOpenDialog} className="gap-1">
          <Plus className="h-4 w-4" />
          Add Call To Action
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            All
          </TabsTrigger>
          {ctaTypes.map(type => (
            <TabsTrigger key={type} value={type}>
              {type}
            </TabsTrigger>
          ))}
          <TabsTrigger value="archived">
            Archived
          </TabsTrigger>
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
              <p>Failed to load call to actions. Please try again.</p>
              <Button variant="outline" onClick={() => refetch()} className="mt-4">
                Retry
              </Button>
            </div>
          ) : filteredCallToActions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCallToActions.map((cta) => (
                <CallToActionCard
                  key={cta.id}
                  callToAction={cta}
                  onEdit={() => refetch()}
                  onDelete={() => handleDeleteCallToAction(cta.id)}
                  onArchive={() => refetch()}
                />
              ))}
              {!isLoading && activeTab !== "archived" && (
                <EmptyCallToActionsState onClick={handleOpenDialog} />
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <EmptyCallToActionsState onClick={handleOpenDialog} />
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Render dialog conditionally based on dialogOpen state */}
      {dialogOpen && (
        <AddCallToActionDialog 
          onCallToActionAdded={handleCallToActionAdded} 
        />
      )}
    </div>
  );
};

export default CallToActionsPage;
