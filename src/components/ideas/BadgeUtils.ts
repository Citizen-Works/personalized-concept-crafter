import { ContentStatus, ContentType, ContentSource } from '@/types/content';

export const getStatusBadgeClasses = (status: ContentStatus): string => {
  switch (status) {
    case 'unreviewed':
      return 'bg-gray-50 text-gray-700 border-gray-200';
    case 'approved':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'drafted':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'ready':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'published':
      return 'bg-amber-50 text-amber-700 border-amber-200';
  }
};

export const getTypeBadgeClasses = (type: ContentType | null): string => {
  if (!type) return 'bg-gray-50 text-gray-700 border-gray-200';
  
  switch (type) {
    case 'linkedin':
      return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'newsletter':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'marketing':
      return 'bg-rose-50 text-rose-700 border-rose-200';
  }
};

export const getSourceBadgeClasses = (source: ContentSource | null): string => {
  if (!source) return 'bg-gray-50 text-gray-700 border-gray-200';
  
  switch (source) {
    case 'meeting':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'transcript':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'manual':
      return 'bg-teal-50 text-teal-700 border-teal-200';
    case 'other':
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export const getStatusBadgeProps = (status: ContentStatus) => {
  return {
    variant: 'outline' as const,
    className: getStatusBadgeClasses(status),
    children: status.charAt(0).toUpperCase() + status.slice(1)
  };
};

export const getContentTypeBadgeProps = (contentType: ContentType | null) => {
  return {
    variant: 'outline' as const,
    className: getTypeBadgeClasses(contentType),
    children: contentType ? (contentType.charAt(0).toUpperCase() + contentType.slice(1)) : 'None'
  };
};

export const getSourceBadgeProps = (source: ContentSource | null) => {
  return {
    variant: 'outline' as const,
    className: getSourceBadgeClasses(source),
    children: source ? (source.charAt(0).toUpperCase() + source.slice(1)) : 'None'
  };
};
