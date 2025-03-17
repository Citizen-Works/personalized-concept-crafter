
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from 'lucide-react';

interface IdeaDescriptionProps {
  id: string;
  description: string;
}

const IdeaDescription: React.FC<IdeaDescriptionProps> = ({ id, description }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Description</CardTitle>
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link to={`/ideas/${id}/edit`}>
              <Edit className="h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p>{description || '(No description provided)'}</p>
      </CardContent>
    </Card>
  );
};

export default IdeaDescription;
