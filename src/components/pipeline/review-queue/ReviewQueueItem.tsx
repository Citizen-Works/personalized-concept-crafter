
import React from 'react';
import { ContentIdea, ContentType } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Eye, Check, X, ArrowUpRight, Loader2 } from "lucide-react";
import { getTypeBadgeClasses } from '@/components/ideas/BadgeUtils';

interface ReviewQueueItemProps {
  idea: ContentIdea;
  isSelected: boolean;
  isUpdating: boolean;
  onToggleSelect: (id: string) => void;
  onPreview: (id: string) => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

export const ReviewQueueItem: React.FC<ReviewQueueItemProps> = ({
  idea,
  isSelected,
  isUpdating,
  onToggleSelect,
  onPreview,
  onApprove,
  onReject
}) => {
  const displaySource = () => {
    switch (idea.source) {
      case 'meeting':
        return 'From meeting transcript';
      case 'manual':
        return 'Manually created';
      case 'transcript':
        return 'From transcript';
      default:
        return idea.source ? `From ${idea.source}` : 'Manually created';
    }
  };

  return (
    <Card key={idea.id} className="overflow-hidden transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-start">
          <Checkbox 
            id={`select-${idea.id}`} 
            className="mr-2 mt-1"
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(idea.id)}
            disabled={isUpdating}
          />
          <div>
            <CardTitle className="text-base">{idea.title}</CardTitle>
            <CardDescription>
              {displaySource()} • {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {idea.description || "No description provided"}
          </p>
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
            disabled={isUpdating}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="default" 
            size="icon" 
            onClick={() => onApprove(idea.id)}
            title="Approve"
            disabled={isUpdating}
          >
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => onReject(idea.id)}
            title="Reject"
            disabled={isUpdating}
          >
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
