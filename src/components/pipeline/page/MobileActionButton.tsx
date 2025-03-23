
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const MobileActionButton: React.FC = () => {
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  return (
    <Button
      asChild
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90"
    >
      <Link to="/ideas/new">
        <Plus className="h-6 w-6" />
        <span className="sr-only">Add new content idea</span>
      </Link>
    </Button>
  );
};
