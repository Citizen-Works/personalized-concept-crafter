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
    isArchived: transformedData.isArchived || false,
    type: transformedData.type || "other", // Default values for required fields
    purpose: transformedData.purpose || "business_context",
    status: transformedData.status || "active",
    content_type: transformedData.contentType || null,
    createdAt: new Date(transformedData.createdAt),
    // Add other required Document fields
    isEncrypted: transformedData.isEncrypted || false,
    processing_status: transformedData.processingStatus || "idle",
    has_ideas: transformedData.hasIdeas || false,
    ideas_count: transformedData.ideasCount || 0
  } as Document;
};
