
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type IdeaLinkCardProps = {
  contentIdeaId: string;
};

export const IdeaLinkCard: React.FC<IdeaLinkCardProps> = ({ contentIdeaId }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Original Idea</CardTitle>
        <CardDescription>
          View the source content idea
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full" asChild>
          <Link to={`/ideas/${contentIdeaId}`}>
            View Content Idea
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
