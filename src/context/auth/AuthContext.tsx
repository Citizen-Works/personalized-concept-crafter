
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminStatus } from './useAdminStatus';
import { useAuthOperations } from './useAuthOperations';

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
  
  // Extract admin status logic to separate hook
  const { isAdmin, checkUserRole, refreshAdminStatus } = useAdminStatus(user);
  
  // Extract auth operations to separate hook
  const { signIn, signInWithGoogle, signUp, signOut } = useAuthOperations({
    setLoading,
    navigate
  });

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
          // Reset admin status when user logs out
          setLoading(false);
        }
        
        // Only redirect to dashboard when signed in from auth pages
        if (event === 'SIGNED_IN' && (location.pathname === '/login' || location.pathname === '/register')) {
          navigate('/dashboard');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname, checkUserRole]);

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
