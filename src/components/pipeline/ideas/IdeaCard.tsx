
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
import { ArrowUpRight, Edit, MoreHorizontal, Trash, CheckCircle, Calendar } from 'lucide-react';
import { ResponsiveText } from '@/components/ui/responsive-text';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const createdDate = new Date(idea.createdAt);

  return (
    <Card key={idea.id} className={`overflow-hidden transition-all duration-200 hover:shadow-md ${isSelected ? 'border-primary' : ''}`}>
      <CardContent className={`p-3 ${isMobile ? 'p-3' : 'sm:p-5'}`}>
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
          
          {/* Title section with responsive text */}
          <div className="space-y-1 flex-1">
            <div className="flex flex-col gap-2">
              <ResponsiveText
                as="h3"
                mobileClasses="font-medium text-sm line-clamp-2 break-words"
                desktopClasses="font-medium text-base line-clamp-2 break-words"
              >
                {idea.title}
              </ResponsiveText>
              
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {!hideStatusBadge && (
                  <Badge 
                    className={`${getStatusBadgeClasses(idea.status)} text-xs whitespace-nowrap`}
                  >
                    {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                  </Badge>
                )}
                
                {/* Add Used badge */}
                {idea.hasBeenUsed && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Used
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Description with responsive clamp */}
            <p className={`text-muted-foreground ${isMobile ? 'text-xs line-clamp-1' : 'text-sm line-clamp-2'}`}>
              {idea.description || "No description provided"}
            </p>
            
            {/* Date with icon for better mobile display */}
            <div className={`flex items-center text-xs text-muted-foreground ${isMobile ? 'mt-1' : 'mt-2'}`}>
              <Calendar className="h-3 w-3 mr-1" />
              <span>{format(createdDate, 'MMM d, yyyy')}</span>
            </div>
          </div>
          
          {/* Actions row with improved spacing */}
          <div className="flex items-center justify-between mt-1">
            <Button variant="outline" size="sm" asChild className={`h-7 w-7 p-0 ${isMobile ? 'h-6 w-6' : ''}`}>
              <Link to={`/ideas/${idea.id}`} aria-label="View details">
                <ArrowUpRight className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'}`}>
                  <MoreHorizontal className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
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
