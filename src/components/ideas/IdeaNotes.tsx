
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from 'lucide-react';

interface IdeaNotesProps {
  id: string;
  notes: string;
}

const IdeaNotes: React.FC<IdeaNotesProps> = ({ id, notes }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Notes</CardTitle>
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link to={`/ideas/${id}/edit`}>
              <Edit className="h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p>{notes || '(No notes provided)'}</p>
      </CardContent>
    </Card>
  );
};

export default IdeaNotes;
