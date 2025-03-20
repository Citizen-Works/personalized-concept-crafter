
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { processTranscriptForIdeas } from '../documents/transcript/processTranscript';
import { DocumentCreateInput, DocumentType, DocumentStatus, DocumentPurpose, DocumentContentType } from '@/types';

/**
 * This service handles incoming webhooks for transcripts
 * from services like Otter.ai, Fathom, Read.AI, etc.
 */

export interface WebhookPayload {
  service: string;
  title?: string;
  content: string;
  userId?: string;
  metadata?: Record<string, any>;
}

/**
 * Validates webhook payloads to ensure they have the required fields
 */
const validateWebhookPayload = (payload: any): payload is WebhookPayload => {
  return (
    payload &&
    typeof payload === 'object' &&
    typeof payload.service === 'string' &&
    typeof payload.content === 'string' &&
    payload.content.trim() !== ''
  );
};

/**
 * Processes an incoming webhook by:
 * 1. Saving the transcript to the database
 * 2. Triggering content idea generation
 */
export const processTranscriptWebhook = async (payload: WebhookPayload): Promise<{
  success: boolean;
  message: string;
  documentId?: string;
}> => {
  console.log('Processing transcript webhook:', payload.service);
  
  if (!validateWebhookPayload(payload)) {
    return { 
      success: false, 
      message: 'Invalid webhook payload' 
    };
  }
  
  try {
    // 1. Determine the user ID
    let userId = payload.userId;
    
    // If no userId is provided, try to find a webhook configuration for this service
    if (!userId) {
      const { data: webhookConfig, error: configError } = await supabase
        .from('webhook_configurations')
        .select('user_id')
        .eq('service_name', payload.service)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (configError || !webhookConfig) {
        console.error('Failed to find webhook configuration:', configError);
        return { 
          success: false, 
          message: 'No user ID found for this webhook service' 
        };
      }
      
      userId = webhookConfig.user_id;
    }
    
    if (!userId) {
      return { 
        success: false, 
        message: 'Could not determine user ID for webhook' 
      };
    }
    
    // 2. Save the transcript as a document
    const documentData: DocumentCreateInput = {
      title: payload.title || `Transcript from ${payload.service} - ${new Date().toLocaleString()}`,
      content: payload.content,
      type: 'transcript' as DocumentType,
      purpose: 'writing_sample' as DocumentPurpose,
      status: 'active' as DocumentStatus,
      content_type: null as DocumentContentType
    };
    
    const { data: document, error: documentError } = await supabase
      .from('documents')
      .insert({
        user_id: userId,
        title: documentData.title,
        content: documentData.content,
        type: documentData.type,
        purpose: documentData.purpose,
        status: documentData.status,
        content_type: documentData.content_type,
        created_at: new Date().toISOString(),
        processing_status: 'idle'
      })
      .select()
      .single();
    
    if (documentError || !document) {
      console.error('Failed to save transcript document:', documentError);
      return { 
        success: false, 
        message: 'Failed to save transcript' 
      };
    }
    
    // 3. Process the transcript for ideas (in background mode)
    console.log('Starting background processing for document:', document.id);
    processTranscriptForIdeas(userId, document.id, true)
      .then(result => {
        console.log('Background processing complete:', result);
      })
      .catch(error => {
        console.error('Background processing failed:', error);
      });
    
    return { 
      success: true, 
      message: 'Transcript received and processing started', 
      documentId: document.id 
    };
  } catch (error) {
    console.error('Error processing transcript webhook:', error);
    return { 
      success: false, 
      message: 'Internal server error processing webhook' 
    };
  }
};

/**
 * Test the webhook processing flow with a sample transcript
 */
export const testWebhookFlow = async (userId: string): Promise<{
  success: boolean;
  message: string;
  documentId?: string;
}> => {
  try {
    const samplePayload: WebhookPayload = {
      service: 'test_service',
      title: 'Test Transcript - ' + new Date().toLocaleString(),
      content: `This is a test transcript.
      
      We're testing the automatic processing of transcripts via webhooks.
      
      Let's discuss some marketing ideas for our business:
      
      1. We should consider creating more video content for social media.
      2. Our target audience seems to respond well to case studies.
      3. The automation solution we've built could be showcased more prominently.
      4. We need to highlight the ROI that customers are getting.
      
      The key metrics from last quarter showed a 27% increase in engagement when we used customer testimonials.
      
      Let's develop a content strategy around these insights and implement it next month.`,
      userId: userId
    };
    
    const result = await processTranscriptWebhook(samplePayload);
    
    if (result.success) {
      toast.success('Test webhook processed successfully');
    } else {
      toast.error('Test webhook processing failed');
    }
    
    return result;
  } catch (error) {
    console.error('Error testing webhook flow:', error);
    toast.error('Error testing webhook flow');
    return {
      success: false,
      message: 'Error testing webhook flow: ' + (error instanceof Error ? error.message : String(error))
    };
  }
};
