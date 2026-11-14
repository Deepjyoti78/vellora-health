'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Icon } from './Icon';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const roles = [
    { label: 'Patient (Eleanor Vance)', role: 'PATIENT' as const, path: '/patient/dashboard' },
    { label: 'Doctor (Dr. Maya Patel)', role: 'DOCTOR' as const, path: '/provider/dashboard' },
    { label: 'Nurse (Sarah Jenkins)', role: 'NURSE' as const, path: '/provider/dashboard' },
    { label: 'Caretaker (James Thornton)', role: 'CARETAKER' as const, path: '/provider/dashboard' },
    { label: 'Phlebotomist (Alex Rivera)', role: 'PHLEBOTOMIST' as const, path: '/provider/dashboard' },
    { label: 'Super Admin', role: 'ADMIN' as const, path: '/admin/dashboard' },
  ];

  return (
    <aside
      aria-label="Platform role switcher"
      className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 z-50 flex flex-col items-start gap-2"
    >
      {isOpen && (
        <div className="w-[calc(100vw-24px)] sm:w-80 max-w-sm rounded-2xl border border-[#273a3d] bg-[#11191b]/95 p-4 text-white shadow-2xl backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                Vellora Platform Switcher
              </p>
              <p className="text-xs text-white/70">
                Current: <span className="font-semibold text-white">{currentUser.name}</span> (
                {currentUser.role})
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white"
            >
              <Icon name="close" size="xs" />
            </button>
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
              Switch Active Role
            </p>
            {roles.map((item) => {
              const isSelected = currentUser.role === item.role;
              return (
                <button
                  key={item.role}
                  onClick={() => {
                    switchRole(item.role);
                    router.push(item.path);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition ${
                    isSelected
                      ? 'bg-teal-600 text-white font-semibold'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <span>{item.label}</span>
                  {isSelected && <Icon name="check" size="xs" />}
                </button>
              );
            })}
          </div>

          <div className="mt-3 border-t border-white/10 pt-2">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/50">
              Fast Portal Navigation
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <Link
                href="/"
                className="rounded-md bg-white/5 px-2 py-1 text-center text-white/80 hover:bg-white/15"
              >
                Public Home
              </Link>
              <Link
                href="/services"
                className="rounded-md bg-white/5 px-2 py-1 text-center text-white/80 hover:bg-white/15"
              >
                All Services
              </Link>
              <Link
                href="/patient/dashboard"
                className="rounded-md bg-white/5 px-2 py-1 text-center text-white/80 hover:bg-white/15"
              >
                Patient App
              </Link>
              <Link
                href="/provider/dashboard"
                className="rounded-md bg-white/5 px-2 py-1 text-center text-white/80 hover:bg-white/15"
              >
                Provider App
              </Link>
              <Link
                href="/admin/dashboard"
                className="col-span-2 rounded-md bg-teal-900/40 px-2 py-1 text-center font-medium text-teal-200 hover:bg-teal-900/60"
              >
                Super Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-teal-500/40 bg-[#11191b] px-3.5 py-2 text-xs font-semibold text-white shadow-xl transition hover:border-teal-400 hover:bg-[#1a2629]"
      >
        <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-pulse"></span>
        <span>
          Role: <strong className="text-teal-300">{currentUser.role}</strong>
        </span>
        <Icon name="chevron-down" size="xs" className={isOpen ? 'rotate-180 transition' : ''} />
      </button>
    </aside>
  );
};
