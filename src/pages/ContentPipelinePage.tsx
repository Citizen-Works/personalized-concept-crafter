
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

const ContentPipelinePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("ideas");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);
  const [contentTypeFilter, setContentTypeFilter] = useState<ContentType | "all">("all");
  
  // Use useEffect with cleaner dependency handling
  useEffect(() => {
    const storedTab = localStorage.getItem("contentPipelineActiveTab");
    
    // Check URL for tab parameter first, then fallback to localStorage
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get("tab");
    
    if (tabParam) {
      setActiveTab(tabParam);
    } else if (storedTab) {
      setActiveTab(storedTab);
      
      // Also update URL to match the stored tab
      const currentParams = new URLSearchParams(location.search);
      currentParams.set("tab", storedTab);
      navigate(`${location.pathname}?${currentParams.toString()}`, { replace: true });
    }
  }, [location.search, navigate]);
  
  // Separate effect for saving to localStorage to avoid render cycles
  useEffect(() => {
    localStorage.setItem("contentPipelineActiveTab", activeTab);
    
    // Update URL params without full navigation
    const currentParams = new URLSearchParams(location.search);
    currentParams.set("tab", activeTab);
    navigate(`${location.pathname}?${currentParams.toString()}`, { replace: true });
  }, [activeTab, navigate]);
  
  // Memoize the filter props to prevent unnecessary re-renders
  const filterProps = useMemo(() => ({
    searchQuery,
    dateRange,
    contentTypeFilter
  }), [searchQuery, dateRange, contentTypeFilter]);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
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
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="review">Review Queue</TabsTrigger>
          <TabsTrigger value="ideas">Ideas</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="ready">Ready to Publish</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
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
