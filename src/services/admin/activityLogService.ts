
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdminActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: any;
  ip_address: string | null;
  created_at: string;
  user?: {
    email: string;
    name: string;
  };
}

export async function fetchAdminActivityLogs(limit = 50): Promise<AdminActivityLog[]> {
  try {
    // Use proper table name from the migration
    const { data, error } = await supabase
      .from('admin_activity_logs')
      .select(`
        *,
        user:profiles!admin_activity_logs_user_id_fkey(
          email:id,
          name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    // Format the user data
    return data.map(log => ({
      ...log,
      user: {
        email: log.user?.email || 'Unknown',
        name: log.user?.name || 'Unknown'
      }
    })) as AdminActivityLog[];
  } catch (error) {
    console.error('Error fetching admin activity logs:', error);
    toast.error('Failed to load activity logs');
    return [];
  }
}

export async function fetchAdminActivityLogsByEntity(entityType: string, entityId: string): Promise<AdminActivityLog[]> {
  try {
    const { data, error } = await supabase
      .from('admin_activity_logs')
      .select(`
        *,
        user:profiles!admin_activity_logs_user_id_fkey(
          email:id,
          name
        )
      `)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Format the user data
    return data.map(log => ({
      ...log,
      user: {
        email: log.user?.email || 'Unknown',
        name: log.user?.name || 'Unknown'
      }
    })) as AdminActivityLog[];
  } catch (error) {
    console.error('Error fetching entity activity logs:', error);
    toast.error('Failed to load activity logs');
    return [];
  }
}
