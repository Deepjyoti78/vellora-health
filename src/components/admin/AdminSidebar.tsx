'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  Stethoscope,
  Layers,
  FileText,
  Settings,
  LogOut,
  Search,
  MapPin,
  Shield,
  MessageSquare,
  DollarSign,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
  onCloseMobile,
}) => {
  const pathname = usePathname();

  const mainNav = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/patients', label: 'Patients', icon: Users },
    { href: '/admin/providers', label: 'Doctors', icon: Stethoscope },
    { href: '/admin/bookings', label: 'Appointments', icon: Calendar },
    { href: '/admin/dispatch', label: 'Live Dispatch', icon: MapPin },
    { href: '/admin/services', label: 'Services', icon: Layers },
    { href: '/admin/verifications', label: 'Verifications', icon: Shield },
    { href: '/admin/finance', label: 'Analytics & Reports', icon: FileText },
  ];

  const managementNav = [
    { href: '/admin/finance', label: 'Payments & Payouts', icon: DollarSign },
    { href: '/admin/feedback', label: 'Quality & Tickets', icon: MessageSquare },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const isLinkActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin' || pathname === '/admin/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`sticky top-0 z-40 h-screen shrink-0 border-r border-[#E2EBE7] bg-[#F2F8F5] transition-all duration-300 flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-[252px]'
      }`}
    >
      {/* Top Header & Search */}
      <div className="flex flex-col">
        {/* Brand Logo Header */}
        <div className="flex h-[72px] items-center justify-between border-b border-[#E2EBE7] px-5">
          <Link
            href="/admin/dashboard"
            onClick={onCloseMobile}
            className="flex items-center gap-3 overflow-hidden"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#064E3B] text-white shadow-sm">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" />
              </svg>
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <span className="block font-heading text-[15px] font-black tracking-tight text-[#102820]">
                  Vellora Health
                </span>
                <span className="block text-[10px] font-extrabold tracking-widest text-[#065F46] uppercase">
                  Command Center
                </span>
              </div>
            )}
          </Link>
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-[#E2EBE7] hover:text-[#102820] transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <span className="text-sm font-bold">{collapsed ? '→' : '←'}</span>
            </button>
          )}
        </div>

        {/* Search Bar matching Target Reference */}
        {!collapsed && (
          <div className="px-4 pt-4 pb-2">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full rounded-xl border border-[#E2EBE7] bg-white py-2 pl-9 pr-9 text-xs text-[#102820] placeholder-slate-400 focus:border-[#047857] focus:outline-hidden focus:ring-1 focus:ring-[#047857]"
              />
              <span className="absolute right-2.5 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                ⌘ K
              </span>
            </div>
          </div>
        )}

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3.5 py-2 space-y-6">
          {/* Main Group */}
          <div>
            {!collapsed && (
              <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Main
              </p>
            )}
            <nav className="space-y-1">
              {mainNav.map((item) => {
                const active = isLinkActive(item.href);
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all ${
                      active
                        ? 'bg-[#064E3B] text-white shadow-sm font-semibold'
                        : 'text-[#2D3F38] hover:bg-[#E8F3EE] hover:text-[#064E3B]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent
                        className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                          active ? 'text-white' : 'text-[#4A6359] group-hover:text-[#064E3B]'
                        }`}
                        strokeWidth={1.8}
                      />
                      {!collapsed && <span>{item.label}</span>}
                    </div>
                    {!collapsed && active && (
                      <ChevronRight className="h-4 w-4 text-white/80" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Management Group */}
          <div>
            {!collapsed && (
              <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Management
              </p>
            )}
            <nav className="space-y-1">
              {managementNav.map((item) => {
                const active = pathname.startsWith(item.href);
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all ${
                      active
                        ? 'bg-[#064E3B] text-white shadow-sm font-semibold'
                        : 'text-[#2D3F38] hover:bg-[#E8F3EE] hover:text-[#064E3B]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent
                        className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                          active ? 'text-white' : 'text-[#4A6359] group-hover:text-[#064E3B]'
                        }`}
                        strokeWidth={1.8}
                      />
                      {!collapsed && <span>{item.label}</span>}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Footer: Log Out & Current User */}
      <div className="border-t border-[#E2EBE7] p-3.5 space-y-2">
        <Link
          href="/"
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-[#2D3F38] hover:bg-[#E8F3EE] hover:text-[#064E3B] transition-colors"
        >
          <LogOut className="h-[18px] w-[18px] text-slate-400" strokeWidth={1.8} />
          {!collapsed && <span>Log Out</span>}
        </Link>
      </div>
    </aside>
  );
};
