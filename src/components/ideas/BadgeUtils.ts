
import { ContentStatus, ContentType } from '@/types';

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

export const getTypeBadgeClasses = (type: ContentType): string => {
  switch (type) {
    case 'linkedin':
      return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'newsletter':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'marketing':
      return 'bg-rose-50 text-rose-700 border-rose-200';
  }
};
