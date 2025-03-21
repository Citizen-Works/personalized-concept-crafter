
import React from 'react';
import { ContentIdea } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Search, Check, FileText } from "lucide-react";

interface IdeaSelectorProps {
  ideas: ContentIdea[];
  selectedIdea: ContentIdea | null;
  setSelectedIdea: (idea: ContentIdea) => void;
  isLoading: boolean;
}

const IdeaSelector: React.FC<IdeaSelectorProps> = ({
  ideas,
  selectedIdea,
  setSelectedIdea,
  isLoading
}) => {
  const [open, setOpen] = React.useState(false);
  const approvedIdeas = ideas.filter(idea => idea.status === 'approved');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Idea</CardTitle>
        <CardDescription>Select an approved idea to draft</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Content Idea Selector */}
        <div className="space-y-2">
          <Label htmlFor="idea-select">Select an idea</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
                disabled={isLoading}
              >
                {selectedIdea
                  ? `${selectedIdea.title.substring(0, 40)}${selectedIdea.title.length > 40 ? '...' : ''}`
                  : "Select an idea..."}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search ideas..." />
                <CommandList>
                  <CommandEmpty>No ideas found</CommandEmpty>
                  <CommandGroup>
                    {approvedIdeas.map((idea) => (
                      <CommandItem
                        key={idea.id}
                        value={idea.title}
                        onSelect={() => {
                          setSelectedIdea(idea);
                          setOpen(false);
                        }}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        {idea.title}
                        {selectedIdea?.id === idea.id && (
                          <Check className="ml-auto h-4 w-4" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Selected Idea Details */}
        {selectedIdea && (
          <Card className="bg-muted/50">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-medium">{selectedIdea.title}</h3>
              {selectedIdea.description && (
                <p className="text-sm text-muted-foreground">{selectedIdea.description}</p>
              )}
              <Badge variant="outline" className="text-xs">
                ID: {selectedIdea.id.substring(0, 8)}
              </Badge>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default IdeaSelector;
