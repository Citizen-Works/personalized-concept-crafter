
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, ChevronDown, Edit, FileText, Filter, MoreHorizontal, Trash } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ContentDraft, ContentType } from '@/types';

const DraftsPage = () => {
  // Mock data for content drafts
  const mockDrafts: (ContentDraft & { 
    ideaTitle: string; 
    contentType: ContentType 
  })[] = [
    {
      id: "1",
      contentIdeaId: "1",
      ideaTitle: "How to leverage AI for business growth",
      content: "In today's rapidly evolving business landscape, AI isn't just a buzzword—it's a transformative force...",
      version: 1,
      feedback: "",
      contentType: "linkedin",
      createdAt: new Date("2023-06-16")
    },
    {
      id: "2",
      contentIdeaId: "1",
      ideaTitle: "How to leverage AI for business growth",
      content: "Artificial Intelligence is revolutionizing how businesses operate across every industry...",
      version: 2,
      feedback: "Make it more concise and add specific examples",
      contentType: "linkedin",
      createdAt: new Date("2023-06-17")
    },
    {
      id: "3",
      contentIdeaId: "2",
      ideaTitle: "5 steps to improve customer retention",
      content: "Customer retention is the cornerstone of sustainable business growth...",
      version: 1,
      feedback: "",
      contentType: "newsletter",
      createdAt: new Date("2023-06-14")
    },
    {
      id: "4",
      contentIdeaId: "4",
      ideaTitle: "The future of remote work",
      content: "Remote work has fundamentally changed how we think about productivity and collaboration...",
      version: 1,
      feedback: "",
      contentType: "linkedin",
      createdAt: new Date("2023-06-09")
    },
    {
      id: "5",
      contentIdeaId: "4",
      ideaTitle: "The future of remote work",
      content: "The traditional office paradigm has been permanently disrupted by remote work...",
      version: 2,
      feedback: "Focus more on hybrid models and less on fully remote",
      contentType: "linkedin",
      createdAt: new Date("2023-06-10")
    },
  ];
  
  const [drafts, setDrafts] = useState(mockDrafts);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');
  
  // Filter drafts based on search query and filters
  const filteredDrafts = drafts.filter((draft) => {
    const matchesSearch = draft.ideaTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           draft.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || draft.contentType === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  const getTypeBadgeClasses = (type: ContentType) => {
    switch (type) {
      case 'linkedin':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'newsletter':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'marketing':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Content Drafts</h1>
        <p className="text-muted-foreground">
          Review and manage your AI-generated content drafts
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-end justify-between">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search drafts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTypeFilter('all')}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('linkedin')}>
                  LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('newsletter')}>
                  Newsletter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('marketing')}>
                  Marketing
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Select onValueChange={(val) => setTypeFilter(val as ContentType | 'all')} value={typeFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Content Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredDrafts.length > 0 ? (
          filteredDrafts.map((draft) => (
            <Card key={draft.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium">{draft.ideaTitle}</h3>
                      <Badge 
                        className={`${getTypeBadgeClasses(draft.contentType)}`}
                      >
                        {draft.contentType.charAt(0).toUpperCase() + draft.contentType.slice(1)}
                      </Badge>
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                        Version {draft.version}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{draft.content}</p>
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(draft.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-auto">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/drafts/${draft.id}`}>
                        View Details
                      </Link>
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash className="h-4 w-4 mr-2 text-destructive" />
                          <span className="text-destructive">Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10">
            <FileText className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">No content drafts found</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              {searchQuery || typeFilter !== 'all'
                ? "Try adjusting your filters or search terms"
                : "Generate drafts from your content ideas to get started"}
            </p>
            <Button asChild>
              <Link to="/ideas">
                Go to Content Ideas
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftsPage;
