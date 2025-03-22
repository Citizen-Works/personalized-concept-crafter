import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDrafts } from '@/hooks/useDrafts';
import { useIdeas } from '@/hooks/ideas';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Save, XCircle } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentType, DraftStatus } from '@/types';
import { getDraftStatusBadgeClasses } from '@/components/ideas/BadgeUtils';

const DraftDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDraft, updateDraft } = useDrafts();
  const { getIdea, updateIdea } = useIdeas();
  const { data: draft, isLoading: isDraftLoading, isError: isDraftError } = getDraft(id || '');
  const { data: idea, isLoading: isIdeaLoading, isError: isIdeaError } = draft ? getIdea(draft.contentIdeaId) : { data: null, isLoading: false, isError: false };
  const [isEditing, setIsEditing] = React.useState(false);
  const [content, setContent] = React.useState(draft?.content || '');
  const [feedback, setFeedback] = React.useState(draft?.feedback || '');
  const [status, setStatus] = React.useState<DraftStatus>(draft?.status || 'draft');
  const [contentType, setContentType] = React.useState<ContentType>(draft?.contentType || 'linkedin');

  const handleSave = async () => {
    if (!draft) return;

    try {
      await updateDraft({
        id: draft.id,
        content,
        feedback,
        status,
        contentType
      });
      toast.success('Draft updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating draft:', error);
      toast.error('Failed to update draft');
    }
  };

  const handlePublish = async () => {
    if (!draft || !idea) return;

    try {
      await updateDraft({
        id: draft.id,
        content,
        feedback,
        status: 'published',
        contentType
      });

      // Optionally, update the idea to mark it as used
      if (!idea.hasBeenUsed) {
        await updateIdea({
          id: idea.id,
          hasBeenUsed: true
        });
      }

      toast.success('Draft published successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error publishing draft:', error);
      toast.error('Failed to publish draft');
    }
  };

  if (isDraftLoading || isIdeaLoading) {
    return <div>Loading...</div>;
  }

  if (isDraftError || isIdeaError || !draft || !idea) {
    return <div>Error loading draft or associated idea.</div>;
  }

  const statusBadgeClass = getDraftStatusBadgeClasses(status);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button variant="outline" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{idea.title} - Draft Details</h1>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button variant="default" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="primary" onClick={handlePublish}>
              Publish
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Draft
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Draft Content</CardTitle>
          <CardDescription>
            Manage and refine your draft content.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="status">Status</Label>
            <Badge className={statusBadgeClass}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content-type">Content Type</Label>
            {isEditing ? (
              <Select onValueChange={(value) => setContentType(value as ContentType)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a type" defaultValue={contentType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input id="content-type" value={contentType} readOnly />
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            {isEditing ? (
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="resize-none"
              />
            ) : (
              <Textarea
                id="content"
                value={content}
                readOnly
                className="resize-none"
              />
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="feedback">Feedback</Label>
            {isEditing ? (
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="resize-none"
              />
            ) : (
              <Textarea
                id="feedback"
                value={feedback}
                readOnly
                className="resize-none"
              />
            )}
          </div>
        </CardContent>
        <CardFooter>
          {/* Additional actions or information can be added here */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default DraftDetailPage;
