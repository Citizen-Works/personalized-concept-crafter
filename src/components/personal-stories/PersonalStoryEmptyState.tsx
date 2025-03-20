
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookMarked, Plus, Quote, ArrowRight } from "lucide-react";

interface PersonalStoryEmptyStateProps {
  onCreateStory: () => void;
}

export const PersonalStoryEmptyState: React.FC<PersonalStoryEmptyStateProps> = ({ 
  onCreateStory 
}) => {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <BookMarked className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-xl">Your Personal Stories Library</CardTitle>
        <CardDescription>
          Store, organize, and utilize your personal anecdotes in your content
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col items-center p-4 border rounded-lg bg-card">
            <Quote className="h-10 w-10 text-primary/60 mb-2" />
            <h3 className="font-medium">Authentic Content</h3>
            <p className="text-sm text-muted-foreground">Add personal experiences that resonate with your audience</p>
          </div>
          
          <div className="flex flex-col items-center p-4 border rounded-lg bg-card">
            <ArrowRight className="h-10 w-10 text-primary/60 mb-2" />
            <h3 className="font-medium">Guided Generation</h3>
            <p className="text-sm text-muted-foreground">Add stories to AI-generated content for personal touches</p>
          </div>
          
          <div className="flex flex-col items-center p-4 border rounded-lg bg-card">
            <BookMarked className="h-10 w-10 text-primary/60 mb-2" />
            <h3 className="font-medium">Organized Library</h3>
            <p className="text-sm text-muted-foreground">Categorize stories with tags, pillars, and audience relevance</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button size="lg" onClick={onCreateStory}>
          <Plus className="mr-2 h-4 w-4" />
          Create Your First Story
        </Button>
      </CardFooter>
    </Card>
  );
};
