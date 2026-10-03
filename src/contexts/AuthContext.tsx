import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { authService, LoginResponse, UserMeResponse } from '../services/authService';

export type UserRole = 'admin';

interface User {
  id?: string;
  name?: string;
  displayName?: string;
  email: string;
  phone?: string;
  role: UserRole;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  mustSetup2fa: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ requires2FA: boolean }>;
  register: (data: { name: string; email: string; phone: string; password: string; role: UserRole }) => void;
  logout: () => Promise<void>;
  fetchUserInfo: () => Promise<void>;
  setMustSetup2fa: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check if user is stored in localStorage
    if (typeof window === 'undefined') return null;
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken') || localStorage.getItem('token') || null;
  });

  const [mustSetup2fa, setMustSetup2fa] = useState<boolean>(false);

  const hasFetchedUserRef = useRef(false);

  // Map API user response to our User type
  const mapUserFromApi = (apiUser: UserMeResponse, fallbackEmail?: string): User => {
    // Extract data from response (could be in data field or top level)
    const userData = apiUser.data || apiUser;

    // Role can be in different locations depending on API response structure:
    // 1. userData.user.role (most common for /auth/me)
    // 2. userData.role
    // 3. apiUser.user.role
    // 4. apiUser.role
    const userObj = (userData as any).user || userData;
    const role = userObj.role || userData.role || (apiUser as any).user?.role || apiUser.role || 'admin';

    return {
      id: userData.id || apiUser.id || apiUser.uid || apiUser.userId || userObj.id || '',
      email: userData.email || apiUser.email || userObj.email || fallbackEmail || '',
      name: userData.displayName || userData.name || apiUser.displayName || apiUser.name || userData.username || apiUser.username || userObj.name || '',
      displayName: userData.displayName || userData.name || apiUser.displayName || apiUser.name || userData.username || apiUser.username || userObj.displayName || '',
      username: userData.username || apiUser.username || userObj.username || '',
      phone: userData.phone || apiUser.phone || userObj.phone,
      role: role as UserRole, // Get role from API, fallback to 'admin'
    };
  };

  // Fetch user info from API
  const fetchUserInfo = async () => {
    const currentToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (!currentToken) {
      return;
    }

    // Update token state from localStorage (in case it was updated externally, e.g., after 2FA verify)
    setToken(currentToken);

    try {
      const userData = await authService.getMe();
      const mappedUser = mapUserFromApi(userData);
      setUser(mappedUser);
      localStorage.setItem('user', JSON.stringify(mappedUser));
      hasFetchedUserRef.current = true; // Mark as fetched successfully
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      hasFetchedUserRef.current = true; // Mark as attempted even if failed
      // Don't throw error here - just log it
      // If token is invalid, the apiClient will handle 401 and redirect to login
    }
  };

  // Fetch user info on mount if token exists and user hasn't been fetched yet
  useEffect(() => {
    if (token && !user && !hasFetchedUserRef.current) {
      hasFetchedUserRef.current = true;
      fetchUserInfo();
    }
  }, [token, user]);

  const login = async (credentials: { email: string; password: string }): Promise<{ requires2FA: boolean }> => {
    try {
      // Call API login
      const response: LoginResponse = await authService.login({
        usernameOrEmail: credentials.email,
        password: credentials.password,
      });

      // Extract token from response - check data.accessToken first (new API format)
      // then fallback to top-level accessToken/token (old format)
      const authToken = response.data?.accessToken || response.accessToken || response.token || '';

      // Extract user data from API response - prioritize data object (new format)
      const responseData = response.data;
      const responseUser = response.user;

      // Check if mustSetup2fa is required
      const mustSetup2faValue = responseData?.mustSetup2fa || response.mustSetup2fa || false;

      // If no token is returned OR mustSetup2fa is true, redirect to 2FA verification
      // This handles cases where API requires 2FA verification before issuing token
      const requires2FA = mustSetup2faValue || !authToken;

      setMustSetup2fa(requires2FA);

      // If 2FA is required (either explicitly or because no token was returned), 
      // don't proceed with normal login flow
      // The Verify2FA component will handle the rest
      if (requires2FA) {
        // When 2FA is required, API typically doesn't return accessToken yet
        // Only save token if it exists (some APIs might return a temporary/session token)
        if (authToken) {
          setToken(authToken);
          localStorage.setItem('accessToken', authToken);
          localStorage.setItem('token', authToken);
          const refreshToken = responseData?.refreshToken || response.refreshToken;
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
          }
        } else {
          // No token returned - clear any existing tokens
          setToken(null);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }

        // Save userId and credentials temporarily for Verify2FA
        const userId = responseData?.userId || responseUser?.id;
        if (userId) {
          // Save minimal user data with userId for Verify2FA
          const tempUser: User = {
            id: userId,
            email: responseUser?.email || credentials.email || responseData?.username || '',
            name: responseData?.displayName || responseUser?.name || responseData?.username || '',
            displayName: responseData?.displayName || responseUser?.name || responseData?.username || '',
            username: responseData?.username || responseUser?.username || '',
            role: (responseData?.role || responseUser?.role || 'admin') as UserRole, // Get role from API, fallback to 'admin'
          };
          setUser(tempUser);
          localStorage.setItem('user', JSON.stringify(tempUser));
        }

        // Save username/email for verify API (in case API needs it)
        if (credentials.email) {
          localStorage.setItem('pendingLoginEmail', credentials.email);
        }

        // Don't set isAuthenticated yet - wait for 2FA verify to complete
        // Token will be received after successful 2FA verification
        return { requires2FA: true };
      }

      // Build user data from API response
      // Note: API response has userId, username, displayName, role
      const userData: User = {
        id: responseData?.userId || responseUser?.id,
        email: responseUser?.email || credentials.email || responseData?.username || '', // Use username as email if email not provided
        name: responseData?.displayName || responseUser?.name || responseUser?.username || responseData?.username || '',
        displayName: responseData?.displayName || responseUser?.name || responseUser?.username || responseData?.username || '',
        username: responseData?.username || responseUser?.username || '',
        role: (responseData?.role || responseUser?.role || 'admin') as UserRole, // Get role from API, fallback to 'admin'
      };

      // Extract refresh token
      const refreshToken = responseData?.refreshToken || response.refreshToken;

      // Save token first
      setToken(authToken);
      localStorage.setItem('accessToken', authToken);
      localStorage.setItem('token', authToken); // Keep for backward compatibility
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      localStorage.setItem('isAuthenticated', 'true');

      // Save initial user data from login response (temporary, will be overridden by getMe)
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // Fetch complete user info from /auth/me endpoint to get accurate role from roles array
      try {
        // Reset ref to allow fetching
        hasFetchedUserRef.current = false;
        await fetchUserInfo();
      } catch (error) {
        // If getMe fails, keep the user data from login response
        console.warn('Failed to fetch user info after login, using login response data:', error);
        hasFetchedUserRef.current = true; // Mark as fetched even if failed
      }

      return { requires2FA: false };
    } catch (error) {
      // Re-throw error to be handled in component
      throw error;
    }
  };

  const register = (data: { name: string; email: string; phone: string; password: string; role: UserRole }) => {
    // In a real app, this would be an API call
    const userData: User = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = async () => {
    // Clear local state
    setUser(null);
    setToken(null);
    setMustSetup2fa(false);
    hasFetchedUserRef.current = false; // Reset ref so user can be fetched again on next login

    // Clear all authentication-related items from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('pendingLoginEmail');
    localStorage.removeItem('userSettings');
    localStorage.removeItem('sidebarCollapsed');
  };

  // Với chế độ không cần login, chỉ cần có user và không yêu cầu 2FA là coi như đã đăng nhập
  const isAuthenticated = !!user && !mustSetup2fa;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, mustSetup2fa, login, register, logout, fetchUserInfo, setMustSetup2fa }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

