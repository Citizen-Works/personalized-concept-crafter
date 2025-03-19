
import React from 'react';

export const SidebarLogo = () => {
  return (
    <div className="flex items-center space-x-2">
      <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
      <span className="text-xl font-bold">ContentCraft</span>
    </div>
  );
};

export default SidebarLogo;
