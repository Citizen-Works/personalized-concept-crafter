
import { LinkedinPost } from '@/types';
import { processApiResponse } from '@/utils/apiResponseUtils';

/**
 * Transforms Supabase response data into a LinkedinPost object
 */
export const transformToLinkedinPost = (data: any): LinkedinPost => {
  const transformedData = processApiResponse(data);
  
  return {
    id: transformedData.id,
    userId: transformedData.userId,
    content: transformedData.content,
    url: transformedData.url || '',
    publishedAt: transformedData.publishedAt ? new Date(transformedData.publishedAt) : undefined,
    createdAt: new Date(transformedData.createdAt),
    tag: transformedData.tag || 'My post'
  } as LinkedinPost;
};
