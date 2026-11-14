'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, UserRecord } from '@/lib/db';

export type UserRole = UserRecord['role'];

interface AuthContextType {
  currentUser: UserRecord;
  switchRole: (role: UserRecord['role']) => void;
  login: (emailOrPhone: string, role?: UserRecord['role']) => boolean;
  logout: () => void;
  simulatedOtp: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const users = db.getUsers();
  const [currentUser, setCurrentUser] = useState<UserRecord>(users[0]); // Default to Eleanor Vance (Patient)
  const simulatedOtp = '4829';

  const switchRole = (role: UserRecord['role']) => {
    const matched = users.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
    }
  };

  const login = (emailOrPhone: string, preferredRole?: UserRecord['role']) => {
    const matched = users.find(
      (u) =>
        u.email.toLowerCase() === emailOrPhone.toLowerCase() ||
        u.phone.replace(/\D/g, '') === emailOrPhone.replace(/\D/g, '')
    );
    if (matched) {
      setCurrentUser(matched);
      return true;
    }
    if (preferredRole) {
      const byRole = users.find((u) => u.role === preferredRole);
      if (byRole) {
        setCurrentUser(byRole);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    // Reset to public patient
    setCurrentUser(users[0]);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchRole,
        login,
        logout,
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
