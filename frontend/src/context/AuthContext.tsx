import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { Admin } from '../types';
import { authApi } from '../api/auth.api';
import type { LoginFormData } from '../schemas/auth.schema';

// ─── Auth Context Types ───────────────────────────────────────────────────────
interface AuthContextValue {
  admin: Admin | null;
  isLoading: boolean;          // True while verifying session on app load
  isAuthenticated: boolean;
  login: (data: LoginFormData) => Promise<void>;
  logout: () => Promise<void>;
}

// ─── Context Creation ─────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Auth Provider ────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Restore session on app load ──────────────────────────────────────────
  // Calls GET /auth/me — if the HttpOnly cookie is valid, the server returns
  // the admin profile. If not, we stay unauthenticated.
  useEffect(() => {
    const checkSession = async (): Promise<void> => {
      try {
        const res = await authApi.getMe();
        if (res.success && res.data) {
          setAdmin(res.data);
        }
      } catch {
        // Session invalid or expired — stay unauthenticated
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };

    void checkSession();
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (data: LoginFormData): Promise<void> => {
    const res = await authApi.login(data);
    if (!res.success) {
      throw new Error(res.message ?? 'Login failed.');
    }
    // Fetch the admin profile after successful login
    const meRes = await authApi.getMe();
    if (meRes.success && meRes.data) {
      setAdmin(meRes.data);
    }
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(async (): Promise<void> => {
    try {
      await authApi.logout();
    } finally {
      setAdmin(null);
    }
  }, []);

  const value: AuthContextValue = {
    admin,
    isLoading,
    isAuthenticated: admin !== null,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ─── useAuth Hook ─────────────────────────────────────────────────────────────
// Must be used within an <AuthProvider>. Throws if used outside.
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
};
