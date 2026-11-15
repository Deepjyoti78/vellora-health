'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, UserRecord } from '@/lib/db';

export type UserRole = UserRecord['role'];

interface AuthContextType {
  currentUser: UserRecord | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (emailOrPhone: string, preferredRole?: UserRole) => boolean;
  registerPatient: (data: { name: string; email: string; phone: string }) => UserRecord;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  validateInternalRedirect: (target?: string | null, fallback?: string) => string;
  simulatedOtp: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Non-sensitive client session key for UI state persistence across page refreshes
const CLIENT_SESSION_STORAGE_KEY = 'vellora_client_session_uid';

/**
 * Validates that a redirect target is a safe, internal application path.
 * Prevents open-redirect vulnerabilities (blocks protocol-relative URLs, external schemes, etc.)
 */
export const validateInternalPath = (target?: string | null, fallback: string = '/'): string => {
  if (!target || typeof target !== 'string') {
    return fallback;
  }

  const trimmed = target.trim();

  // Must begin with a single slash and not double slashes (protocol-relative: //evil.com)
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return fallback;
  }

  // Must not contain URI schemes (javascript:, http:, https:, data:)
  if (trimmed.includes(':')) {
    return fallback;
  }

  return trimmed;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication foundation: defaults strictly to unauthenticated guest (null)
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  const simulatedOtp = '4829';

  // Restore active user session on client mount if previously authenticated
  useEffect(() => {
    try {
      const storedUid = typeof window !== 'undefined'
        ? sessionStorage.getItem(CLIENT_SESSION_STORAGE_KEY)
        : null;

      if (storedUid) {
        const found = db.getUserById(storedUid);
        if (found) {
          setCurrentUser(found);
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem(CLIENT_SESSION_STORAGE_KEY);
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // Unauthenticated visitor
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      // In case storage is blocked
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const login = useCallback((emailOrPhone: string, preferredRole?: UserRole): boolean => {
    const cleanQuery = emailOrPhone.trim().toLowerCase();
    const cleanDigits = emailOrPhone.replace(/\D/g, '');
    const users = db.getUsers();

    // 1. Match by email or normalized phone
    let matched = users.find(
      (u) =>
        u.email.toLowerCase() === cleanQuery ||
        (cleanDigits.length >= 7 && u.phone.replace(/\D/g, '').endsWith(cleanDigits))
    );

    // 2. If preferred role specified and not matched yet, match first user with that role
    if (!matched && preferredRole) {
      matched = users.find((u) => u.role === preferredRole);
    }

    if (matched) {
      setCurrentUser(matched);
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(CLIENT_SESSION_STORAGE_KEY, matched.id);
      } catch {}
      return true;
    }

    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem(CLIENT_SESSION_STORAGE_KEY);
    } catch {}
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    const users = db.getUsers();
    const matched = users.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(CLIENT_SESSION_STORAGE_KEY, matched.id);
      } catch {}
    }
  }, []);

  const registerPatient = useCallback((data: { name: string; email: string; phone: string }): UserRecord => {
    const newUser = db.createUser({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      role: 'PATIENT',
      verificationStatus: 'APPROVED',
    });
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem(CLIENT_SESSION_STORAGE_KEY, newUser.id);
    } catch {}
    return newUser;
  }, []);

  const validateInternalRedirect = useCallback(
    (target?: string | null, fallback: string = '/') => validateInternalPath(target, fallback),
    []
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isAuthLoading,
        login,
        registerPatient,
        logout,
        switchRole,
        validateInternalRedirect,
        simulatedOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
