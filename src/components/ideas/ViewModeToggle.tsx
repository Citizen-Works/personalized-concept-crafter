
import React from 'react';
import { Button } from "@/components/ui/button";
import { ListFilter, KanbanSquare } from 'lucide-react';

interface ViewModeToggleProps {
  viewMode: 'list' | 'kanban';
  setViewMode: (mode: 'list' | 'kanban') => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex items-center space-x-2 border rounded-md p-1">
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        className="h-8 px-2"
        onClick={() => setViewMode('list')}
      >
        <ListFilter className="h-4 w-4 mr-1" />
        List
      </Button>
      <Button
        variant={viewMode === 'kanban' ? 'default' : 'ghost'}
        size="sm"
        className="h-8 px-2"
        onClick={() => setViewMode('kanban')}
      >
        <KanbanSquare className="h-4 w-4 mr-1" />
        Kanban
      </Button>
    </div>
  );
};

export default ViewModeToggle;
