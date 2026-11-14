'use client';

import React, { useState } from 'react';
import { db, PayoutRecord } from '@/lib/db';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Icon } from '@/components/common/Icon';

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
    setTimeout(() => setApprovedBatch(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#116b70]">
              Financial Ledger & Treasury
            </span>
            <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
              Platform Finance & Payout Settlements
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Bi-weekly practitioner ACH transfers, platform margin retention, and Stripe payment gateway reconciliation.
            </p>
          </div>

          <button
            type="button"
            onClick={handleApproveAll}
            className="flex items-center gap-2 rounded-xl bg-[#116b70] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0d5559] transition-colors self-start sm:self-center"
          >
            Approve All Pending ACH Payouts
          </button>
        </div>

        {approvedBatch && (
          <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200 text-xs font-bold text-emerald-800">
            Batch approved successfully! Automated ACH direct deposit instructions dispatched to Federal Reserve ACH network.
          </div>
        )}

        {/* Ledger Overview Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
            <span className="text-xs font-bold uppercase text-gray-500">Gross Booking Volume</span>
            <div className="mt-2 text-2xl font-black text-gray-900">$42,850.00</div>
            <p className="mt-1 text-xs text-gray-400">Total customer card & insurance charges</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
            <span className="text-xs font-bold uppercase text-gray-500">Platform Net Margin (25%)</span>
            <div className="mt-2 text-2xl font-black text-[#116b70]">$10,712.50</div>
            <p className="mt-1 text-xs text-emerald-700 font-semibold">Retained operating revenue</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
            <span className="text-xs font-bold uppercase text-gray-500">Clinician Remittances</span>
            <div className="mt-2 text-2xl font-black text-gray-900">$32,137.50</div>
            <p className="mt-1 text-xs text-gray-400">Net provider earnings after platform split</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
            <span className="text-xs font-bold uppercase text-gray-500">Awaiting Settlement</span>
            <div className="mt-2 text-2xl font-black text-amber-600">$1,485.00</div>
            <p className="mt-1 text-xs text-amber-700 font-semibold">Scheduled for Friday cycle</p>
          </div>
        </div>

        {/* Payout Settlements Table */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xs">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">Clinician Direct Deposit Batches</h3>
              <p className="text-xs text-gray-500">Itemized shift payouts and bank routing references.</p>
            </div>
            <button
              onClick={() => window.print()}
              className="rounded-xl border border-gray-200 px-3.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              Print Remittance Slips
            </button>
          </div>

          <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
            <thead className="bg-gray-50 font-bold text-gray-700">
              <tr>
                <th className="px-4 py-3.5">Provider Name</th>
                <th className="px-4 py-3.5">Pay Cycle</th>
                <th className="px-4 py-3.5">Shifts</th>
                <th className="px-4 py-3.5">Gross Earned</th>
                <th className="px-4 py-3.5">Platform Take (25%)</th>
                <th className="px-4 py-3.5">Net Remitted</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3.5 font-bold text-gray-900">{p.providerName}</td>
                  <td className="px-4 py-3.5 text-gray-600">{p.period}</td>
                  <td className="px-4 py-3.5 text-gray-600">{p.visitsCount} visits</td>
                  <td className="px-4 py-3.5 font-mono text-gray-900">${p.totalEarnings}</td>
                  <td className="px-4 py-3.5 font-mono text-gray-500">-${p.commission}</td>
                  <td className="px-4 py-3.5 font-mono font-black text-emerald-700">
                    ${p.netPayout}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        p.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {p.status !== 'PAID' ? (
                      <button
                        type="button"
                        onClick={() => handleApprove(p.id)}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                      >
                        Approve Transfer
                      </button>
                    ) : (
                      <span className="font-mono text-[10px] text-gray-400">{p.transactionRef}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
