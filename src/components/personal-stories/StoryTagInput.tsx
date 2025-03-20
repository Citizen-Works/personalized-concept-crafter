
import React, { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";

interface StoryTagInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  suggestedTags?: string[];
}

// Common story tag suggestions
const DEFAULT_SUGGESTED_TAGS = [
  "Success", "Challenge", "Failure", "Learning", "Client", "Personal",
  "Professional", "Insight", "Growth", "Problem", "Solution", "Transformation"
];

export const StoryTagInput: React.FC<StoryTagInputProps> = ({
  tags,
  setTags,
  suggestedTags = DEFAULT_SUGGESTED_TAGS
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isInputActive, setIsInputActive] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Add new tag
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
    setInputValue("");
    setFilteredSuggestions([]);
    inputRef.current?.focus();
  };

  // Remove existing tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Filter suggestions based on input
    if (value) {
      const filtered = suggestedTags
        .filter(tag => 
          tag.toLowerCase().includes(value.toLowerCase()) && 
          !tags.includes(tag)
        )
        .slice(0, 5); // Limit to 5 suggestions
      
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  // Handle input keydown events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="relative">
      <div
        className={`flex flex-wrap items-center gap-1.5 p-2 border rounded-md bg-background ${
          isInputActive ? "ring-2 ring-ring ring-offset-background" : ""
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
            <button
              type="button"
              className="ml-1 rounded-full outline-none hover:bg-muted"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag} tag</span>
            </button>
          </Badge>
        ))}
        
        <div className="flex-1">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsInputActive(true)}
            onBlur={() => {
              setIsInputActive(false);
              setTimeout(() => setFilteredSuggestions([]), 150);
            }}
            className="border-none px-1 py-0.5 focus-visible:ring-0 text-sm h-7"
            placeholder={tags.length ? "Add another tag..." : "Add tags..."}
          />
        </div>
      </div>
      
      {/* Show suggestions dropdown when there are filtered suggestions */}
      {filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md">
          <div className="p-1">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addTag(suggestion)}
                className="flex items-center w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/50 text-left"
              >
                <Plus className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Suggested tags section */}
      {tags.length < 3 && !inputValue && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-1.5">Suggested tags:</p>
          <div className="flex flex-wrap gap-1">
            {suggestedTags
              .filter(tag => !tags.includes(tag))
              .slice(0, 8)
              .map(suggestion => (
                <Badge 
                  key={suggestion} 
                  variant="outline"
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => addTag(suggestion)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {suggestion}
                </Badge>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
