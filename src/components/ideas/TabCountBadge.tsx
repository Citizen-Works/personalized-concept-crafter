
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface TabCountBadgeProps {
  count: number;
}

const TabCountBadge: React.FC<TabCountBadgeProps> = ({ count }) => {
  return (
    <Badge 
      variant="default" 
      className="ml-1 h-5 w-5 justify-center rounded-full bg-primary/10 text-xs font-medium text-primary"
    >
      {count}
    </Badge>
  );
};

export default TabCountBadge;
