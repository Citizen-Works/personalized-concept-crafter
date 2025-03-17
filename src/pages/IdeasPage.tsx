
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
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
import { ArrowRight, ChevronDown, Edit, Filter, Lightbulb, MoreHorizontal, Plus, Trash } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ContentIdea, ContentStatus, ContentType } from '@/types';
import { useIdeas } from '@/hooks/useIdeas';
import { toast } from 'sonner';

const IdeasPage = () => {
  const { ideas, isLoading, isError, deleteIdea } = useIdeas();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');
  
  // Filter ideas based on search query and filters
  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch = (idea.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (idea.description && idea.description.toLowerCase().includes(searchQuery.toLowerCase()))) || false;
    const matchesStatus = statusFilter === 'all' || idea.status === statusFilter;
    const matchesType = typeFilter === 'all' || idea.contentType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  const getStatusBadgeClasses = (status: ContentStatus) => {
    switch (status) {
      case 'unreviewed':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'drafted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ready':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'published':
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };
  
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

  const handleDeleteIdea = (id: string) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      deleteIdea(id);
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Content Ideas</h1>
          <p className="text-muted-foreground">
            Browse and manage your content ideas
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Content Ideas</h1>
          <p className="text-muted-foreground">
            Browse and manage your content ideas
          </p>
        </div>
        <p className="text-muted-foreground">
          There was an error loading your ideas. Please try again.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Content Ideas</h1>
        <p className="text-muted-foreground">
          Browse and manage your content ideas
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-end justify-between">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search ideas..."
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
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('unreviewed')}>
                  Unreviewed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('approved')}>
                  Approved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('drafted')}>
                  Drafted
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('ready')}>
                  Ready
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('published')}>
                  Published
                </DropdownMenuItem>
                
                <DropdownMenuLabel className="mt-2">Filter by Type</DropdownMenuLabel>
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
          
          <Button asChild className="ml-auto">
            <Link to="/ideas/new" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              New Idea
            </Link>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all" className="relative">
            All
            <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
              {filteredIdeas.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="unreviewed" className="relative">
            Unreviewed
            <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
              {filteredIdeas.filter(idea => idea.status === 'unreviewed').length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="approved" className="relative">
            Approved
            <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
              {filteredIdeas.filter(idea => idea.status === 'approved').length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="drafted" className="relative">
            Drafted
            <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
              {filteredIdeas.filter(idea => idea.status === 'drafted').length}
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="space-y-4">
            {filteredIdeas.length > 0 ? (
              filteredIdeas.map((idea) => (
                <Card key={idea.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{idea.title}</h3>
                          <Badge 
                            className={`${getStatusBadgeClasses(idea.status)}`}
                          >
                            {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                          </Badge>
                          <Badge 
                            className={`${getTypeBadgeClasses(idea.contentType)}`}
                          >
                            {idea.contentType.charAt(0).toUpperCase() + idea.contentType.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{idea.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Created {new Date(idea.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-auto">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/ideas/${idea.id}`}>
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
                            <DropdownMenuItem asChild>
                              <Link to={`/ideas/${idea.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteIdea(idea.id)}>
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
                <Lightbulb className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No content ideas found</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                    ? "Try adjusting your filters or search terms"
                    : "Create your first content idea to get started"}
                </p>
                <Button asChild>
                  <Link to="/ideas/new" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    New Idea
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        {['unreviewed', 'approved', 'drafted'].map((status) => (
          <TabsContent key={status} value={status} className="mt-0">
            <div className="space-y-4">
              {filteredIdeas.filter(idea => idea.status === status).length > 0 ? (
                filteredIdeas
                  .filter(idea => idea.status === status)
                  .map((idea) => (
                    <Card key={idea.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{idea.title}</h3>
                              <Badge 
                                className={`${getTypeBadgeClasses(idea.contentType)}`}
                              >
                                {idea.contentType.charAt(0).toUpperCase() + idea.contentType.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{idea.description}</p>
                            <p className="text-xs text-muted-foreground">
                              Created {new Date(idea.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-auto">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/ideas/${idea.id}`}>
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
                                <DropdownMenuItem asChild>
                                  <Link to={`/ideas/${idea.id}/edit`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteIdea(idea.id)}>
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
                  <Lightbulb className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">No {status} ideas found</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    {searchQuery || typeFilter !== 'all'
                      ? "Try adjusting your filters or search terms"
                      : `Create a new idea and mark it as ${status}`}
                  </p>
                  <Button asChild>
                    <Link to="/ideas/new" className="flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      New Idea
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default IdeasPage;
