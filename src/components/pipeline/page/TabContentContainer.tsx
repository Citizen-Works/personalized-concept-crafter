
import React from 'react';

interface TabContentContainerProps {
  children: React.ReactNode;
}

export const TabContentContainer: React.FC<TabContentContainerProps> = ({ children }) => {
  return (
    <div className="w-full">
      {children}
    </div>
  );
};
