
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function EmptyTargetAudienceCard() {
  const navigate = useNavigate();

  const handleAddAudience = () => {
    navigate("/target-audiences");
  };

  return (
    <Card className="border-dashed border-2">
      <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
        <Users className="h-8 w-8 text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium">Add Target Audience</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Define who your content is designed to reach
        </p>
        <Button className="gap-1" onClick={handleAddAudience}>
          <Plus className="h-4 w-4" />
          Add Audience
        </Button>
      </CardContent>
    </Card>
  );
}
