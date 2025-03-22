
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, CheckCircle } from 'lucide-react';

interface GeneratedContentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onClear: () => void;
  onRegenerate: () => void;
  onSaveAsDraft: () => void;
}

const GeneratedContentEditor: React.FC<GeneratedContentEditorProps> = ({
  content,
  onContentChange,
  onClear,
  onRegenerate,
  onSaveAsDraft
}) => {
  return (
    <>
      <Textarea 
        value={content} 
        onChange={(e) => onContentChange(e.target.value)}
        className="min-h-[300px]"
        placeholder="Generated content will appear here"
      />
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onClear}
          className="flex-1"
        >
          Clear
        </Button>
        <Button 
          onClick={onRegenerate}
          variant="outline"
          className="flex-1"
        >
          <Lightbulb className="mr-2 h-4 w-4" />
          Regenerate
        </Button>
        <Button 
          onClick={onSaveAsDraft}
          className="flex-1"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Save as Draft
        </Button>
      </div>
    </>
  );
};

export default GeneratedContentEditor;
