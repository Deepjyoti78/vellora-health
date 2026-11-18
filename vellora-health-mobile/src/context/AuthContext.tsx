import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile } from '../types';
import { CURRENT_PATIENT } from '../data/mockData';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  simulatedOtp: string;
  loginPhone: (phone: string) => Promise<boolean>;
  verifyOtp: (code: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  pendingPhone: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(CURRENT_PATIENT);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Pre-authenticated for instant review, toggleable via logout
  const [pendingPhone, setPendingPhone] = useState<string>('+1 (555) 019-2834');
  const simulatedOtp = '4829'; // Matching RFP / Web verification code

  const loginPhone = async (phone: string): Promise<boolean> => {
    setPendingPhone(phone || '+1 (555) 019-2834');
    return true;
  };

  const verifyOtp = async (code: string): Promise<boolean> => {
    if (code.trim() === simulatedOtp) {
      setUser(previous => ({ ...(previous || CURRENT_PATIENT), phone: pendingPhone }));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        simulatedOtp,
        loginPhone,
        verifyOtp,
        logout,
        pendingPhone,
        updateProfile: updates => setUser(previous => ({ ...(previous || CURRENT_PATIENT), ...updates })),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
