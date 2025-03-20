
import React from 'react';
import { ContentIdea, ContentType } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Eye, Check, X, ArrowUpRight, Trash } from "lucide-react";
import { getTypeBadgeClasses } from '@/components/ideas/BadgeUtils';

interface ReviewQueueItemProps {
  idea: ContentIdea;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onPreview: (id: string) => void;
  onApprove: (id: string) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  onDelete: (id: string) => void;
}

export const ReviewQueueItem: React.FC<ReviewQueueItemProps> = ({
  idea,
  isSelected,
  onToggleSelect,
  onPreview,
  onApprove,
  onArchive,
  onDelete
}) => {
  return (
    <Card key={idea.id} className="overflow-hidden transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-start">
          <Checkbox 
            id={`select-${idea.id}`} 
            className="mr-2 mt-1"
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(idea.id)}
          />
          <div>
            <CardTitle className="text-base">{idea.title}</CardTitle>
            <CardDescription>
              {idea.source === 'meeting' ? 'From meeting transcript' : 'Manually created'} • {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {idea.description || "No description provided"}
          </p>
          {idea.contentType && (
            <Badge className={`ml-2 shrink-0 ${getTypeBadgeClasses(idea.contentType as ContentType)}`}>
              {idea.contentType.charAt(0).toUpperCase() + idea.contentType.slice(1)}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <a href={`/ideas/${idea.id}`} target="_blank" rel="noopener noreferrer">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            View Details
          </a>
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => onPreview(idea.id)}
            title="Quick View"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="default" 
            size="icon" 
            onClick={() => onApprove(idea.id)}
            title="Approve"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => onArchive(idea.id)}
            title="Archive"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(idea.id)}
            title="Delete"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
