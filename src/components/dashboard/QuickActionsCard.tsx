
import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, FileText, ClipboardList } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const QuickActionsCard = () => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
        <CardDescription>Start creating content</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Button variant="primary" className="w-full justify-start" asChild>
          <Link to="/ideas/new" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span>New Content Idea</span>
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/generate-draft" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Generate Draft</span>
          </Link>
        </Button>
        <Button variant="secondary" className="w-full justify-start" asChild>
          <Link to="/review-queue" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span>Review Queue</span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
