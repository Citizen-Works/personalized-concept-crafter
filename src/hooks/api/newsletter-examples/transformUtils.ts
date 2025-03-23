
import { Document } from '@/types';
import { processApiResponse } from '@/utils/apiResponseUtils';

/**
 * Transforms Supabase response data into a Document object
 * specifically configured as a newsletter example
 */
export const transformToNewsletterExample = (data: any): Document => {
  const transformedData = processApiResponse(data);
  
  return {
    id: transformedData.id,
    userId: transformedData.userId,
    title: transformedData.title,
    content: transformedData.content || '',
    type: transformedData.type || 'other',
    purpose: 'writing_sample',
    content_type: 'newsletter',
    status: transformedData.status || 'active',
    createdAt: new Date(transformedData.createdAt),
    // Add other required Document fields with defaults
    fileUrl: '',
    fileType: '',
    fileName: '',
    fileSize: 0,
    metadata: {},
    isArchived: false,
    isEncrypted: false,
    processing_status: 'idle',
    has_ideas: false,
    ideas_count: 0
  } as Document;
};
