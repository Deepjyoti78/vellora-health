'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/common/Icon';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '/admin/dashboard', label: 'Executive Overview', icon: 'layers' as const },
    { href: '/admin/dispatch', label: 'Live Dispatch Board', icon: 'map-pin' as const },
    { href: '/admin/bookings', label: 'Master Bookings', icon: 'calendar' as const },
    { href: '/admin/providers', label: 'Provider Directory', icon: 'stethoscope' as const },
    { href: '/admin/verifications', label: 'Credential Approvals', icon: 'shield' as const },
    { href: '/admin/patients', label: 'Patient Directory', icon: 'users' as const },
    { href: '/admin/services', label: 'Services & Pricing', icon: 'plus' as const },
    { href: '/admin/finance', label: 'Finance & Payouts', icon: 'file-text' as const },
    { href: '/admin/feedback', label: 'Quality & Tickets', icon: 'chat' as const },
    { href: '/admin/settings', label: 'Settings & Audit Logs', icon: 'settings' as const },
  ];

  return (
    <div className="min-h-screen bg-[#edf3f6] flex font-sans text-gray-900">
      {/* Sidebar - Desktop */}
      <aside
        className={`sticky top-0 z-40 hidden h-screen shrink-0 border-r border-[#dbe4ea] bg-white transition-all duration-300 md:flex md:flex-col ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-[#e5edf1] px-5 relative z-10">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e6f7f2] text-[#0e756e]">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#0e756e]" fill="currentColor">
                <path d="M10 4a2 2 0 0 1 4 0v4h4a2 2 0 1 1 0 4h-4v4a2 2 0 1 1-4 0v-4H6a2 2 0 1 1 0-4h4V4z" />
              </svg>
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <span className="block text-sm font-black tracking-wider text-[#11191b]">
                  VELLORA
                </span>
                <span className="block text-[10px] font-extrabold uppercase tracking-widest text-[#0e756e]">
                  COMMAND DESK
                </span>
              </div>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf1f4] text-[#556970] hover:bg-[#dce6eb] transition-colors"
            aria-label="Toggle sidebar"
          >
            <span className="text-base font-bold leading-none">≡</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5 relative z-10">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#0e756e] text-white shadow-sm'
                    : 'text-[#33474d] hover:bg-[#eaf1f4] hover:text-[#11191b]'
                }`}
              >
                <div className={`shrink-0 ${isActive ? 'text-white' : 'text-[#556970]'}`}>
                  <Icon name={item.icon} className="h-4 w-4" />
                </div>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Ambient bottom mesh wave */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#e4f3f0]/80 via-[#f0f8f6]/40 to-transparent" />

        {/* User Card at bottom */}
        <div className="border-t border-[#e5edf1] p-4 bg-white/80 backdrop-blur-xs relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0a3935] font-black text-xs text-white shadow-xs">
                N
              </div>
              {!collapsed && (
                <div className="overflow-hidden leading-tight">
                  <span className="block text-xs font-bold text-[#11191b] truncate">
                    Alex Rivera
                  </span>
                  <span className="block text-[11px] font-medium text-gray-500 truncate">
                    Super Admin
                  </span>
                </div>
              )}
            </div>
            {!collapsed && (
              <span className="text-gray-400 text-xs font-bold">⌄</span>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top Operational Status Bar */}
        <div className="flex items-center justify-between border-b border-[#dbe4ea] bg-white/70 px-4 py-3 backdrop-blur-sm sm:px-8">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="mr-2 rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 md:hidden"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#b8ebd9] bg-[#e6f7f2] px-3.5 py-1 text-xs font-semibold text-[#0f6661]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Bay Area Telemetry: 100% Operational</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-2xs">
              <Icon name="clock" className="h-3.5 w-3.5 text-gray-400" />
              <span>Live Dispatch Feed</span>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-full bg-[#11191b] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#116b70] transition-colors"
            >
              <span>Public Site</span>
              <span className="text-[10px]">↗</span>
            </Link>
          </div>
        </div>

        {/* Page Inner Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex w-72 flex-col bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#116b70] text-white font-black text-base">
                  +
                </span>
                <span className="text-sm font-black text-[#11191b]">
                  VELLORA COMMAND
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <nav className="mt-4 flex-1 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold ${
                    pathname === item.href
                      ? 'bg-[#116b70] text-white shadow-xs'
                      : 'text-[#33474d] hover:bg-[#eaf1f4]'
                  }`}
                >
                  <Icon name={item.icon} className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};
