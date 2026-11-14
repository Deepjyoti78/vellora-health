'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  Menu,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Plus,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onOpenMobileMenu }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center justify-between border-b border-[#E2EBE7] bg-white/95 px-4 backdrop-blur-md sm:px-8">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2EBE7] text-slate-600 hover:bg-[#F2F8F5] md:hidden transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Input */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patients, doctors, appointments..."
            className="w-full rounded-xl border border-[#E2EBE7] bg-[#F5F9F7] py-2 pl-10 pr-12 text-[13px] text-[#102820] placeholder:text-slate-400 focus:border-[#064E3B] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#064E3B] transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-[#E2EBE7] bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 shadow-2xs">
            ⌘K
          </span>
        </div>

        {/* Operational Status Pill */}
        <div className="hidden lg:inline-flex items-center gap-2 rounded-full border border-[#D1FAE5] bg-[#ECFDF5] px-3 py-1 text-[11px] font-medium text-[#065F46]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span>Bay Area Telemetry: 100% Operational</span>
        </div>
      </div>

      {/* Right: Actions, Notifications, Profile & Public Link */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Quick New Booking Button */}
        <Link
          href="/admin/dispatch"
          className="hidden xl:inline-flex items-center gap-1.5 rounded-xl bg-[#064E3B] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#065F46] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Dispatch</span>
        </Link>

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2EBE7] text-slate-600 hover:bg-[#F2F8F5] transition-colors"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#E2EBE7] bg-white p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-[#E2EBE7] pb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#102820]">
                  Live Activity Alerts
                </h4>
                <span className="rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-bold text-[#065F46]">
                  3 New
                </span>
              </div>
              <div className="mt-3 space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-[#F5F9F7] transition-colors">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#102820]">
                      Dr. Maya Patel arrived on site
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Booking #VEL-2026-8941 • 2 mins ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-[#F5F9F7] transition-colors">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#102820]">
                      Credential verification pending
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Nurse David Vance • 14 mins ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Public Site Link */}
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2EBE7] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#F2F8F5] transition-colors shadow-2xs"
        >
          <span>Public Site</span>
          <ExternalLink className="h-3 w-3 text-slate-400" />
        </Link>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-[#F2F8F5] transition-colors"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#064E3B] text-xs font-bold text-white shadow-xs">
              AM
            </div>
            <div className="hidden text-left xl:block">
              <span className="block text-xs font-bold text-[#102820] leading-none">
                Dr. Arjun Mehta
              </span>
              <span className="block text-[11px] font-medium text-slate-500">
                Medical Director
              </span>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 xl:block" />
          </button>
        </div>
      </div>
    </header>
  );
};
