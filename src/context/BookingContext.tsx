'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface BookingContextType {
  isOpen: boolean;
  specialty: string;
  doctor: string;
  openBooking: (params?: { specialty?: string; doctor?: string }) => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [specialty, setSpecialty] = useState('');
  const [doctor, setDoctor] = useState('');

  const openBooking = useCallback((params?: { specialty?: string; doctor?: string }) => {
    setSpecialty(params?.specialty || '');
    setDoctor(params?.doctor || '');
    setIsOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <BookingContext.Provider
      value={{
        isOpen,
        specialty,
        doctor,
        openBooking,
        closeBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
