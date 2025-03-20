
import React, { useState } from "react";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useContentPillars } from "@/hooks/useContentPillars";
import { useTargetAudiences } from "@/hooks/useTargetAudiences";
import { PersonalStory } from "@/types";
import { StoryTagInput } from "./StoryTagInput";

interface CreateStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (story: Omit<PersonalStory, "id" | "createdAt" | "usageCount" | "lastUsedDate" | "isArchived">) => Promise<void>;
}

export const CreateStoryDialog: React.FC<CreateStoryDialogProps> = ({
  open,
  onOpenChange,
  onSave
}) => {
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [contentPillarIds, setContentPillarIds] = useState<string[]>([]);
  const [targetAudienceIds, setTargetAudienceIds] = useState<string[]>([]);
  const [lesson, setLesson] = useState("");
  const [usageGuidance, setUsageGuidance] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch pillars and audiences for relevance fields
  const { contentPillars } = useContentPillars();
  const { targetAudiences } = useTargetAudiences();
  
  // Reset form state when dialog is closed
  React.useEffect(() => {
    if (!open) {
      setTitle("");
      setContent("");
      setTags([]);
      setContentPillarIds([]);
      setTargetAudienceIds([]);
      setLesson("");
      setUsageGuidance("");
      setIsSubmitting(false);
    }
  }, [open]);
  
  // Form validation
  const isValid = title.trim() !== "" && content.trim() !== "";
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await onSave({
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
      console.error("Failed to create story:", error);
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
            <DialogTitle>Create New Story</DialogTitle>
            <DialogDescription>
              Add a personal anecdote or experience to use in your content
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
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Story"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
