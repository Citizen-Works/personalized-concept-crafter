import { ContentStatus, ContentType, ContentSource, DraftStatus } from '@/types';

export const getStatusBadgeClasses = (status: ContentStatus): string => {
  switch (status) {
    case 'unreviewed':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'approved':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'rejected':
      return 'bg-gray-50 text-gray-700 border-gray-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export const getDraftStatusBadgeClasses = (status: DraftStatus): string => {
  switch (status) {
    case 'draft':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
    case 'ready':
      return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800';
    case 'published':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800';
    case 'archived':
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800';
  }
};

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

export const getStatusBadgeProps = (status: ContentStatus) => {
  return {
    className: getStatusBadgeClasses(status),
    children: status.charAt(0).toUpperCase() + status.slice(1)
  };
};

export const getDraftStatusBadgeProps = (status: DraftStatus) => {
  return {
    className: getDraftStatusBadgeClasses(status),
    children: status.charAt(0).toUpperCase() + status.slice(1)
  };
};

export const getContentTypeBadgeProps = (contentType?: ContentType) => {
  return {
    className: getTypeBadgeClasses(contentType || null),
    children: contentType ? contentType.charAt(0).toUpperCase() + contentType.slice(1) : 'No Type'
  };
};
