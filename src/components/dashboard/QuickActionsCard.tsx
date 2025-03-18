
import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';

export const QuickActionsCard = () => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used features</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Button className="w-full text-left flex justify-start" asChild>
          <Link to="/ideas/new" className="flex items-center gap-2 text-white w-full">
            <Lightbulb className="h-4 w-4 shrink-0" />
            <span className={isMobile ? "line-clamp-1" : ""}>Create New Content Idea</span>
          </Link>
        </Button>
        <Button variant="outline" className="w-full text-left flex justify-start" asChild>
          <Link to="/drafts" className="flex items-center gap-2 w-full">
            <FileText className="h-4 w-4 shrink-0" />
            <span className={isMobile ? "line-clamp-1" : ""}>Manage Drafts</span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
