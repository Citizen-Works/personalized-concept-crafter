
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, LinkedinIcon } from 'lucide-react';

const LinkedinPostsPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">LinkedIn Posts</h1>
        <p className="text-muted-foreground">
          Manage your LinkedIn content
        </p>
      </div>

      <div className="flex justify-end">
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          Add LinkedIn Post
        </Button>
      </div>
      
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10">
        <LinkedinIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Connect LinkedIn Account</h3>
        <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-md">
          Connect your LinkedIn account to import past posts and use them to train the AI for better content generation.
        </p>
        <Button className="gap-1">
          Connect LinkedIn
        </Button>
      </div>
    </div>
  );
};

export default LinkedinPostsPage;
