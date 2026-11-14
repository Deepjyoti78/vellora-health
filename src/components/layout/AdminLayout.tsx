'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Icon } from '@/components/common/Icon';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '/admin/dashboard', label: 'Executive Overview', icon: 'layers' as const },
    { href: '/admin/dispatch', label: 'Live Dispatch Board', icon: 'clock' as const },
    { href: '/admin/bookings', label: 'Master Bookings', icon: 'calendar' as const },
    { href: '/admin/providers', label: 'Provider Directory', icon: 'stethoscope' as const },
    { href: '/admin/verifications', label: 'Credential Approvals', icon: 'shield' as const },
    { href: '/admin/patients', label: 'Patient Directory', icon: 'users' as const },
    { href: '/admin/services', label: 'Services & Pricing', icon: 'plus' as const },
    { href: '/admin/finance', label: 'Finance & Payouts', icon: 'file-text' as const },
    { href: '/admin/feedback', label: 'Quality & Tickets', icon: 'chat' as const },
    { href: '/admin/settings', label: 'Settings & Audit Logs', icon: 'lock' as const },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7F7] flex font-sans text-gray-900">
      {/* Sidebar - Desktop */}
      <aside
        className={`sticky top-0 z-40 hidden h-screen shrink-0 border-r border-gray-200 bg-[#11191B] text-white transition-all duration-300 md:flex md:flex-col ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#116b70] text-white font-black text-sm">
              +
            </span>
            {!collapsed && (
              <div className="leading-tight">
                <span className="text-sm font-black tracking-tight text-white">
                  VELLORA
                </span>
                <span className="ml-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Command Desk
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white"
          >
            <Icon name="menu" className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-[#116b70] text-white shadow-md'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon name={item.icon} className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Card at bottom */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-bold text-xs text-white">
              SA
            </div>
            {!collapsed && (
              <div className="overflow-hidden leading-tight">
                <span className="block text-xs font-bold text-white truncate">
                  Super Administrator
                </span>
                <span className="block text-[10px] font-semibold text-emerald-400">
                  Full Root Authority
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>
            <span className="text-sm font-black text-gray-900">Vellora Command Desk</span>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Bay Area Telemetry: 100% Operational
            </span>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dispatch"
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-2xs"
            >
              <Icon name="clock" className="h-3.5 w-3.5 text-[#116b70]" />
              Live Dispatch Feed
            </Link>
            <Link
              href="/"
              className="rounded-xl bg-[#11191B] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-black transition-colors"
            >
              Public Site ↗
            </Link>
          </div>
        </header>

        {/* Mobile Sidebar */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative w-64 max-w-xs bg-[#11191B] text-white p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-sm font-black">VELLORA ADMIN</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-1 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-bold ${
                      pathname === item.href ? 'bg-[#116b70] text-white' : 'text-gray-300'
                    }`}
                  >
                    <Icon name={item.icon} className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};
