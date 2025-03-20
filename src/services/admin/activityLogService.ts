
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
    // First, get activity logs
    const { data, error } = await supabase
      .from('admin_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    // Then fetch user details for each unique user_id
    const userIds = [...new Set(data.map(log => log.user_id))];
    const userDetailsPromises = userIds.map(userId => 
      supabase
        .from('profiles')
        .select('id, name')
        .eq('id', userId)
        .single()
    );
    
    const userResponses = await Promise.all(userDetailsPromises);
    
    // Create a map of user details
    const userMap = new Map();
    userResponses.forEach(response => {
      if (!response.error && response.data) {
        userMap.set(response.data.id, {
          email: response.data.id,  // Using ID as email since we don't have direct email access
          name: response.data.name || 'Unknown'
        });
      }
    });
    
    // Attach user details to logs
    return data.map(log => ({
      ...log,
      user: userMap.get(log.user_id) || {
        email: log.user_id,
        name: 'Unknown'
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
    // First, get activity logs
    const { data, error } = await supabase
      .from('admin_activity_logs')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Then fetch user details for each unique user_id
    const userIds = [...new Set(data.map(log => log.user_id))];
    const userDetailsPromises = userIds.map(userId => 
      supabase
        .from('profiles')
        .select('id, name')
        .eq('id', userId)
        .single()
    );
    
    const userResponses = await Promise.all(userDetailsPromises);
    
    // Create a map of user details
    const userMap = new Map();
    userResponses.forEach(response => {
      if (!response.error && response.data) {
        userMap.set(response.data.id, {
          email: response.data.id,  // Using ID as email since we don't have direct email access
          name: response.data.name || 'Unknown'
        });
      }
    });
    
    // Attach user details to logs
    return data.map(log => ({
      ...log,
      user: userMap.get(log.user_id) || {
        email: log.user_id,
        name: 'Unknown'
      }
    })) as AdminActivityLog[];
  } catch (error) {
    console.error('Error fetching entity activity logs:', error);
    toast.error('Failed to load activity logs');
    return [];
  }
}
