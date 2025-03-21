
import React from "react";
import { Button } from "@/components/ui/button";
import { TargetAudience } from "@/types";

interface AudienceSelectorProps {
  targetAudiences: TargetAudience[] | undefined;
  selectedAudienceIds: string[];
  onChange: (audienceId: string) => void;
}

export const AudienceSelector: React.FC<AudienceSelectorProps> = ({
  targetAudiences,
  selectedAudienceIds,
  onChange
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {targetAudiences?.map(audience => (
        <Button
          key={audience.id}
          type="button"
          size="sm"
          variant={selectedAudienceIds.includes(audience.id) ? "default" : "outline"}
          onClick={() => onChange(audience.id)}
        >
          {audience.name}
        </Button>
      ))}
      {(!targetAudiences || targetAudiences.length === 0) && (
        <p className="text-sm text-muted-foreground">
          No target audiences available. Add some in the Strategy section.
        </p>
      )}
    </div>
  );
};
