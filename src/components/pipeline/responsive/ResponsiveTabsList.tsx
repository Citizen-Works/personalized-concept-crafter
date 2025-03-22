
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';
import { Check, FileText, Pencil, Send, Book } from 'lucide-react';

interface ResponsiveTabsListProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

/**
 * A responsive tabs list component that adapts to different screen sizes.
 * On mobile, shows more compact tabs with icons and organizes them appropriately.
 * On desktop, shows the full tab names with more space.
 */
export const ResponsiveTabsList: React.FC<ResponsiveTabsListProps> = ({
  activeTab,
  onTabChange
}) => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    // Mobile layout with icons and compact display
    return (
      <div className="space-y-2">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="review" onClick={() => onTabChange('review')}>
            <div className="flex flex-col items-center">
              <Check className="h-4 w-4 mb-1" />
              <span className="text-xs">Review</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="ideas" onClick={() => onTabChange('ideas')}>
            <div className="flex flex-col items-center">
              <FileText className="h-4 w-4 mb-1" />
              <span className="text-xs">Ideas</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="drafts" onClick={() => onTabChange('drafts')}>
            <div className="flex flex-col items-center">
              <Pencil className="h-4 w-4 mb-1" />
              <span className="text-xs">Drafts</span>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="ready" onClick={() => onTabChange('ready')}>
            <div className="flex flex-col items-center">
              <Send className="h-4 w-4 mb-1" />
              <span className="text-xs">Ready</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="published" onClick={() => onTabChange('published')}>
            <div className="flex flex-col items-center">
              <Book className="h-4 w-4 mb-1" />
              <span className="text-xs">Published</span>
            </div>
          </TabsTrigger>
        </TabsList>
      </div>
    );
  }
  
  // Desktop layout with text-only tabs in a single row
  return (
    <TabsList className="grid grid-cols-5">
      <TabsTrigger value="review" onClick={() => onTabChange('review')}>Review</TabsTrigger>
      <TabsTrigger value="ideas" onClick={() => onTabChange('ideas')}>Ideas</TabsTrigger>
      <TabsTrigger value="drafts" onClick={() => onTabChange('drafts')}>Drafts</TabsTrigger>
      <TabsTrigger value="ready" onClick={() => onTabChange('ready')}>Ready to Publish</TabsTrigger>
      <TabsTrigger value="published" onClick={() => onTabChange('published')}>Published</TabsTrigger>
    </TabsList>
  );
};
