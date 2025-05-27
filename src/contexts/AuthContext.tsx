
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored demo session first
    const checkStoredSession = () => {
      const storedUser = localStorage.getItem('demo_user_session');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('Found stored demo session for:', parsedUser.email);
          setUser(parsedUser);
          setLoading(false);
          return true;
        } catch (error) {
          console.error('Error parsing stored session:', error);
          localStorage.removeItem('demo_user_session');
        }
      }
      return false;
    };

    // If we found a stored session, don't check Supabase
    if (checkStoredSession()) {
      return;
    }

    // Get initial session from Supabase
    const getInitialSession = async () => {
      console.log('Getting initial session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('Initial session:', session, 'Error:', error);
      
      if (session?.user) {
        console.log('Found existing session for:', session.user.email);
        await fetchUserProfile(session.user);
      } else {
        console.log('No existing session found');
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in:', session.user.email);
        await fetchUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
        localStorage.removeItem('demo_user_session');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: SupabaseUser) => {
    try {
      console.log('Fetching profile for user:', authUser.email);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', authUser.email)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // For demo purposes, create a mock user if profile doesn't exist
        if (authUser.email === 'admin@jalnet.gov.in' || authUser.email === 'worker@jalnet.gov.in') {
          const mockUser: User = {
            id: authUser.id,
            email: authUser.email,
            full_name: authUser.email === 'admin@jalnet.gov.in' ? 'Admin User' : 'Worker User',
            role: authUser.email === 'admin@jalnet.gov.in' ? 'admin' : 'worker',
            employee_id: authUser.email === 'admin@jalnet.gov.in' ? 'ADM001' : 'WRK001',
            phone: '+91-413-2200-100',
            assigned_city: 'Pondicherry',
            assigned_area: 'Muthialpet',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          console.log('Created mock user:', mockUser);
          setUser(mockUser);
          localStorage.setItem('demo_user_session', JSON.stringify(mockUser));
        }
        return;
      }

      if (profile) {
        console.log('Profile found:', profile);
        setUser(profile as User);
        localStorage.setItem('demo_user_session', JSON.stringify(profile));
      } else {
        console.log('No profile found for user');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);
      
      // For demo purposes, allow specific demo credentials
      if ((email === 'admin@jalnet.gov.in' || email === 'worker@jalnet.gov.in') && password === 'jalnet123') {
        console.log('Using demo login for:', email);
        
        // Create a mock auth session for demo
        const mockUser: User = {
          id: email === 'admin@jalnet.gov.in' ? 'admin-id' : 'worker-id',
          email: email,
          full_name: email === 'admin@jalnet.gov.in' ? 'Admin User' : 'Worker User',
          role: email === 'admin@jalnet.gov.in' ? 'admin' : 'worker',
          employee_id: email === 'admin@jalnet.gov.in' ? 'ADM001' : 'WRK001',
          phone: '+91-413-2200-100',
          assigned_city: 'Pondicherry',
          assigned_area: 'Muthialpet',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setUser(mockUser);
        localStorage.setItem('demo_user_session', JSON.stringify(mockUser));
        console.log('Demo login successful for:', email);
        return true;
      }

      // Try regular Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      console.log('Login successful:', data.user?.email);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Clear the demo user session from localStorage
      localStorage.removeItem('demo_user_session');
      setUser(null);
      
      // Then try to sign out from Supabase (if there's a real session)
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
