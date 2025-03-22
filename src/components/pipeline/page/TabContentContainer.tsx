
import React from 'react';
import { MobileActionButton } from './MobileActionButton';

interface TabContentContainerProps {
  children: React.ReactNode;
}

export const TabContentContainer: React.FC<TabContentContainerProps> = ({ children }) => {
  return (
    <div className="w-full relative">
      {children}
      <MobileActionButton />
    </div>
  );
};
