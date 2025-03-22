
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ContentType } from '@/types';

interface ContentPipelineFilters {
  searchQuery: string;
  dateRange: [Date | undefined, Date | undefined];
  contentTypeFilter: ContentType | "all";
}

export function useContentPipeline() {
  const navigate = useNavigate();
  const location = useLocation();
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
  
  // Reset filters
  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setDateRange([undefined, undefined]);
    setContentTypeFilter("all");
  }, []);
  
  // Filter props
  const filterProps: ContentPipelineFilters = {
    searchQuery,
    dateRange,
    contentTypeFilter
  };
  
  return {
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
  };
}
