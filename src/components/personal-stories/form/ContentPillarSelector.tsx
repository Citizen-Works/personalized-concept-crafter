
import React from "react";
import { Button } from "@/components/ui/button";
import { ContentPillar } from "@/types";

interface ContentPillarSelectorProps {
  contentPillars: ContentPillar[] | undefined;
  selectedPillarIds: string[];
  onChange: (pillarId: string) => void;
}

export const ContentPillarSelector: React.FC<ContentPillarSelectorProps> = ({
  contentPillars,
  selectedPillarIds,
  onChange
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {contentPillars?.map(pillar => (
        <Button
          key={pillar.id}
          type="button"
          size="sm"
          variant={selectedPillarIds.includes(pillar.id) ? "default" : "outline"}
          onClick={() => onChange(pillar.id)}
        >
          {pillar.name}
        </Button>
      ))}
      {(!contentPillars || contentPillars.length === 0) && (
        <p className="text-sm text-muted-foreground">
          No content pillars available. Add some in the Strategy section.
        </p>
      )}
    </div>
  );
};
