
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { ResponsiveTabsList } from '@/components/pipeline/responsive/ResponsiveTabsList';
import { ResponsiveText } from '@/components/ui/responsive-text';

const ContentPipelinePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);
  const [contentTypeFilter, setContentTypeFilter] = useState<ContentType | "all">("all");
  
  // Get tab from URL once on initial render and when URL changes
  const getTabFromUrl = useCallback(() => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get("tab") || "";
  }, [location.search]);
  
  // Initialize tab state from URL or localStorage
  useEffect(() => {
    const urlTab = getTabFromUrl();
    
    if (urlTab) {
      setActiveTab(urlTab);
    } else {
      // If no tab in URL, set from localStorage or default to "ideas"
      const storedTab = localStorage.getItem("contentPipelineActiveTab") || "ideas";
      setActiveTab(storedTab);
      
      // Update URL without triggering a navigation effect
      const newSearch = new URLSearchParams(location.search);
      newSearch.set("tab", storedTab);
      navigate(`${location.pathname}?${newSearch.toString()}`, { replace: true });
    }
  }, [location.pathname, getTabFromUrl, navigate]);
  
  // Update localStorage and URL when tab changes
  const handleTabChange = useCallback((value: string) => {
    if (value === activeTab) return; // Prevent unnecessary updates
    
    setActiveTab(value);
    localStorage.setItem("contentPipelineActiveTab", value);
    
    // Update URL params without triggering navigation events
    const newParams = new URLSearchParams(location.search);
    newParams.set("tab", value);
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  }, [activeTab, location.search, navigate]);
  
  // Memoize the filter props to prevent unnecessary re-renders
  const filterProps = useMemo(() => ({
    searchQuery,
    dateRange,
    contentTypeFilter
  }), [searchQuery, dateRange, contentTypeFilter]);
  
  // Reset filters
  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setDateRange([undefined, undefined]);
    setContentTypeFilter("all");
  }, []);
  
  if (!activeTab) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <ResponsiveText
          as="h1"
          mobileClasses="text-2xl font-bold tracking-tight"
          desktopClasses="text-3xl font-bold tracking-tight"
        >
          Content Pipeline
        </ResponsiveText>
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
