
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContentPillars } from "@/hooks/useContentPillars";
import { useTargetAudiences } from "@/hooks/useTargetAudiences";
import { PersonalStory } from "@/types";
import { StoryTagInput } from "./StoryTagInput";

interface EditStoryDialogProps {
  story: PersonalStory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (story: PersonalStory) => Promise<void>;
}

export const EditStoryDialog: React.FC<EditStoryDialogProps> = ({
  story,
  open,
  onOpenChange,
  onSave
}) => {
  // Form state
  const [title, setTitle] = useState(story.title);
  const [content, setContent] = useState(story.content);
  const [tags, setTags] = useState<string[]>(story.tags);
  const [contentPillarIds, setContentPillarIds] = useState<string[]>(story.contentPillarIds);
  const [targetAudienceIds, setTargetAudienceIds] = useState<string[]>(story.targetAudienceIds);
  const [lesson, setLesson] = useState(story.lesson);
  const [usageGuidance, setUsageGuidance] = useState(story.usageGuidance);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch pillars and audiences for relevance fields
  const { contentPillars } = useContentPillars();
  const { targetAudiences } = useTargetAudiences();
  
  // Update form state when story prop changes
  useEffect(() => {
    setTitle(story.title);
    setContent(story.content);
    setTags(story.tags);
    setContentPillarIds(story.contentPillarIds);
    setTargetAudienceIds(story.targetAudienceIds);
    setLesson(story.lesson);
    setUsageGuidance(story.usageGuidance);
  }, [story]);
  
  // Form validation
  const isValid = title.trim() !== "" && content.trim() !== "";
  
  // Check if any fields have been changed
  const hasChanges = 
    title !== story.title ||
    content !== story.content ||
    JSON.stringify(tags) !== JSON.stringify(story.tags) ||
    JSON.stringify(contentPillarIds) !== JSON.stringify(story.contentPillarIds) ||
    JSON.stringify(targetAudienceIds) !== JSON.stringify(story.targetAudienceIds) ||
    lesson !== story.lesson ||
    usageGuidance !== story.usageGuidance;
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid || isSubmitting || !hasChanges) return;
    
    setIsSubmitting(true);
    
    try {
      await onSave({
        ...story,
        title: title.trim(),
        content: content.trim(),
        tags,
        contentPillarIds,
        targetAudienceIds,
        lesson: lesson.trim(),
        usageGuidance: usageGuidance.trim(),
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update story:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePillarChange = (pillarId: string) => {
    setContentPillarIds(prev => 
      prev.includes(pillarId)
        ? prev.filter(id => id !== pillarId)
        : [...prev, pillarId]
    );
  };
  
  const handleAudienceChange = (audienceId: string) => {
    setTargetAudienceIds(prev => 
      prev.includes(audienceId)
        ? prev.filter(id => id !== audienceId)
        : [...prev, audienceId]
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Story</DialogTitle>
            <DialogDescription>
              Update your personal story or experience
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Give your story a memorable title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="content">Story Content</Label>
              <Textarea
                id="content"
                placeholder="Share your story or experience..."
                className="min-h-[150px] resize-y"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Tags</Label>
              <StoryTagInput 
                tags={tags} 
                setTags={setTags} 
              />
              <p className="text-xs text-muted-foreground">
                Use tags like "Success", "Challenge", "Client", "Learning", etc.
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="lesson">Lesson or Takeaway</Label>
              <Textarea
                id="lesson"
                placeholder="What's the main point or lesson from this story?"
                className="min-h-[80px] resize-y"
                value={lesson}
                onChange={(e) => setLesson(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="usageGuidance">Usage Guidance</Label>
              <Textarea
                id="usageGuidance"
                placeholder="How and when should this story be used in content?"
                className="min-h-[80px] resize-y"
                value={usageGuidance}
                onChange={(e) => setUsageGuidance(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Relevant Content Pillars</Label>
              <div className="flex flex-wrap gap-2">
                {contentPillars?.map(pillar => (
                  <Button
                    key={pillar.id}
                    type="button"
                    size="sm"
                    variant={contentPillarIds.includes(pillar.id) ? "default" : "outline"}
                    onClick={() => handlePillarChange(pillar.id)}
                  >
                    {pillar.name}
                  </Button>
                ))}
                {(!contentPillars || contentPillars.length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    No content pillars available. Add some in the Strategy section.
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Target Audiences This Resonates With</Label>
              <div className="flex flex-wrap gap-2">
                {targetAudiences?.map(audience => (
                  <Button
                    key={audience.id}
                    type="button"
                    size="sm"
                    variant={targetAudienceIds.includes(audience.id) ? "default" : "outline"}
                    onClick={() => handleAudienceChange(audience.id)}
                  >
                    {audience.name}
                  </Button>
                ))}
                {(!targetAudiences || targetAudiences.length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    No target audiences available. Add some in the Strategy section.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting || !hasChanges}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
