'use client';

import React, { useState } from 'react';
import { db, PayoutRecord } from '@/lib/db';
import { AdminLayout } from '@/components/layout/AdminLayout';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  Printer,
  ArrowUpRight,
} from 'lucide-react';

export default function AdminFinancePage() {
  const [payouts, setPayouts] = useState<PayoutRecord[]>(db.getPayouts());
  const [approvedBatch, setApprovedBatch] = useState(false);

  const handleApprove = (id: string) => {
    db.updatePayoutStatus(id, 'PAID');
    setPayouts([...db.getPayouts()]);
  };

  const handleApproveAll = () => {
    payouts.forEach((p) => {
      if (p.status === 'PENDING') db.updatePayoutStatus(p.id, 'PAID');
    });
    setPayouts([...db.getPayouts()]);
    setApprovedBatch(true);
    setTimeout(() => setApprovedBatch(false), 2500);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#065F46]">
                Financial Ledger & Treasury
              </span>
              <span className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-bold text-[#065F46]">
                ACH Gateway Live
              </span>
            </div>
            <h1 className="font-heading text-2xl font-black text-[#102820] sm:text-3xl mt-0.5">
              Platform Finance & Payout Settlements
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Bi-weekly practitioner ACH transfers, platform margin retention, and Stripe payment gateway reconciliation.
            </p>
          </div>

          <button
            type="button"
            onClick={handleApproveAll}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#064E3B] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#065F46] transition-colors self-start sm:self-center"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Approve All Pending Payouts</span>
          </button>
        </div>

        {approvedBatch && (
          <div className="rounded-xl bg-[#ECFDF5] p-3.5 border border-[#D1FAE5] text-xs font-bold text-[#065F46] animate-in fade-in">
            Batch approved successfully! Automated ACH direct deposit instructions dispatched to Federal Reserve ACH network.
          </div>
        )}

        {/* Ledger Overview Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#E2EBE7] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Gross Booking Volume</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#065F46]">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 font-heading text-2xl font-black text-[#102820]">
              $42,850.00
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Total customer card charges</p>
          </div>

          <div className="rounded-2xl border border-[#E2EBE7] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Platform Margin (25%)</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#065F46]">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 font-heading text-2xl font-black text-[#065F46]">
              $10,712.50
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Retained operating revenue</p>
          </div>

          <div className="rounded-2xl border border-[#E2EBE7] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Clinician Remittances</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#065F46]">
                <Building className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 font-heading text-2xl font-black text-[#102820]">
              $32,137.50
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Net provider earnings</p>
          </div>

          <div className="rounded-2xl border border-[#E2EBE7] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Awaiting Settlement</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 font-heading text-2xl font-black text-amber-700">
              $1,485.00
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Scheduled for Friday cycle</p>
          </div>
        </div>

        {/* Payout Settlements Table */}
        <div className="overflow-hidden rounded-2xl border border-[#E2EBE7] bg-white shadow-xs">
          <div className="p-5 border-b border-[#E2EBE7] flex items-center justify-between">
            <div>
              <h3 className="font-heading text-base font-bold text-[#102820]">
                Clinician Direct Deposit Batches
              </h3>
              <p className="text-xs text-slate-400">
                Itemized shift payouts and bank routing transfer references.
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2EBE7] bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#F2F8F5] transition-colors"
            >
              <Printer className="h-3.5 w-3.5 text-slate-400" />
              <span>Print Slips</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E2EBE7] text-left text-xs">
              <thead className="bg-[#F2F8F5] font-extrabold uppercase tracking-wider text-[11px] text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">Provider Name</th>
                  <th className="px-5 py-3.5">Pay Cycle</th>
                  <th className="px-5 py-3.5">Shifts</th>
                  <th className="px-5 py-3.5">Gross Earned</th>
                  <th className="px-5 py-3.5">Platform Split</th>
                  <th className="px-5 py-3.5">Net Remitted</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F8F5] bg-white">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F9FCFA] transition-colors">
                    <td className="px-5 py-4 font-bold text-[#102820]">{p.providerName}</td>
                    <td className="px-5 py-4 text-slate-600">{p.period}</td>
                    <td className="px-5 py-4 text-slate-600">{p.visitsCount} visits</td>
                    <td className="px-5 py-4 font-mono text-[#102820]">${p.totalEarnings}</td>
                    <td className="px-5 py-4 font-mono text-slate-500">-${p.commission}</td>
                    <td className="px-5 py-4 font-mono font-black text-[#065F46]">
                      ${p.netPayout}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          p.status === 'PAID'
                            ? 'bg-[#ECFDF5] text-[#065F46]'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {p.status !== 'PAID' ? (
                        <button
                          type="button"
                          onClick={() => handleApprove(p.id)}
                          className="rounded-xl bg-[#064E3B] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#065F46] transition-colors"
                        >
                          Approve Transfer
                        </button>
                      ) : (
                        <span className="font-mono text-[11px] text-slate-400">
                          {p.transactionRef}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
