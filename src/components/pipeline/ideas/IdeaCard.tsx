
import React from 'react';
import { Link } from 'react-router-dom';
import { ContentIdea, ContentStatus, ContentType } from '@/types';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ArrowUpRight, Edit, MoreHorizontal, Trash } from 'lucide-react';

interface IdeaCardProps {
  idea: ContentIdea;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onDeleteClick?: (id: string) => void;
  getStatusBadgeClasses: (status: ContentStatus) => string;
  getTypeBadgeClasses: (type: ContentType | null) => string;
  hideStatusBadge?: boolean;
  hideTypeBadge?: boolean;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ 
  idea, 
  isSelected = false,
  onToggleSelect,
  onDeleteClick,
  getStatusBadgeClasses,
  getTypeBadgeClasses,
  hideStatusBadge = false,
  hideTypeBadge = true
}) => {
  return (
    <Card key={idea.id} className={`overflow-hidden transition-all duration-200 hover:shadow-md ${isSelected ? 'border-primary' : ''}`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-3">
          {/* Checkbox for selection if applicable */}
          {onToggleSelect && (
            <div className="flex justify-end">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(idea.id)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>
          )}
          
          {/* Title section - now with more space and no truncation */}
          <div className="space-y-1 flex-1">
            <div className="flex flex-col gap-2">
              <h3 className="font-medium text-sm sm:text-base line-clamp-2 break-words">{idea.title}</h3>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {!hideStatusBadge && (
                  <Badge 
                    className={`${getStatusBadgeClasses(idea.status)} text-xs whitespace-nowrap`}
                  >
                    {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                  </Badge>
                )}
                {!hideTypeBadge && idea.contentType && (
                  <Badge 
                    className={`${getTypeBadgeClasses(idea.contentType)} text-xs whitespace-nowrap`}
                  >
                    {idea.contentType.charAt(0).toUpperCase() + idea.contentType.slice(1)}
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{idea.description}</p>
            {/* Date is now more prominent and will always be visible */}
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Created {new Date(idea.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          {/* Actions row - with smaller view details button */}
          <div className="flex items-center justify-between mt-2">
            <Button variant="outline" size="sm" asChild className="h-8 w-8 p-0">
              <Link to={`/ideas/${idea.id}`} aria-label="View details">
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/ideas/${idea.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                {onDeleteClick && (
                  <DropdownMenuItem onClick={() => onDeleteClick(idea.id)}>
                    <Trash className="h-4 w-4 mr-2 text-destructive" />
                    <span className="text-destructive">Delete</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeaCard;
