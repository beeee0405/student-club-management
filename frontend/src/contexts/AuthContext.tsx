import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser, useLogin, useLogout } from '../hooks/useAuth';
import type { User } from '../lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { data: user, isLoading } = useCurrentUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      // Redirect based on user role after successful login
      if (result?.user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        // Với người dùng thường, quay về trang chủ
        navigate('/');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      // Always navigate to auth and replace history so back doesn't return to protected pages
      navigate('/auth', { replace: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}