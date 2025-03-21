
import React from "react";
import { Label } from "@/components/ui/label";

interface StoryFormFieldProps {
  id: string;
  label: string;
  children: React.ReactNode;
  helperText?: string;
}

export const StoryFormField: React.FC<StoryFormFieldProps> = ({
  id,
  label,
  children,
  helperText
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {helperText && (
        <p className="text-xs text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  );
};
