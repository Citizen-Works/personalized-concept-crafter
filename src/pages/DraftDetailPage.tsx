
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ChevronLeft, ChevronRight, Copy, Edit, Share, ThumbsDown, ThumbsUp, Trash } from 'lucide-react';
import { useDrafts } from '@/hooks/useDrafts';
import { toast } from "sonner";

const DraftDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDraft, updateDraft, deleteDraft } = useDrafts();
  const { data: draft, isLoading, isError } = getDraft(id || '');
  
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set initial feedback value when draft is loaded
  React.useEffect(() => {
    if (draft) {
      setFeedback(draft.feedback || '');
    }
  }, [draft]);

  const handleCopyContent = () => {
    if (draft) {
      navigator.clipboard.writeText(draft.content)
        .then(() => toast.success('Content copied to clipboard'))
        .catch(() => toast.error('Failed to copy content'));
    }
  };

  const handleSaveFeedback = async () => {
    if (!draft) return;
    
    setIsSubmitting(true);
    try {
      await updateDraft({
        id: draft.id,
        feedback
      });
    } catch (error) {
      console.error('Error saving feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDraft = async () => {
    if (!draft) return;
    
    if (window.confirm('Are you sure you want to delete this draft?')) {
      try {
        await deleteDraft(draft.id);
        toast.success('Draft deleted successfully');
        navigate('/drafts');
      } catch (error) {
        console.error('Error deleting draft:', error);
      }
    }
  };

  if (isLoading) {
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
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (isError || !draft) {
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
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-2">Draft Not Found</h2>
          <p className="text-muted-foreground mb-4">The draft you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button asChild>
            <Link to="/drafts">Return to Drafts</Link>
          </Button>
        </div>
      </div>
    );
  }
  
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
            className={draft.contentType === 'linkedin' 
              ? 'bg-sky-50 text-sky-700 border-sky-200' 
              : draft.contentType === 'newsletter' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'}
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                    onClick={handleCopyContent}
                  >
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
            <Button variant="outline" size="sm" className="gap-1" disabled>
              <ChevronLeft className="h-4 w-4" />
              Previous Version
            </Button>
            <Button variant="outline" size="sm" className="gap-1" disabled>
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
              <Button 
                variant="outline" 
                className="w-full gap-1"
                onClick={handleCopyContent}
              >
                <Copy className="h-4 w-4" />
                Copy to Clipboard
              </Button>
              <Button 
                variant="destructive" 
                className="w-full gap-1"
                onClick={handleDeleteDraft}
              >
                <Trash className="h-4 w-4" />
                Delete Draft
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
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <Button 
                className="w-full"
                onClick={handleSaveFeedback}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Feedback'}
              </Button>
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
                <Link to={`/ideas/${draft.contentIdeaId}`}>
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
