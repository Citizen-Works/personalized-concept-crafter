
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  userCount: number;
  contentIdeasCount: number;
  draftsCount: number;
  publishedCount: number;
  waitlistCount: number;
}

export async function fetchAdminStats(): Promise<AdminStats> {
  try {
    // Run these queries in parallel for efficiency
    const [
      userCountResult,
      contentIdeasCountResult,
      draftsCountResult,
      publishedCountResult,
      waitlistCountResult
    ] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('content_ideas').select('id', { count: 'exact', head: true }),
      supabase.from('content_drafts').select('id', { count: 'exact', head: true }),
      supabase.from('content_ideas').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('waitlist').select('id', { count: 'exact', head: true })
    ]);

    return {
      userCount: userCountResult.count || 0,
      contentIdeasCount: contentIdeasCountResult.count || 0,
      draftsCount: draftsCountResult.count || 0,
      publishedCount: publishedCountResult.count || 0,
      waitlistCount: waitlistCountResult.count || 0
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return {
      userCount: 0,
      contentIdeasCount: 0,
      draftsCount: 0,
      publishedCount: 0,
      waitlistCount: 0
    };
  }
}
