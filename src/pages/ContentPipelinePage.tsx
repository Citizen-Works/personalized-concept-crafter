
import React from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ReviewQueueTab } from "@/components/pipeline/ReviewQueueTab";
import { IdeasTab } from "@/components/pipeline/IdeasTab";
import { DraftsTab } from "@/components/pipeline/DraftsTab";
import { ReadyToPublishTab } from "@/components/pipeline/ReadyToPublishTab";
import { PublishedTab } from "@/components/pipeline/PublishedTab";
import { ContentFilterBar } from "@/components/pipeline/ContentFilterBar";
import { ResponsiveTabsList } from '@/components/pipeline/responsive/ResponsiveTabsList';
import { PageHeader } from '@/components/pipeline/page/PageHeader';
import { TabContentContainer } from '@/components/pipeline/page/TabContentContainer';
import { useContentPipeline } from '@/hooks/useContentPipeline';

const ContentPipelinePage = () => {
  const {
    activeTab,
    handleTabChange,
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    contentTypeFilter,
    setContentTypeFilter,
    handleResetFilters,
    filterProps
  } = useContentPipeline();
  
  if (!activeTab) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }
  
  return (
    <div className="space-y-6">
      <PageHeader />
      
      <ContentFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dateRange={dateRange}
        setDateRange={setDateRange}
        contentTypeFilter={contentTypeFilter}
        setContentTypeFilter={setContentTypeFilter}
        onResetFilters={handleResetFilters}
      />
      
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange} 
        className="w-full"
        defaultValue={activeTab}
      >
        <ResponsiveTabsList 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
        />
        
        <TabContentContainer>
          <TabsContent value="review" className="mt-6">
            <ReviewQueueTab {...filterProps} />
          </TabsContent>
          
          <TabsContent value="ideas" className="mt-6">
            <IdeasTab {...filterProps} />
          </TabsContent>
          
          <TabsContent value="drafts" className="mt-6">
            <DraftsTab {...filterProps} />
          </TabsContent>
          
          <TabsContent value="ready" className="mt-6">
            <ReadyToPublishTab {...filterProps} />
          </TabsContent>
          
          <TabsContent value="published" className="mt-6">
            <PublishedTab {...filterProps} />
          </TabsContent>
        </TabContentContainer>
      </Tabs>
    </div>
  );
};

export default ContentPipelinePage;
