
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Clock, 
  FileEdit, 
  Archive,
  ChevronDown
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DraftStatus = 'draft' | 'published' | 'archived';

type DraftStatusToggleProps = {
  status: DraftStatus;
  onStatusChange: (status: DraftStatus) => Promise<void>;
};

export const DraftStatusToggle: React.FC<DraftStatusToggleProps> = ({
  status,
  onStatusChange
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'published':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'archived':
        return <Archive className="h-4 w-4 text-gray-500" />;
      case 'draft':
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'published':
        return 'Published';
      case 'archived':
        return 'Archived';
      case 'draft':
      default:
        return 'Draft';
    }
  };
  
  const getStatusColor = () => {
    switch (status) {
      case 'published':
        return 'border-green-200 bg-green-50 text-green-700';
      case 'archived':
        return 'border-gray-200 bg-gray-50 text-gray-700';
      case 'draft':
      default:
        return 'border-blue-200 bg-blue-50 text-blue-700';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`gap-1 ${getStatusColor()}`}
        >
          {getStatusIcon()} 
          {getStatusText()}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0">
        <div className="flex flex-col">
          <Button 
            variant="ghost" 
            className="justify-start gap-2 rounded-none"
            onClick={() => onStatusChange('draft')}
            disabled={status === 'draft'}
          >
            <Clock className="h-4 w-4 text-blue-500" />
            <span>Draft</span>
          </Button>
          <Button 
            variant="ghost" 
            className="justify-start gap-2 rounded-none"
            onClick={() => onStatusChange('published')}
            disabled={status === 'published'}
          >
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Published</span>
          </Button>
          <Button 
            variant="ghost" 
            className="justify-start gap-2 rounded-none"
            onClick={() => onStatusChange('archived')}
            disabled={status === 'archived'}
          >
            <Archive className="h-4 w-4 text-gray-500" />
            <span>Archived</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
