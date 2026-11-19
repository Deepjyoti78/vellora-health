'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, UserRecord } from '@/lib/db';

export type UserRole = UserRecord['role'];

interface AuthContextType {
  currentUser: UserRecord | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (emailOrPhone: string, preferredRole?: UserRole, customName?: string) => boolean;
  registerPatient: (data: { name: string; email: string; phone: string; password?: string }) => UserRecord;
  registerProvider: (data: {
    name: string;
    email: string;
    phone: string;
    role: 'DOCTOR' | 'NURSE' | 'CARETAKER' | 'PHYSIOTHERAPIST' | 'PHLEBOTOMIST';
    specialty?: string;
    qualification?: string;
  }) => UserRecord;
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
        ? sessionStorage.getItem(CLIENT_SESSION_STORAGE_KEY) || localStorage.getItem('vellora_active_user_id')
        : null;

      if (storedUid) {
        const found = db.getUserById(storedUid);
        if (found) {
          setCurrentUser(found);
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem(CLIENT_SESSION_STORAGE_KEY);
          localStorage.removeItem('vellora_active_user_id');
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

  const login = useCallback((emailOrPhone: string, preferredRole?: UserRole, customName?: string): boolean => {
    const cleanQuery = emailOrPhone.trim().toLowerCase();
    const cleanDigits = emailOrPhone.replace(/\D/g, '');
    const users = db.getUsers();

    // 1. Match by email, name or phone
    let matched = users.find(
      (u) =>
        (u.email && u.email.toLowerCase() === cleanQuery) ||
        (u.name && u.name.toLowerCase() === cleanQuery) ||
        (u.name && cleanQuery.length > 2 && u.name.toLowerCase().includes(cleanQuery)) ||
        (cleanDigits.length >= 7 && u.phone && u.phone.replace(/\D/g, '').endsWith(cleanDigits))
    );

    // 2. If matched and customName is provided, update name if needed
    if (matched && customName && customName.trim() && matched.id !== 'pat-1') {
      matched.name = customName.trim();
      db.updateUser(matched.id, { name: customName.trim() });
    }

    // 3. If NOT matched, do NOT fall back to Eleanor Vance unless demo credentials specified!
    if (!matched) {
      if (cleanQuery === 'patient@vellora.com' || cleanQuery === 'eleanor' || cleanQuery === 'eleanor vance') {
        matched = users.find((u) => u.id === 'pat-1');
      } else {
        // Create new patient record with entered name/credentials so user identity is preserved
        const isEmail = cleanQuery.includes('@');
        let nameToUse = customName && customName.trim() ? customName.trim() : '';
        if (!nameToUse) {
          if (isEmail) {
            nameToUse = cleanQuery
              .split('@')[0]
              .replace(/[._-]/g, ' ')
              .replace(/\b\w/g, (c) => c.toUpperCase());
          } else if (!cleanDigits || cleanDigits.length < cleanQuery.length / 2) {
            nameToUse = cleanQuery.replace(/\b\w/g, (c) => c.toUpperCase());
          } else {
            nameToUse = 'Patient ' + (cleanDigits.slice(-4) || 'User');
          }
        }

        matched = db.createUser({
          name: nameToUse,
          email: isEmail ? cleanQuery : '',
          phone: cleanDigits.length >= 7 ? emailOrPhone.trim() : '',
          role: preferredRole || 'PATIENT',
          verificationStatus: 'APPROVED',
        });
      }
    }

    if (matched) {
      setCurrentUser(matched);
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(CLIENT_SESSION_STORAGE_KEY, matched.id);
        localStorage.setItem('vellora_active_user_id', matched.id);
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
      localStorage.removeItem('vellora_active_user_id');
    } catch {}
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    // If current user is already in this role, keep current user
    if (currentUser && currentUser.role === role) {
      return;
    }
    const users = db.getUsers();
    const matched = users.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(CLIENT_SESSION_STORAGE_KEY, matched.id);
        localStorage.setItem('vellora_active_user_id', matched.id);
      } catch {}
    }
  }, [currentUser]);

  const registerPatient = useCallback((data: { name: string; email: string; phone: string; password?: string }): UserRecord => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanDigits = data.phone.replace(/\D/g, '');
    const users = db.getUsers();

    // Check if user with same email or phone already exists
    let existing = users.find(
      (u) =>
        (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail) ||
        (cleanDigits.length >= 7 && u.phone && u.phone.replace(/\D/g, '').endsWith(cleanDigits))
    );

    let user: UserRecord;
    if (existing) {
      existing.name = data.name.trim();
      if (data.email) existing.email = data.email.trim();
      if (data.phone) existing.phone = data.phone.trim();
      db.updateUser(existing.id, { name: data.name.trim(), email: data.email.trim(), phone: data.phone.trim() });
      user = existing;
    } else {
      user = db.createUser({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        role: 'PATIENT',
        verificationStatus: 'APPROVED',
      });
    }

    setCurrentUser(user);
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem(CLIENT_SESSION_STORAGE_KEY, user.id);
      localStorage.setItem('vellora_active_user_id', user.id);
    } catch {}
    return user;
  }, []);

  const registerProvider = useCallback((data: {
    name: string;
    email: string;
    phone: string;
    role: 'DOCTOR' | 'NURSE' | 'CARETAKER' | 'PHYSIOTHERAPIST' | 'PHLEBOTOMIST';
    specialty?: string;
    qualification?: string;
  }): UserRecord => {
    const newUser = db.createUser({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      role: data.role,
      specialty: data.specialty,
      qualification: data.qualification,
      verificationStatus: 'PENDING',
      isOnline: false,
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
        registerProvider,
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
