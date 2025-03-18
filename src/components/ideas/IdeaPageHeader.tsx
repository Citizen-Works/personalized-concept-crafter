
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from 'lucide-react';
import { ContentIdea } from '@/types';
import { getStatusBadgeClasses, getTypeBadgeClasses } from './BadgeUtils';

interface IdeaPageHeaderProps {
  idea: ContentIdea;
}

const IdeaPageHeader: React.FC<IdeaPageHeaderProps> = ({ idea }) => {
  return (
    <>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/ideas">
            <ArrowLeft className="h-4 w-4" />
            <span className="sm:inline hidden">Back to Ideas</span>
            <span className="sm:hidden inline">Back</span>
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">{idea.title}</h1>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge className={getStatusBadgeClasses(idea.status)}>
              {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
            </Badge>
            <Badge className={getTypeBadgeClasses(idea.contentType)}>
              {idea.contentType.charAt(0).toUpperCase() + idea.contentType.slice(1)}
            </Badge>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          Created {new Date(idea.createdAt).toLocaleDateString()}
        </p>
      </div>
    </>
  );
};

export default IdeaPageHeader;
