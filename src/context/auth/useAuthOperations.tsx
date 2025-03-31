import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NavigateFunction } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthOperationsProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: NavigateFunction;
}

export function useAuthOperations({ setLoading, navigate }: AuthOperationsProps) {
  
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      
      if (!supabase.auth) {
        throw new Error('Auth is not initialized');
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }

      // Navigate is not needed here as the onAuthStateChange will handle it
      toast.success('Signed in successfully');
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);

      if (!supabase.auth) {
        throw new Error('Auth is not initialized');
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      // No need to navigate here as the OAuth flow will handle the redirect
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign in with Google');
      setLoading(false);
      throw error;
    }
  }, [setLoading]);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    try {
      setLoading(true);

      if (!supabase.auth) {
        throw new Error('Auth is not initialized');
      }

      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }

      toast.success('Signup successful! Please check your email for verification.');
      navigate('/login');
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign up');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, navigate]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);

      if (!supabase.auth) {
        throw new Error('Auth is not initialized');
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        throw error;
      }

      navigate('/login');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign out');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, navigate]);

  return {
    signIn,
    signInWithGoogle,
    signUp, 
    signOut
  };
}
