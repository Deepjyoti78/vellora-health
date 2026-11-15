'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  Bell,
  Menu,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Settings,
  User,
  LogOut,
  ExternalLink,
} from 'lucide-react';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onOpenMobileMenu }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-30 flex h-[76px] shrink-0 items-center justify-between border-b border-[#E2EBE7] bg-white px-4 sm:px-8 transition-colors">
      {/* Left: Mobile hamburger & Global Search matching Reference Image 2 */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-2xl">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2EBE7] text-slate-600 hover:bg-[#F2F8F5] md:hidden transition-colors shrink-0"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Spacious Rounded Search Bar */}
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patients, doctors, appointments..."
            className="w-full rounded-2xl border border-[#E2EBE7] bg-white py-2.5 pl-11 pr-4 text-xs sm:text-[13px] text-[#102820] placeholder:text-slate-400 focus:border-[#065F46] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#065F46] transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Right: AI Sparkle, Notification Bell & User Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Sparkle / AI Assistant Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAiMenu(!showAiMenu)}
            className="flex items-center gap-1.5 rounded-2xl border border-[#E2EBE7] bg-white px-3 py-2 text-slate-700 hover:bg-[#F2F8F5] hover:border-[#CBDCD5] transition-all shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
            aria-label="AI actions"
          >
            <Sparkles className="h-4 w-4 text-slate-700" />
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {showAiMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#E2EBE7] bg-white p-3 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 px-2 pb-2 border-b border-[#F2F8F5]">
                <Sparkles className="h-3.5 w-3.5 text-[#065F46]" />
                <span className="text-xs font-bold text-[#102820]">Vellora AI Intelligence</span>
              </div>
              <div className="mt-2 space-y-1 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAiMenu(false)}
                  className="w-full text-left rounded-xl px-2.5 py-2 font-medium text-slate-700 hover:bg-[#F2F8F5] hover:text-[#065F46] transition-colors"
                >
                  Generate Daily Operations Summary
                </button>
                <button
                  type="button"
                  onClick={() => setShowAiMenu(false)}
                  className="w-full text-left rounded-xl px-2.5 py-2 font-medium text-slate-700 hover:bg-[#F2F8F5] hover:text-[#065F46] transition-colors"
                >
                  Predict Caregiver Surge Requirements
                </button>
                <button
                  type="button"
                  onClick={() => setShowAiMenu(false)}
                  className="w-full text-left rounded-xl px-2.5 py-2 font-medium text-slate-700 hover:bg-[#F2F8F5] hover:text-[#065F46] transition-colors"
                >
                  Scan Clinical Anomalies &amp; Delays
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Circular Notification Bell with Red Badge Dot */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#E2EBE7] bg-white text-slate-700 hover:bg-[#F2F8F5] hover:border-[#CBDCD5] transition-all shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4 text-slate-700" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
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

        {/* User Profile Section: Circular Doctor Photo + Name + Role + Chevron */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 rounded-2xl p-1 hover:bg-[#F2F8F5] transition-colors"
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#E2EBE7] shadow-2xs bg-slate-100">
              <Image
                src="/assets/avatar-indian-1.jpg"
                alt="Dr. Arjun Mehta"
                fill
                className="object-cover object-top"
              />
            </div>
            <div className="hidden text-left sm:block">
              <span className="block text-xs font-bold text-[#102820] leading-tight">
                Dr. Arjun Mehta
              </span>
              <span className="block text-[11px] font-medium text-slate-500">
                Administrator
              </span>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#E2EBE7] bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-[#F2F8F5]">
                <p className="text-xs font-bold text-[#102820]">Dr. Arjun Mehta</p>
                <p className="text-[11px] text-slate-500">arjun.mehta@vellora.health</p>
                <span className="mt-1 inline-block rounded-md bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-bold text-[#065F46]">
                  Full System Admin
                </span>
              </div>
              <div className="mt-1 space-y-0.5 text-xs">
                <Link
                  href="/admin/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-700 hover:bg-[#F2F8F5] hover:text-[#065F46] transition-colors"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Admin Settings</span>
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-700 hover:bg-[#F2F8F5] hover:text-[#065F46] transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>View Public Website</span>
                </Link>
                <Link
                  href="/provider/dashboard"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-700 hover:bg-[#F2F8F5] hover:text-[#065F46] transition-colors"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Switch to Clinician Portal</span>
                </Link>
                <div className="pt-1 border-t border-[#F2F8F5]">
                  <Link
                    href="/patient/login"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Log Out</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
