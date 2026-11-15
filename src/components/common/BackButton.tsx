'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
  useHistoryBack?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({
  href = '/patient/dashboard',
  label = 'Back to Dashboard',
  className = '',
  useHistoryBack = false,
}) => {
  const router = useRouter();

  if (useHistoryBack) {
    return (
      <button
        type="button"
        onClick={() => router.back()}
        className={`group inline-flex items-center gap-1.5 rounded-full border border-[#CBDCD5] bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-2xs hover:border-[#064E3B] hover:bg-[#F2F8F5] hover:text-[#064E3B] transition-all ${className}`}
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-1.5 rounded-full border border-[#CBDCD5] bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-2xs hover:border-[#064E3B] hover:bg-[#F2F8F5] hover:text-[#064E3B] transition-all ${className}`}
    >
      <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
      <span>{label}</span>
    </Link>
  );
};
