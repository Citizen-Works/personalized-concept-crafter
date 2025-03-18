
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isSubmitting: boolean;
  isEditing: boolean;
}

export function FormActions({ isSubmitting, isEditing }: FormActionsProps) {
  return (
    <div className="flex justify-end sticky bottom-0 pt-4 bg-background">
      <Button type="submit" disabled={isSubmitting}>
        {isEditing ? "Update" : "Create"} Audience
      </Button>
    </div>
  );
}
