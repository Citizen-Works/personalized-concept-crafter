
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { 
  ContentStatus, 
  DraftStatus,
  getContentStatusClasses,
  getDraftStatusClasses,
  getContentStatusProps,
  getDraftStatusProps
} from '@/types/status';
import { ContentType, ContentSource } from '@/types';

interface StatusBadgeProps {
  status: ContentStatus | DraftStatus;
  type: 'content' | 'draft';
  className?: string;
}

/**
 * Reusable status badge component that works with both content and draft statuses
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  type,
  className = '' 
}) => {
  const getClasses = () => {
    if (type === 'content') {
      return getContentStatusClasses(status as ContentStatus);
    } else {
      return getDraftStatusClasses(status as DraftStatus);
    }
  };

  const getLabel = () => {
    if (type === 'content') {
      return getContentStatusProps(status as ContentStatus).label;
    } else {
      return getDraftStatusProps(status as DraftStatus).label;
    }
  };

  return (
    <Badge className={`${getClasses()} ${className}`}>
      {getLabel()}
    </Badge>
  );
};

/**
 * Helper functions for other badge types (keeping existing functionality)
 */
export const getTypeBadgeClasses = (type: ContentType | null): string => {
  if (!type) return 'bg-gray-50 text-gray-700 border-gray-200';
  
  switch (type) {
    case 'linkedin':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'newsletter':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'marketing':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export const getSourceBadgeClasses = (source: ContentSource): string => {
  switch (source) {
    case 'meeting':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'manual':
      return 'bg-teal-50 text-teal-700 border-teal-200';
    case 'transcript':
      return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'ai':
      return 'bg-violet-50 text-violet-700 border-violet-200';
    case 'other':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

/**
 * Type badge component
 */
export const TypeBadge: React.FC<{ type: ContentType | null; className?: string }> = ({ 
  type, 
  className = '' 
}) => {
  return (
    <Badge className={`${getTypeBadgeClasses(type)} ${className}`}>
      {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'No Type'}
    </Badge>
  );
};

/**
 * Source badge component
 */
export const SourceBadge: React.FC<{ source: ContentSource; className?: string }> = ({ 
  source, 
  className = '' 
}) => {
  return (
    <Badge className={`${getSourceBadgeClasses(source)} ${className}`}>
      {source.charAt(0).toUpperCase() + source.slice(1)}
    </Badge>
  );
};
