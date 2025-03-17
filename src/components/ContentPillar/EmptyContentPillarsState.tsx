
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyContentPillarsStateProps {
  onClick: () => void;
}

export function EmptyContentPillarsState({ onClick }: EmptyContentPillarsStateProps) {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
        <Plus className="h-8 w-8 text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium">Add Content Pillar</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Define key topics for your content strategy
        </p>
        <Button className="gap-1" onClick={onClick}>
          <Plus className="h-4 w-4" />
          Add Pillar
        </Button>
      </CardContent>
    </Card>
  );
}
