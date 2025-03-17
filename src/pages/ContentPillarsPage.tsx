
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

const ContentPillarsPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Content Pillars</h1>
        <p className="text-muted-foreground">
          Manage the core topics and themes for your content strategy
        </p>
      </div>

      <div className="flex justify-end">
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          Add Content Pillar
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* This would be populated with actual content pillars */}
        <Card className="border-dashed border-2">
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
            <Plus className="h-8 w-8 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">Add Content Pillar</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Define key topics for your content strategy
            </p>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              Add Pillar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentPillarsPage;
