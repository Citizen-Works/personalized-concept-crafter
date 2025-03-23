
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContentStatus, DraftStatus } from '@/types/status';
import { ContentType } from '@/types';
import { StatusBadge, TypeBadge } from '@/components/ui/StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface ContentCardProps {
  id: string;
  title: string;
  description?: string;
  contentType?: ContentType; 
  status?: ContentStatus | DraftStatus;
  statusType?: 'content' | 'draft';
  createdAt?: Date;
  selectionElement?: React.ReactNode;
  isSelected?: boolean;
  actions?: React.ReactNode;
  detailPath?: string;
  children?: React.ReactNode;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  id,
  title,
  description,
  contentType,
  status,
  statusType = 'content',
  createdAt,
  selectionElement,
  isSelected = false,
  actions,
  detailPath,
  children
}) => {
  return (
    <Card key={id} className={`overflow-hidden transition-all duration-200 ${isSelected ? 'border-primary' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start">
          {selectionElement}
          <div className="flex flex-col w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="text-base font-medium">{title}</h3>
              <div className="flex flex-wrap gap-1">
                {status && (
                  <StatusBadge 
                    status={status} 
                    type={statusType}
                  />
                )}
                {contentType && (
                  <TypeBadge type={contentType} />
                )}
              </div>
            </div>
            {createdAt && (
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(createdAt, { addSuffix: true })}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      
      {(description || children) && (
        <CardContent>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
          {children}
        </CardContent>
      )}
      
      <CardFooter className="flex justify-between">
        {detailPath ? (
          <Button variant="outline" size="sm" asChild>
            <Link to={detailPath}>
              <ArrowUpRight className="h-4 w-4 mr-1" />
              View Details
            </Link>
          </Button>
        ) : (
          <div />
        )}
        
        {actions && (
          <div className="flex gap-2">
            {actions}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
