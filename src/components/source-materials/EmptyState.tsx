
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Files, Plus, FileUp } from "lucide-react";

interface EmptyStateProps {
  onOpenUpload: () => void;
  onOpenAddText: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onOpenUpload,
  onOpenAddText,
}) => {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Files className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-xl">Your Source Materials Library</CardTitle>
        <CardDescription>
          Store, organize, and extract content ideas from your source materials
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col items-center p-4 border rounded-lg bg-card">
            <Upload className="h-10 w-10 text-primary/60 mb-2" />
            <h3 className="font-medium">Upload Files</h3>
            <p className="text-sm text-muted-foreground">
              Upload documents, meeting transcripts, and other text files
            </p>
          </div>

          <div className="flex flex-col items-center p-4 border rounded-lg bg-card">
            <FileText className="h-10 w-10 text-primary/60 mb-2" />
            <h3 className="font-medium">Add Text</h3>
            <p className="text-sm text-muted-foreground">
              Paste or type text content directly into your library
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        <Button variant="outline" onClick={onOpenAddText}>
          <FileText className="mr-2 h-4 w-4" />
          Add Text
        </Button>
        <Button onClick={onOpenUpload}>
          <FileUp className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </CardFooter>
    </Card>
  );
};
