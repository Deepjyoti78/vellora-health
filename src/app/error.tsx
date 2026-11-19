'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AlertCircle, RotateCcw, Home, PhoneCall, ShieldCheck } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for development / monitoring
    console.error('App runtime error caught by error boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAF9] text-[#102820]">
      <Header theme="light" />

      <main className="container max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center my-auto">
        {/* Error Shield Badge */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 shadow-xs">
          <AlertCircle className="h-10 w-10 stroke-[2.2]" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3 py-1 text-xs font-bold text-[#065F46] mb-4">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Patient Data Is Protected &amp; Safe</span>
        </span>

        <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#102820] tracking-tight">
          Session Temporarily Interrupted
        </h1>

        <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          An unexpected issue occurred while rendering this healthcare interface. Our clinical operations desk has been notified.
        </p>

        {error.digest && (
          <p className="mt-2 text-[11px] font-mono text-slate-400">
            Error Reference ID: {error.digest}
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-full bg-[#064E3B] px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors cursor-pointer active:scale-98"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-xs font-bold text-[#102820] shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <Home className="h-4 w-4 text-slate-500" />
            <span>Return to Homepage</span>
          </Link>
        </div>

        {/* 24/7 Helpline Card */}
        <div className="mt-12 rounded-2xl border border-[#E2EBE7] bg-white p-5 shadow-xs max-w-md mx-auto text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#065F46]">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xs font-bold text-[#102820]">
                Urgent Medical Inquiries?
              </h2>
              <p className="text-[11px] text-slate-500">
                Call our 24/7 care coordination line at{' '}
                <a href="tel:+18005550199" className="font-bold text-[#065F46] hover:underline">
                  1-800-VELORA (1-800-555-0199)
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
