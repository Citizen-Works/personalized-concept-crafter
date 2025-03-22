
import React from 'react';
import { ResponsiveText } from '@/components/ui/responsive-text';

export const PageHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <ResponsiveText
        as="h1"
        mobileClasses="text-2xl font-bold tracking-tight"
        desktopClasses="text-3xl font-bold tracking-tight"
      >
        Content Pipeline
      </ResponsiveText>
      <p className="text-muted-foreground">
        Manage your content through its entire lifecycle
      </p>
    </div>
  );
};
