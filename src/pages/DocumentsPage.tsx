
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Upload } from 'lucide-react';

const DocumentsPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground">
          Manage your content documents and writing samples
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" className="gap-1">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          Create Document
        </Button>
      </div>
      
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No Documents Yet</h3>
        <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-md">
          Upload writing samples, articles, or other documents to help the AI understand your writing style.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            Create Document
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
