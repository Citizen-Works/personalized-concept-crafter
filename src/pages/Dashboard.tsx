
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Lightbulb, Zap } from 'lucide-react';
import { useIdeas } from '@/hooks/ideas';

const Dashboard = () => {
  // Fetch real data using the useIdeas hook
  const { ideas, isLoading } = useIdeas();
  
  // Filter ideas by status to get counts
  const contentIdeasCount = ideas.length;
  const contentDraftsCount = ideas.filter(idea => idea.status === 'drafted').length;
  const publishedContentCount = ideas.filter(idea => idea.status === 'published').length;

  // Get most recent ideas (up to 3)
  const recentIdeas = ideas.slice(0, 3).map(idea => ({
    id: idea.id, 
    title: idea.title, 
    status: idea.status, 
    date: new Date(idea.createdAt).toLocaleDateString()
  }));

  // Get recent drafted ideas (up to 2)
  const recentDrafts = ideas
    .filter(idea => idea.status === 'drafted')
    .slice(0, 2)
    .map(idea => ({
      id: idea.id, 
      title: idea.title, 
      version: 1, // We don't have version info in the data model yet
      date: new Date(idea.createdAt).toLocaleDateString()
    }));
  
  // Stats data from real counts
  const stats = [
    { title: "Content Ideas", value: contentIdeasCount, icon: Lightbulb },
    { title: "Content Drafts", value: contentDraftsCount, icon: FileText },
    { title: "Published Content", value: publishedContentCount, icon: Zap },
  ];
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">
          Here's an overview of your content creation activities
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardContent className="p-6 flex items-center">
              <div className="bg-primary/10 p-4 rounded-full mr-4">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-3xl font-bold">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Ideas</CardTitle>
              <CardDescription>Your latest content ideas</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Link to="/ideas" className="flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : recentIdeas.length > 0 ? (
              <div className="space-y-4">
                {recentIdeas.map((idea) => (
                  <div key={idea.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-medium">{idea.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{idea.date}</span>
                        <div className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          idea.status === 'approved' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : idea.status === 'drafted' 
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                          {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Link to={`/ideas/${idea.id}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-muted-foreground mb-4">No content ideas yet</p>
                <Button asChild size="sm">
                  <Link to="/ideas/new">Create your first idea</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Drafts</CardTitle>
              <CardDescription>Your latest content drafts</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Link to="/drafts" className="flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : recentDrafts.length > 0 ? (
              <div className="space-y-4">
                {recentDrafts.map((draft) => (
                  <div key={draft.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-medium">{draft.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{draft.date}</span>
                        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                          Version {draft.version}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Link to={`/drafts/${draft.id}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-muted-foreground mb-4">No drafts created yet</p>
                <Button asChild size="sm" variant="outline">
                  <Link to="/ideas">Browse ideas to draft</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button className="w-full justify-start">
              <Link to="/ideas/new" className="flex items-center gap-2 text-white w-full">
                <Lightbulb className="h-4 w-4" />
                Create New Content Idea
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Link to="/drafts" className="flex items-center gap-2 w-full">
                <FileText className="h-4 w-4" />
                Manage Drafts
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
