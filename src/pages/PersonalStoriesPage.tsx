import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, ArrowUpDown, Tag, FileEdit, Archive, RotateCcw, Clock, Hash } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { usePersonalStories } from "@/hooks/usePersonalStories";
import { PersonalStoryList } from "@/components/personal-stories/PersonalStoryList";
import { PersonalStoryEmptyState } from "@/components/personal-stories/PersonalStoryEmptyState";
import { CreateStoryDialog } from "@/components/personal-stories/CreateStoryDialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PersonalStory } from "@/types";

const PersonalStoriesPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [activeTab, setActiveTab] = useState("all");
  
  const { 
    stories, 
    isLoading, 
    tags, 
    createStory, 
    updateStory, 
    archiveStory, 
    restoreStory 
  } = usePersonalStories();

  const filteredStories = React.useMemo(() => {
    if (!stories) return [];

    let filtered = activeTab === "all" 
      ? stories.filter(story => !story.isArchived)
      : stories.filter(story => story.isArchived);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(story => 
        story.title.toLowerCase().includes(query) || 
        story.content.toLowerCase().includes(query)
      );
    }
    
    if (selectedTag) {
      filtered = filtered.filter(story => 
        story.tags.includes(selectedTag)
      );
    }
    
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "most-used":
          return b.usageCount - a.usageCount;
        case "least-used":
          return a.usageCount - b.usageCount;
        case "recently-used":
          if (!a.lastUsedDate) return 1;
          if (!b.lastUsedDate) return -1;
          return new Date(b.lastUsedDate).getTime() - new Date(a.lastUsedDate).getTime();
        default:
          return 0;
      }
    });
  }, [stories, searchQuery, selectedTag, sortBy, activeTab]);

  const topTags = React.useMemo(() => {
    const tagCounts = tags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  }, [tags]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Personal Stories</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasStories = stories && stories.filter(s => !s.isArchived).length > 0;
  const hasArchivedStories = stories && stories.filter(s => s.isArchived).length > 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Personal Stories</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Story
        </Button>
      </div>
      
      {hasStories || hasArchivedStories ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Your Stories Library</CardTitle>
              <CardDescription>
                Store and organize personal anecdotes for use in your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search stories..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <div className="flex items-center">
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Sort by" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="alphabetical">Alphabetical</SelectItem>
                      <SelectItem value="most-used">Most Used</SelectItem>
                      <SelectItem value="least-used">Least Used</SelectItem>
                      <SelectItem value="recently-used">Recently Used</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={selectedTag || ""} 
                    onValueChange={(value) => setSelectedTag(value || null)}
                  >
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Tag className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filter by tag" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Tags</SelectItem>
                      {topTags.map(tag => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedTag && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Filtered by:</span>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      {selectedTag}
                      <button 
                        className="ml-1 h-3 w-3 rounded-full"
                        onClick={() => setSelectedTag(null)}
                      >
                        ×
                      </button>
                    </Badge>
                  </div>
                )}
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="all">Active Stories</TabsTrigger>
                    {hasArchivedStories && (
                      <TabsTrigger value="archived">Archived</TabsTrigger>
                    )}
                  </TabsList>
                  
                  <TabsContent value="all">
                    {filteredStories.length > 0 ? (
                      <PersonalStoryList 
                        stories={filteredStories}
                        onEdit={updateStory}
                        onArchive={archiveStory}
                      />
                    ) : (
                      <div className="text-center p-8 border rounded-md bg-muted/10">
                        <p className="text-muted-foreground">
                          {searchQuery || selectedTag 
                            ? "No stories match your search or filter criteria" 
                            : "You haven't added any stories yet"}
                        </p>
                        {(searchQuery || selectedTag) && (
                          <Button 
                            variant="link" 
                            onClick={() => {
                              setSearchQuery("");
                              setSelectedTag(null);
                            }}
                          >
                            Clear filters
                          </Button>
                        )}
                      </div>
                    )}
                  </TabsContent>
                  
                  {hasArchivedStories && (
                    <TabsContent value="archived">
                      {filteredStories.length > 0 ? (
                        <PersonalStoryList 
                          stories={filteredStories}
                          onEdit={updateStory}
                          onRestore={restoreStory}
                          isArchiveView
                        />
                      ) : (
                        <div className="text-center p-8 border rounded-md bg-muted/10">
                          <p className="text-muted-foreground">
                            {searchQuery || selectedTag 
                              ? "No archived stories match your search or filter criteria" 
                              : "You don't have any archived stories"}
                          </p>
                          {(searchQuery || selectedTag) && (
                            <Button 
                              variant="link" 
                              onClick={() => {
                                setSearchQuery("");
                                setSelectedTag(null);
                              }}
                            >
                              Clear filters
                            </Button>
                          )}
                        </div>
                      )}
                    </TabsContent>
                  )}
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <PersonalStoryEmptyState onCreateStory={() => setIsCreateDialogOpen(true)} />
      )}
      
      <CreateStoryDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onSave={createStory}
      />
    </div>
  );
};

export default PersonalStoriesPage;
