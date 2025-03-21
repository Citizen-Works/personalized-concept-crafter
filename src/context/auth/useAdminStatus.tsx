
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
        console.log('Falling back to direct role query');
        // Fall back to direct query if RPC fails
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', userId)
          .eq('role', 'admin')
          .maybeSingle();
        
        if (error) {
          console.error('Error checking user role with direct query:', error);
          setIsAdmin(false);
          return false;
        }
        
        setIsAdmin(!!data);
        return !!data;
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      return false;
    }
  }, []);

  // Refresh the admin status - useful when roles might have changed
  const refreshAdminStatus = useCallback(async () => {
    if (!user) {
      setIsAdmin(false);
      return false;
    }
    
    return await checkUserRole(user.id);
  }, [user, checkUserRole]);

  return {
    isAdmin,
    checkUserRole,
    refreshAdminStatus
  };
}
