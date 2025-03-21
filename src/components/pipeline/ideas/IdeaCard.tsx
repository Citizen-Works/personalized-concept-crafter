
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Edit, ExternalLink, MoreHorizontal, Trash } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { ContentIdea, ContentStatus, ContentType } from "@/types";

interface IdeaCardProps {
  idea: ContentIdea;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onDeleteClick: (id: string) => void;
  getStatusBadgeClasses: (status: ContentStatus) => string;
  getTypeBadgeClasses: (type: ContentType) => string;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  isSelected,
  onToggleSelect,
  onDeleteClick,
  getStatusBadgeClasses,
  getTypeBadgeClasses
}) => {
  // Function to safely get content type display text
  const getContentTypeDisplay = () => {
    if (!idea.contentType) return 'Unknown';
    return idea.contentType.charAt(0).toUpperCase() + idea.contentType.slice(1);
  };

  return (
    <Card className={`transition-all ${isSelected ? 'border-primary' : ''}`}>
      <CardHeader className="p-4 pb-2 flex-row items-start justify-between space-y-0">
        <div className="flex gap-3 items-start">
          <Checkbox 
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(idea.id)}
            className="mt-1"
          />
          <div>
            <Link to={`/ideas/${idea.id}`} className="font-semibold hover:underline text-lg leading-tight">
              {idea.title}
            </Link>
            <div className="flex flex-wrap gap-2 mt-2">
              {idea.status && (
                <Badge className={getStatusBadgeClasses(idea.status)}>
                  {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                </Badge>
              )}
              {idea.contentType && (
                <Badge className={getTypeBadgeClasses(idea.contentType)}>
                  {getContentTypeDisplay()}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/ideas/${idea.id}`} className="cursor-pointer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/ideas/${idea.id}/edit`} className="cursor-pointer">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDeleteClick(idea.id)}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {idea.description || "No description provided."}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Created {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
        </p>
        
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/ideas/${idea.id}`}>
              View
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to={`/ideas/${idea.id}`}>
              Generate Content
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
