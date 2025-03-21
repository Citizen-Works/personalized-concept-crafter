
import { useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAdminStatus(user: User | null) {
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if current user has admin role
  const checkUserRole = useCallback(async (userId: string) => {
    try {
      // First try the has_role RPC function
      try {
        const { data, error } = await supabase.rpc('has_role', { _role: 'admin' });
        
        if (error) {
          console.error('Error checking user role with RPC:', error);
          // Fall back to direct query if RPC fails
          throw error;
        }
        
        setIsAdmin(!!data);
        return !!data;
      } catch (rpcError) {
        console.log('Falling back to direct query for role check');
        // If RPC fails, directly query the user_roles table
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('role', 'admin')
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" which is fine
          console.error('Error checking user role with direct query:', error);
          return false;
        }
        
        setIsAdmin(!!data);
        return !!data;
      }
    } catch (error) {
      console.error('Error in checkUserRole:', error);
      return false;
    }
  }, []);

  // Explicitly refresh admin status - useful after role changes
  const refreshAdminStatus = useCallback(async () => {
    if (!user) return false;
    const isUserAdmin = await checkUserRole(user.id);
    setIsAdmin(isUserAdmin);
    return isUserAdmin;
  }, [user, checkUserRole]);

  return {
    isAdmin,
    checkUserRole,
    refreshAdminStatus
  };
}
