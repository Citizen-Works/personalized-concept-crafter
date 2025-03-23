
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const DocumentsLoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-[220px] rounded-lg" />
      ))}
    </div>
  );
};

export default DocumentsLoadingSkeleton;
