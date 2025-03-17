
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ChevronLeft, ChevronRight, Copy, Edit, Share, ThumbsDown, ThumbsUp } from 'lucide-react';

const DraftDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock data for the draft
  const draft = {
    id: id,
    ideaId: "1",
    ideaTitle: "How to leverage AI for business growth",
    content: `Artificial Intelligence is revolutionizing how businesses operate across every industry. From automating routine tasks to providing deeper customer insights, AI is no longer just a competitive advantage—it's becoming a necessity.

Here are 3 practical ways your business can leverage AI today:

1. Enhance customer experience with AI-powered chatbots and personalization
2. Optimize operations through predictive maintenance and inventory management
3. Gain competitive intelligence through automated market analysis

The businesses that thrive in the coming years won't be the ones with the biggest budgets, but those that strategically implement AI to solve real problems and create measurable value.

Are you exploring AI solutions for your business? What challenges are you hoping to address?`,
    version: 2,
    feedback: "Make it more concise and add specific examples",
    contentType: "linkedin" as const,
    createdAt: new Date("2023-06-17")
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/drafts">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Drafts</span>
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{draft.ideaTitle}</h1>
          <Badge 
            className="bg-sky-50 text-sky-700 border-sky-200"
          >
            {draft.contentType.charAt(0).toUpperCase() + draft.contentType.slice(1)}
          </Badge>
          <Badge className="bg-blue-50 text-blue-700 border-blue-200">
            Version {draft.version}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Created {draft.createdAt.toLocaleDateString()}
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Content</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </div>
              <CardDescription>Draft content for {draft.contentType}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border bg-muted/40 p-6 whitespace-pre-wrap">
                {draft.content}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Previous Version
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              Next Version
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                What would you like to do with this draft?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full gap-1">
                <Share className="h-4 w-4" />
                Publish
              </Button>
              <Button variant="outline" className="w-full gap-1">
                <Edit className="h-4 w-4" />
                Regenerate
              </Button>
              <Button variant="outline" className="w-full gap-1">
                <Copy className="h-4 w-4" />
                Copy to Clipboard
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Feedback</CardTitle>
              <CardDescription>
                Provide feedback on this draft
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1 gap-1">
                  <ThumbsDown className="h-4 w-4" />
                  Needs Work
                </Button>
                <Button variant="outline" className="flex-1 gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  Looks Good
                </Button>
              </div>
              
              <Textarea 
                placeholder="Add specific feedback here..."
                className="min-h-24 resize-none"
                defaultValue={draft.feedback}
              />
              <Button className="w-full">Save Feedback</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Original Idea</CardTitle>
              <CardDescription>
                View the source content idea
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/ideas/${draft.ideaId}`}>
                  View Content Idea
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DraftDetailPage;
