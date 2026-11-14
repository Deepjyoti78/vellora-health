'use client';

import React, { useState } from 'react';
import { db, SupportTicketRecord } from '@/lib/db';
import { AdminLayout } from '@/components/layout/AdminLayout';
import {
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export default function AdminFeedbackPage() {
  const [tickets, setTickets] = useState<SupportTicketRecord[]>(db.getSupportTickets());

  const handleUpdateStatus = (id: string, status: SupportTicketRecord['status']) => {
    db.updateTicketStatus(id, status);
    setTickets([...db.getSupportTickets()]);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#065F46]">
                Care Quality & Patient Safety
              </span>
              <span className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-bold text-[#065F46]">
                {tickets.filter((t) => t.status !== 'RESOLVED').length} Active Inquiries
              </span>
            </div>
            <h1 className="font-heading text-2xl font-black text-[#102820] sm:text-3xl mt-0.5">
              Quality Assurance & Support Tickets
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Triage patient inquiries, post-visit satisfaction reviews, and clinical safety escalations.
            </p>
          </div>
        </div>

        {/* Support Tickets Queue */}
        <div className="overflow-hidden rounded-2xl border border-[#E2EBE7] bg-white shadow-xs">
          <div className="p-5 border-b border-[#E2EBE7]">
            <h3 className="font-heading text-base font-bold text-[#102820]">
              Active Support & Dispute Inquiries
            </h3>
            <p className="text-xs text-slate-400">
              Submitted by patients, care recipients, and mobile clinicians.
            </p>
          </div>

          <div className="divide-y divide-[#F2F8F5]">
            {tickets.map((t) => {
              const isUrgent = t.priority === 'URGENT' || t.priority === 'HIGH';
              const isResolved = t.status === 'RESOLVED';

              return (
                <div
                  key={t.id}
                  className="p-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center hover:bg-[#F9FCFA] transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-400">
                        {t.ticketNumber}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isUrgent
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {t.priority}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isResolved
                            ? 'bg-[#ECFDF5] text-[#065F46]'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>

                    <h4 className="font-heading text-sm font-bold text-[#102820]">
                      {t.subject}
                    </h4>
                    <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                      {t.message}
                    </p>
                    <span className="block text-[11px] text-slate-400">
                      From: <strong className="text-slate-600">{t.userName}</strong> ({t.role}) • {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    {!isResolved ? (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(t.id, 'RESOLVED')}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#064E3B] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#065F46] transition-colors"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(t.id, 'IN_REVIEW')}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2EBE7] bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-[#F2F8F5] transition-colors"
                      >
                        <RefreshCw className="h-3 w-3 text-slate-400" />
                        <span>Reopen</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
