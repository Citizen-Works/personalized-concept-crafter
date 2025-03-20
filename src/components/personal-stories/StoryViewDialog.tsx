
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Card,
  CardContent,
  CardDescription, 
  CardHeader,
  CardTitle
} from "@/components/ui/card"; 
import { Separator } from "@/components/ui/separator";
import { PersonalStory } from "@/types";
import { useContentPillars } from "@/hooks/useContentPillars";
import { useTargetAudiences } from "@/hooks/useTargetAudiences";
import { formatRelativeDate, formatDate } from "@/utils/dateUtils";
import { 
  Hash, 
  Target, 
  Users, 
  Lightbulb, 
  HelpCircle, 
  Clock, 
  FileText 
} from "lucide-react";

interface StoryViewDialogProps {
  story: PersonalStory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StoryViewDialog: React.FC<StoryViewDialogProps> = ({
  story,
  open,
  onOpenChange
}) => {
  const { contentPillars } = useContentPillars();
  const { targetAudiences } = useTargetAudiences();
  
  // Get content pillar and target audience names
  const pillarNames = contentPillars
    ?.filter(pillar => story.contentPillarIds.includes(pillar.id))
    .map(pillar => pillar.name) || [];
    
  const audienceNames = targetAudiences
    ?.filter(audience => story.targetAudienceIds.includes(audience.id))
    .map(audience => audience.name) || [];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{story.title}</DialogTitle>
          <DialogDescription>
            Created {formatDate(story.createdAt)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="whitespace-pre-line">{story.content}</p>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {story.lesson && (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    <CardTitle className="text-base">Lesson or Takeaway</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{story.lesson}</p>
                </CardContent>
              </Card>
            )}
            
            {story.usageGuidance && (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-base">Usage Guidance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{story.usageGuidance}</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {story.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                  <Hash className="h-4 w-4" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {story.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Usage Statistics
              </h3>
              <div className="text-sm">
                <p>Used {story.usageCount} times</p>
                {story.lastUsedDate && (
                  <p>Last used {formatRelativeDate(story.lastUsedDate)}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pillarNames.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                  <Target className="h-4 w-4" />
                  Relevant Content Pillars
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {pillarNames.map(name => (
                    <Badge key={name} variant="outline">
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {audienceNames.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  Target Audiences
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {audienceNames.map(name => (
                    <Badge key={name} variant="outline">
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {story.usageCount > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                Used In Content
              </h3>
              <p className="text-sm text-muted-foreground">
                This story has been used in content {story.usageCount} times.
              </p>
              {/* Future enhancement: Show the content pieces where this story has been used */}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
