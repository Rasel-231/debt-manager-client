'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = useCallback(async (): Promise<User | null> => {
    try {
      const res = await apiClient.get<{ user: User }>('/auth/me');
      return res.data.user;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const profile = await fetchProfile();
      if (mounted) {
        setUser(profile);
        setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [fetchProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiClient.post<{ user: User }>('/auth/login', {
      email,
      password,
    });
    setUser(res.data.user);
    router.replace('/home');
  }, [router]);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await apiClient.post<{ user: User }>('/auth/register', {
        name,
        email,
        password,
      });
      setUser(res.data.user);
      router.replace('/home');
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // ignore server errors on logout
    }
    setUser(null);
    router.replace('/login');
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
