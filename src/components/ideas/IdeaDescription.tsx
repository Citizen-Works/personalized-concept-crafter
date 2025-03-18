
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IdeaDescriptionProps {
  id: string;
  description: string;
}

const IdeaDescription: React.FC<IdeaDescriptionProps> = ({ id, description }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Description</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description || '(No description provided)'}</p>
      </CardContent>
    </Card>
  );
};

export default IdeaDescription;
