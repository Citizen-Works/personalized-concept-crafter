
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';

interface DocumentsEmptyResultsProps {
  resetFilters: () => void;
}

const DocumentsEmptyResults: React.FC<DocumentsEmptyResultsProps> = ({ resetFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-12 text-center border rounded-lg bg-muted/10">
      <Search className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No matching documents</h3>
      <p className="text-sm text-muted-foreground mt-2 mb-6">
        Try adjusting your search or filters to find what you're looking for.
      </p>
      <Button variant="outline" onClick={resetFilters}>
        Reset Filters
      </Button>
    </div>
  );
};

export default DocumentsEmptyResults;
