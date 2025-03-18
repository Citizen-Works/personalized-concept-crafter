
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface TagInputProps {
  name: string;
  label: string;
  description: string;
  placeholder: string;
  form: UseFormReturn<any>;
}

export function TagInput({ 
  name, 
  label, 
  description, 
  placeholder, 
  form 
}: TagInputProps) {
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    if (!tagInput.trim()) return;
    
    const currentTags = form.getValues()[name] || [];
    form.setValue(name, [...currentTags, tagInput.trim()]);
    setTagInput("");
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues()[name] || [];
    form.setValue(
      name,
      currentTags.filter((_, i: number) => i !== index)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormDescription>
            {description}
          </FormDescription>
          <div className="flex gap-2 mb-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1"
            />
            <Button 
              type="button" 
              onClick={addTag}
              variant="secondary"
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 max-h-24 overflow-y-auto">
            {form.watch(name)?.map((tag: string, index: number) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full"
              >
                <span className="text-sm">{tag}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => removeTag(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
