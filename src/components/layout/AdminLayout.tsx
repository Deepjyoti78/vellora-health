'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { currentUser, isAuthLoading } = useAuth();
  const isDashboard = pathname === '/admin/dashboard' || pathname === '/admin';

  if (isAuthLoading) return null;
  if (currentUser?.role !== 'ADMIN') return <main className="min-h-screen grid place-content-center gap-4 text-center"><h1>Admin demo access required</h1><p>Choose the Admin demo role to preview this portal.</p><Link href="/">Return home</Link></main>;

  return (
    <div className="min-h-screen bg-[#F5F9F7] flex font-sans text-[#102820]">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block">
        <AdminSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Main App Container */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top Header - Displayed on Dashboard Only */}
        {isDashboard ? (
          <AdminHeader onOpenMobileMenu={() => setMobileOpen(true)} />
        ) : (
          /* Slim mobile-only bar for non-dashboard pages so mobile users can still access the navigation drawer */
          <div className="flex md:hidden h-14 shrink-0 items-center justify-between border-b border-[#E2EBE7]/60 bg-[#F5F9F7] px-4">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2EBE7] text-slate-600 hover:bg-[#F2F8F5] transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <img
              src="/assets/logo-dark.png"
              alt="Velora Healthcare"
              className="h-6 w-auto object-contain"
            />
            <div className="w-9" />
          </div>
        )}

        {/* Page Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1500px]">{children}</div>
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 flex w-72 flex-col bg-[#F2F8F5] shadow-2xl">
            <AdminSidebar
              collapsed={false}
              onCloseMobile={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
