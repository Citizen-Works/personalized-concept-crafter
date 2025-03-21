
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ReviewQueueTab } from "@/components/pipeline/ReviewQueueTab";
import { IdeasTab } from "@/components/pipeline/IdeasTab";
import { DraftsTab } from "@/components/pipeline/DraftsTab";
import { ReadyToPublishTab } from "@/components/pipeline/ReadyToPublishTab";
import { PublishedTab } from "@/components/pipeline/PublishedTab";
import { ContentFilterBar } from "@/components/pipeline/ContentFilterBar";
import { ContentType } from "@/types";
import { useIsMobile } from '@/hooks/use-mobile';

const ContentPipelinePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("ideas");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);
  const [contentTypeFilter, setContentTypeFilter] = useState<ContentType | "all">("all");
  
  // Use useEffect with cleaner dependency handling
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get("tab");
    
    if (tabParam) {
      // This prevents unwanted state changes if we're already on the correct tab
      if (tabParam !== activeTab) {
        setActiveTab(tabParam);
      }
    } else {
      // If no tab in URL, set from localStorage or default to "ideas"
      const storedTab = localStorage.getItem("contentPipelineActiveTab");
      const tabToSet = storedTab || "ideas";
      
      if (tabToSet !== activeTab) {
        setActiveTab(tabToSet);
        
        // Update URL to match the tab without triggering navigation
        const currentParams = new URLSearchParams(location.search);
        currentParams.set("tab", tabToSet);
        navigate(`${location.pathname}?${currentParams.toString()}`, { replace: true });
      }
    }
  }, [location.search, navigate, activeTab]);
  
  // Separate effect for saving to localStorage when tab changes
  useEffect(() => {
    localStorage.setItem("contentPipelineActiveTab", activeTab);
    
    // Update URL params without full navigation
    const currentParams = new URLSearchParams(location.search);
    if (currentParams.get("tab") !== activeTab) {
      currentParams.set("tab", activeTab);
      navigate(`${location.pathname}?${currentParams.toString()}`, { replace: true });
    }
  }, [activeTab, navigate]);
  
  // Memoize the filter props to prevent unnecessary re-renders
  const filterProps = useMemo(() => ({
    searchQuery,
    dateRange,
    contentTypeFilter
  }), [searchQuery, dateRange, contentTypeFilter]);
  
  // Handle tab change with debounce to prevent rapid state changes
  const handleTabChange = (value: string) => {
    if (value !== activeTab) {
      setActiveTab(value);
    }
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setDateRange([undefined, undefined]);
    setContentTypeFilter("all");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Content Pipeline</h1>
        <p className="text-muted-foreground">
          Manage your content through its entire lifecycle
        </p>
      </div>
      
      <ContentFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dateRange={dateRange}
        setDateRange={setDateRange}
        contentTypeFilter={contentTypeFilter}
        setContentTypeFilter={setContentTypeFilter}
        onResetFilters={handleResetFilters}
      />
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className={`${isMobile ? 'grid-cols-3 mb-2' : 'grid-cols-5'} grid`}>
          <TabsTrigger value="review">Review</TabsTrigger>
          <TabsTrigger value="ideas">Ideas</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          {isMobile ? (
            <TabsList className="grid grid-cols-2 mt-2">
              <TabsTrigger value="ready">Ready</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
            </TabsList>
          ) : (
            <>
              <TabsTrigger value="ready">Ready to Publish</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
            </>
          )}
        </TabsList>
        
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
      </Tabs>
    </div>
  );
};

export default ContentPipelinePage;
