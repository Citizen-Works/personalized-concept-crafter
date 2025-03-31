import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { processDocumentForIdeas } from '@/utils/documentProcessing';
import { handleApiError } from '@/utils/errorHandling';
import { Database } from '@/types/database';

type DocumentCreateInput = Database['public']['Tables']['documents']['Insert'];
type DocumentType = Database['public']['Tables']['documents']['Row']['type'];
type DocumentStatus = Database['public']['Tables']['documents']['Row']['status'];
type DocumentPurpose = Database['public']['Tables']['documents']['Row']['purpose'];
type DocumentContentType = Database['public']['Tables']['documents']['Row']['content_type'];
type WebhookConfig = Database['public']['Tables']['webhook_configurations']['Row'];

/**
 * This service handles incoming webhooks for transcripts
 * from services like Otter.ai, Fathom, Read.AI, etc.
 */

interface WebhookPayload {
  transcript: string;
  title: string;
  userId?: string;
  webhookId?: string;
}

const validateWebhookPayload = (payload: unknown): payload is WebhookPayload => {
  if (!payload || typeof payload !== 'object') return false;
  const p = payload as Record<string, unknown>;
  return (
    typeof p.transcript === 'string' &&
    typeof p.title === 'string' &&
    (!p.userId || typeof p.userId === 'string') &&
    (!p.webhookId || typeof p.webhookId === 'string')
  );
};

const isWebhookConfig = (config: unknown): config is WebhookConfig => {
  if (!config || typeof config !== 'object') return false;
  const c = config as Record<string, unknown>;
  return (
    typeof c.id === 'string' &&
    typeof c.user_id === 'string' &&
    typeof c.service_name === 'string' &&
    typeof c.is_active === 'boolean' &&
    typeof c.created_at === 'string'
  );
};

/**
 * Processes an incoming webhook by:
 * 1. Saving the transcript to the database
 * 2. Triggering content idea generation
 */
export const processTranscriptWebhook = async (payload: unknown): Promise<void> => {
  try {
    if (!validateWebhookPayload(payload)) {
      throw new Error('Invalid webhook payload');
    }

    const { transcript, title, userId, webhookId } = payload;

    // If no userId is provided, try to get it from the webhook configuration
    let resolvedUserId = userId;
    if (!resolvedUserId && webhookId) {
      const { data: webhookConfigs } = await supabase.from('webhook_configurations').select('*');
      if (!webhookConfigs) throw new Error('Failed to fetch webhook configurations');
      
      const matchingConfig = webhookConfigs.find(config => {
        if (isWebhookConfig(config)) {
          const { id } = config as { id?: unknown };
          return id === webhookId;
        }
        return false;
      });

      if (!matchingConfig) throw new Error('Webhook configuration not found');
      const { user_id } = matchingConfig as { user_id?: unknown };
      if (typeof user_id !== 'string') throw new Error('Invalid webhook configuration');
      resolvedUserId = user_id;
    }

    if (!resolvedUserId) {
      throw new Error('No user ID provided and could not resolve from webhook configuration');
    }

    // Save the transcript to the database
    const document: DocumentCreateInput = {
      user_id: resolvedUserId,
      title,
      content: transcript,
      type: 'transcript' as DocumentType,
      purpose: 'content_idea' as DocumentPurpose,
      status: 'active' as DocumentStatus,
      content_type: 'general' as DocumentContentType,
      processing_status: 'idle',
      has_ideas: false,
      ideas_count: 0,
    };

    const { data: savedDocument, error } = await supabase.from('documents').insert(document).select().single();
    if (error || !savedDocument) throw new Error('Failed to save document');

    // Process the transcript for ideas in the background
    processDocumentForIdeas(savedDocument.id, resolvedUserId).catch((error) => {
      console.error('Error processing document for ideas:', error);
      // Update document status to failed
      supabase.from('documents')
        .update({ processing_status: 'failed' })
        .eq('id', savedDocument.id)
        .then(({ error: updateError }) => {
          if (updateError) console.error('Error updating document status:', updateError);
        });
    });
  } catch (error) {
    throw handleApiError(error);
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
      transcript: `This is a test transcript.
      
      We're testing the automatic processing of transcripts via webhooks.
      
      Let's discuss some marketing ideas for our business:
      
      1. We should consider creating more video content for social media.
      2. Our target audience seems to respond well to case studies.
      3. The automation solution we've built could be showcased more prominently.
      4. We need to highlight the ROI that customers are getting.
      
      The key metrics from last quarter showed a 27% increase in engagement when we used customer testimonials.
      
      Let's develop a content strategy around these insights and implement it next month.`,
      title: 'Test Transcript - ' + new Date().toLocaleString(),
      userId: userId
    };
    
    await processTranscriptWebhook(samplePayload);
    
    toast.success('Test webhook processed successfully');
    
    return {
      success: true,
      message: 'Test webhook processed successfully'
    };
  } catch (error) {
    console.error('Error testing webhook flow:', error);
    toast.error('Error testing webhook flow');
    return {
      success: false,
      message: 'Error testing webhook flow: ' + (error instanceof Error ? error.message : String(error))
    };
  }
};
