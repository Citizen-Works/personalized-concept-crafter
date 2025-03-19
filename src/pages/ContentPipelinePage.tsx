
import React, { useState, useEffect } from 'react';
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
  
  // Load the last active tab from localStorage on component mount
  useEffect(() => {
    const storedTab = localStorage.getItem("contentPipelineActiveTab");
    if (storedTab) {
      setActiveTab(storedTab);
    }
    
    // Also check URL for tab parameter
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location]);
  
  // Save active tab to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("contentPipelineActiveTab", activeTab);
    
    // Update URL params without full navigation
    const currentParams = new URLSearchParams(location.search);
    currentParams.set("tab", activeTab);
    navigate(`${location.pathname}?${currentParams.toString()}`, { replace: true });
  }, [activeTab, navigate, location]);
  
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
          <ReviewQueueTab 
            searchQuery={searchQuery}
            dateRange={dateRange}
            contentTypeFilter={contentTypeFilter}
          />
        </TabsContent>
        
        <TabsContent value="ideas" className="mt-6">
          <IdeasTab 
            searchQuery={searchQuery}
            dateRange={dateRange}
            contentTypeFilter={contentTypeFilter}
          />
        </TabsContent>
        
        <TabsContent value="drafts" className="mt-6">
          <DraftsTab 
            searchQuery={searchQuery}
            dateRange={dateRange}
            contentTypeFilter={contentTypeFilter}
          />
        </TabsContent>
        
        <TabsContent value="ready" className="mt-6">
          <ReadyToPublishTab 
            searchQuery={searchQuery}
            dateRange={dateRange}
            contentTypeFilter={contentTypeFilter}
          />
        </TabsContent>
        
        <TabsContent value="published" className="mt-6">
          <PublishedTab 
            searchQuery={searchQuery}
            dateRange={dateRange}
            contentTypeFilter={contentTypeFilter}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentPipelinePage;
