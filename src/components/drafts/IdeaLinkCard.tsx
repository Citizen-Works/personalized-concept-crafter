
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIdeas } from '@/hooks/ideas';
import { ArrowRight } from 'lucide-react';

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
          <div className="h-8 bg-muted/30 rounded animate-pulse"></div>
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
        </CardContent>
      </Card>
    );
  }

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
            {idea.description ? idea.description.substring(0, 100) + (idea.description.length > 100 ? '...' : '') : 'No description'}
          </p>
        </div>
        <Button asChild variant="outline" className="w-full gap-1">
          <Link to={`/ideas/${idea.id}`}>
            View Idea
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
