
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "sonner";

type UserRole = 'admin' | 'user';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Alias for signOut for backward compatibility
  refreshAdminStatus: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if current user has admin role
  const checkUserRole = async (userId: string) => {
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
  };

  // Explicitly refresh admin status - useful after role changes
  const refreshAdminStatus = async () => {
    if (!user) return false;
    const isUserAdmin = await checkUserRole(user.id);
    setIsAdmin(isUserAdmin);
    return isUserAdmin;
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkUserRole(session.user.id);
      }
      
      setLoading(false);
      
      // Only redirect to dashboard if on login page and already logged in
      // We've removed the root path (/) from this condition to allow the waitlist page to be accessible
      if (session && location.pathname === '/login') {
        navigate('/dashboard');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          checkUserRole(session.user.id);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
        
        // Only redirect to dashboard when signed in from auth pages
        // We've removed the root path (/) from this condition
        if (event === 'SIGNED_IN' && (location.pathname === '/login' || location.pathname === '/register')) {
          navigate('/dashboard');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }

      // Navigate is not needed here as the onAuthStateChange will handle it
      toast.success('Signed in successfully');
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
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
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        throw error;
      }

      navigate('/login');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      isAdmin,
      refreshAdminStatus,
      signIn, 
      signInWithGoogle,
      signUp, 
      signOut,
      logout: signOut // Alias for backward compatibility
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
