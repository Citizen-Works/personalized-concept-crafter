
import { Document } from '@/types';
import { processApiResponse } from '@/utils/apiResponseUtils';

/**
 * Transforms Supabase response data into a Document object
 */
export const transformToDocument = (data: any): Document => {
  const transformedData = processApiResponse(data);
  
  return {
    id: transformedData.id,
    userId: transformedData.userId,
    title: transformedData.title,
    content: transformedData.content || "",
    fileUrl: transformedData.fileUrl || "",
    fileType: transformedData.fileType || "",
    fileName: transformedData.fileName || "",
    fileSize: transformedData.fileSize || 0,
    metadata: transformedData.metadata || {},
    isArchived: transformedData.isArchived || false,
    createdAt: new Date(transformedData.createdAt)
  } as Document;
};
