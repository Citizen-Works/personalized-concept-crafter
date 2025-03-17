
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit, Plus } from 'lucide-react';

const IdeaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock data for the idea
  const idea = {
    id: id,
    title: "How to leverage AI for business growth",
    description: "Explore practical ways businesses can implement AI solutions to drive growth and efficiency.",
    notes: "Focus on small to medium-sized businesses. Include case studies.",
    status: "approved" as const,
    contentType: "linkedin" as const,
    createdAt: new Date("2023-06-15")
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/ideas">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Ideas</span>
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{idea.title}</h1>
          <Badge 
            className={
              idea.status === 'approved' 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : idea.status === 'drafted' 
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-gray-50 text-gray-700 border-gray-200'
            }
          >
            {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
          </Badge>
          <Badge 
            className={
              idea.contentType === 'linkedin'
                ? 'bg-sky-50 text-sky-700 border-sky-200'
                : idea.contentType === 'newsletter'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }
          >
            {idea.contentType.charAt(0).toUpperCase() + idea.contentType.slice(1)}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Created {idea.createdAt.toLocaleDateString()}
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Description</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p>{idea.description}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Notes</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p>{idea.notes}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Drafts</CardTitle>
                <Button className="gap-1" disabled={idea.status !== 'approved'}>
                  <Plus className="h-4 w-4" />
                  Generate Draft
                </Button>
              </div>
              <CardDescription>
                Drafts generated from this content idea
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center border rounded-lg bg-muted/10">
                <p className="text-sm text-muted-foreground">
                  No drafts have been generated for this idea yet
                </p>
                <Button className="mt-4 gap-1" disabled={idea.status !== 'approved'}>
                  <Plus className="h-4 w-4" />
                  Generate Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Generate Content</CardTitle>
              <CardDescription>
                Create content based on this idea
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full gap-1" disabled={idea.status !== 'approved'}>
                <Plus className="h-4 w-4" />
                Generate LinkedIn Post
              </Button>
              <Button className="w-full gap-1" disabled={idea.status !== 'approved'}>
                <Plus className="h-4 w-4" />
                Generate Newsletter
              </Button>
              <Button className="w-full gap-1" disabled={idea.status !== 'approved'}>
                <Plus className="h-4 w-4" />
                Generate Marketing Copy
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Feedback</CardTitle>
              <CardDescription>
                Add notes or feedback about this idea
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Add your feedback or notes here..."
                className="min-h-24 resize-none"
              />
              <Button className="w-full">Save Feedback</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetailPage;
