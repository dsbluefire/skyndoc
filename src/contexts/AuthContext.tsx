import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import {
  supabase,
  signIn as signInApi,
  signUp as signUpApi,
  signOut as signOutApi,
  signInWithGoogle as signInWithGoogleApi,
  getSession,
  SignUpData,
  SignInData,
} from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (data: SignInData) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    getSession().then((session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    if (supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);

        // Handle specific events
        if (event === 'SIGNED_IN') {
          console.log('User signed in:', session?.user?.email);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          // Don't clear cart - it will be synced when user logs back in
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const signIn = async (data: SignInData) => {
    try {
      setLoading(true);
      const result = await signInApi(data);
      
      if (result.success && result.user) {
        setUser(result.user);
        setSession(result.session ?? null);
      }
      
      return { success: result.success, error: result.error };
    } catch (error) {
      return { success: false, error: 'Failed to sign in' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      setLoading(true);
      const result = await signUpApi(data);
      
      if (result.success && result.user) {
        setUser(result.user);
        setSession(result.session ?? null);
      }
      
      return { success: result.success, error: result.error };
    } catch (error) {
      return { success: false, error: 'Failed to sign up' };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithGoogleApi();
      return { success: result.success, error: result.error };
    } catch (error) {
      return { success: false, error: 'Failed to sign in with Google' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await signOutApi();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
