
import React from 'react';
import { Input } from "@/components/ui/input";

interface IdeasSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const IdeasSearch: React.FC<IdeasSearchProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="flex-1 max-w-md">
      <Input
        placeholder="Search ideas..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />
    </div>
  );
};

export default IdeasSearch;
