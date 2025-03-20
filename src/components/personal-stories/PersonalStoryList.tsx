
import React from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreVertical, 
  FileEdit, 
  Archive, 
  RotateCcw, 
  FileText, 
  Clock, 
  Hash, 
  ExternalLink 
} from "lucide-react";
import { PersonalStory } from "@/types";
import { StoryViewDialog } from "./StoryViewDialog";
import { EditStoryDialog } from "./EditStoryDialog";
import { formatRelativeDate } from "@/utils/dateUtils";

interface PersonalStoryListProps {
  stories: PersonalStory[];
  onEdit: (story: PersonalStory) => Promise<void>;
  onArchive?: (id: string) => Promise<void>;
  onRestore?: (id: string) => Promise<void>;
  isArchiveView?: boolean;
}

export const PersonalStoryList: React.FC<PersonalStoryListProps> = ({
  stories,
  onEdit,
  onArchive,
  onRestore,
  isArchiveView = false
}) => {
  const [viewStory, setViewStory] = React.useState<PersonalStory | null>(null);
  const [editStory, setEditStory] = React.useState<PersonalStory | null>(null);

  return (
    <div className="space-y-4">
      {stories.map((story) => (
        <Card key={story.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle 
                className="text-lg cursor-pointer hover:text-primary transition-colors"
                onClick={() => setViewStory(story)}
              >
                {story.title}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setViewStory(story)}>
                    <FileText className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEditStory(story)}>
                    <FileEdit className="mr-2 h-4 w-4" />
                    Edit Story
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {isArchiveView ? (
                    <DropdownMenuItem 
                      onClick={() => onRestore && onRestore(story.id)}
                      className="text-green-500 hover:text-green-500"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Restore Story
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem 
                      onClick={() => onArchive && onArchive(story.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Archive Story
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm line-clamp-2 mb-2">
              {story.content.substring(0, 200)}
              {story.content.length > 200 && "..."}
            </p>
            
            <div className="flex flex-wrap gap-1.5 mt-2">
              {story.tags.slice(0, 5).map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  {tag}
                </Badge>
              ))}
              {story.tags.length > 5 && (
                <Badge variant="outline">+{story.tags.length - 5} more</Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground flex justify-between pt-2">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Created {formatRelativeDate(story.createdAt)}
            </div>
            <div className="flex items-center gap-1">
              <span>Used {story.usageCount} times</span>
              {story.lastUsedDate && (
                <span className="ml-2">
                  • Last used {formatRelativeDate(story.lastUsedDate)}
                </span>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}

      {viewStory && (
        <StoryViewDialog
          story={viewStory}
          open={!!viewStory}
          onOpenChange={(open) => !open && setViewStory(null)}
        />
      )}

      {editStory && (
        <EditStoryDialog
          story={editStory}
          open={!!editStory}
          onOpenChange={(open) => !open && setEditStory(null)}
          onSave={onEdit}
        />
      )}
    </div>
  );
};
