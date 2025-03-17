
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIdeas } from '@/hooks/ideas';
import { ArrowRight, Calendar, Tag, FileEdit } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ContentStatus, ContentType } from '@/types';
import { Badge } from '@/components/ui/badge';
import { getStatusBadgeClasses, getTypeBadgeClasses } from '@/components/ideas/BadgeUtils';

type IdeaLinkCardProps = {
  contentIdeaId: string;
};

export const IdeaLinkCard: React.FC<IdeaLinkCardProps> = ({ contentIdeaId }) => {
  const { getIdea } = useIdeas();
  const { data: idea, isLoading, isError } = getIdea(contentIdeaId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Related Content Idea</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-9 w-full mt-4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !idea) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Related Content Idea</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Could not load the related idea. It may have been deleted.
          </p>
          <Button asChild variant="outline" className="w-full gap-1 mt-4">
            <Link to="/ideas">
              Browse Ideas
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Related Content Idea</CardTitle>
        <CardDescription>
          This draft was generated from this idea
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">{idea.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {idea.description ? 
              (idea.description.length > 100 ? 
                `${idea.description.substring(0, 100)}...` : 
                idea.description) : 
              'No description'}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge className={getStatusBadgeClasses(idea.status)}>
            {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
          </Badge>
          <Badge className={getTypeBadgeClasses(idea.contentType)}>
            {idea.contentType.charAt(0).toUpperCase() + idea.contentType.slice(1)}
          </Badge>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          <span>Created {formatDate(idea.createdAt)}</span>
        </div>
        
        <Button asChild variant="outline" className="w-full gap-1">
          <Link to={`/ideas/${idea.id}`}>
            View Idea Details
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
