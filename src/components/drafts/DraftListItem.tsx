
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ContentType } from '@/types';
import { DraftWithIdea } from '@/hooks/useDrafts';

type DraftListItemProps = {
  draft: DraftWithIdea;
  onDelete: (id: string) => void;
};

export const getTypeBadgeClasses = (type: ContentType) => {
  switch (type) {
    case 'linkedin':
      return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'newsletter':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'marketing':
      return 'bg-rose-50 text-rose-700 border-rose-200';
  }
};

export const DraftListItem: React.FC<DraftListItemProps> = ({ draft, onDelete }) => {
  const handleDeleteDraft = () => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
      onDelete(draft.id);
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium">{draft.ideaTitle}</h3>
              <Badge 
                className={`${getTypeBadgeClasses(draft.contentType)}`}
              >
                {draft.contentType.charAt(0).toUpperCase() + draft.contentType.slice(1)}
              </Badge>
              <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                Version {draft.version}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{draft.content}</p>
            <p className="text-xs text-muted-foreground">
              Created {new Date(draft.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/drafts/${draft.id}`}>
                View Details
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteDraft}>
                  <Trash className="h-4 w-4 mr-2 text-destructive" />
                  <span className="text-destructive">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
