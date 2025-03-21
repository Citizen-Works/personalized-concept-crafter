
import React from 'react';

interface TabCountBadgeProps {
  count: number;
}

const TabCountBadge: React.FC<TabCountBadgeProps> = ({ count }) => {
  return (
    <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
      {count}
    </span>
  );
};

export default TabCountBadge;
