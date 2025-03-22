
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CallToActionBadgeProps {
  callToAction: string | null;
}

const CallToActionBadge: React.FC<CallToActionBadgeProps> = ({ callToAction }) => {
  if (!callToAction) return null;
  
  return (
    <div className="mb-4">
      <Badge variant="outline" className="bg-secondary/10 text-secondary hover:bg-secondary/20">
        CTA: {callToAction}
      </Badge>
    </div>
  );
};

export default CallToActionBadge;
