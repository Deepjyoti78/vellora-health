'use client';

import React, { useState } from 'react';
import { db, SupportTicketRecord } from '@/lib/db';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Icon } from '@/components/common/Icon';

export default function AdminFeedbackPage() {
  const [tickets, setTickets] = useState<SupportTicketRecord[]>(db.getSupportTickets());
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketRecord | null>(null);

  const handleUpdateStatus = (id: string, status: SupportTicketRecord['status']) => {
    db.updateTicketStatus(id, status);
    setTickets([...db.getSupportTickets()]);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#116b70]">
              Care Quality & Patient Safety
            </span>
            <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
              Quality Assurance & Support Tickets
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Triage patient inquiries, post-visit satisfaction reviews, and clinical safety escalations.
            </p>
          </div>
        </div>

        {/* Support Tickets Queue */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xs">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Active Support & Dispute Inquiries</h3>
            <p className="text-xs text-gray-500">Submitted by patients and mobile clinicians.</p>
          </div>

          <div className="divide-y divide-gray-100">
            {tickets.map((t) => (
              <div key={t.id} className="p-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-500">{t.ticketNumber}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        t.priority === 'URGENT' || t.priority === 'HIGH'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.priority}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        t.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-gray-900">{t.subject}</h4>
                  <p className="text-xs text-gray-600 max-w-2xl">{t.message}</p>
                  <span className="block text-[10px] text-gray-400">
                    From: {t.userName} ({t.role}) • {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  {t.status !== 'RESOLVED' ? (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(t.id, 'RESOLVED')}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      Mark Resolved
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(t.id, 'IN_REVIEW')}
                      className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                    >
                      Reopen Ticket
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
