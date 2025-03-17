
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DraftWithIdea } from '@/hooks/useDrafts';

type DraftHeaderProps = {
  draft: DraftWithIdea;
};

export const DraftHeader: React.FC<DraftHeaderProps> = ({ draft }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/drafts">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Drafts</span>
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{draft.ideaTitle}</h1>
          <Badge 
            className={draft.contentType === 'linkedin' 
              ? 'bg-sky-50 text-sky-700 border-sky-200' 
              : draft.contentType === 'newsletter' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'}
          >
            {draft.contentType.charAt(0).toUpperCase() + draft.contentType.slice(1)}
          </Badge>
          <Badge className="bg-blue-50 text-blue-700 border-blue-200">
            Version {draft.version}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Created {draft.createdAt.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};
