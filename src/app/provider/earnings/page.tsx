'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';
import { ProviderLayout } from '@/components/layout/ProviderLayout';
import {
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  Building,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export default function ProviderEarningsPage() {
  const { currentUser } = useAuth();
  const [payouts] = useState(() => (currentUser ? db.getPayouts(currentUser.id) : []));
  const [instantPayoutDone, setInstantPayoutDone] = useState(false);

  const totalEarned = payouts.reduce((sum, p) => sum + p.netPayout, 0) + 1485;

  const handleInstantPayout = () => {
    alert('Payouts require a live payment service. No transfer was made.');
    setTimeout(() => setInstantPayoutDone(false), 5000);
  };

  return (
    <ProviderLayout>
      <div className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 space-y-6">
        <div className="animate-fade-in-up">
          <span className="text-xs font-bold uppercase tracking-wider text-[#065F46]">
            Practitioner Financial Ledger
          </span>
          <h1 className="font-heading text-2xl font-black text-[#15212B] sm:text-3xl tracking-tight mt-0.5">
            Earnings &amp; Direct Deposits
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Track completed clinical visits, net remuneration, deductions, and automated weekly electronic remittances.
          </p>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-[24px] border border-[#D9ECE7] bg-white p-6 shadow-2xs provider-card-lift transition-all duration-300 animate-fade-in-up animate-delay-1">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Available For Cashout</span>
            <div className="mt-2 font-heading text-3xl font-black text-[#065F46] tracking-tight tabular-nums">$1,485.00</div>
            <p className="mt-1 text-xs text-slate-500">Accrued from 9 completed home shifts this week</p>
            <button
              type="button"
              onClick={handleInstantPayout}
              className="mt-4 w-full rounded-xl bg-[#065F46] hover:bg-[#054d39] py-2.5 text-xs font-bold text-white shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Instant Transfer to Chase Bank (•••• 4921)
            </button>
            {instantPayoutDone && (
              <p className="mt-2 text-xs font-bold text-emerald-700 text-center animate-fade-in-up">
                Instant deposit initiated! Funds will arrive in minutes.
              </p>
            )}
          </div>

          <div className="rounded-[24px] border border-[#D9ECE7] bg-white p-6 shadow-2xs provider-card-lift transition-all duration-300 animate-fade-in-up animate-delay-2">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Next Scheduled Payout</span>
            <div className="mt-2 font-heading text-3xl font-black text-[#15212B] tracking-tight">Friday, Nov 20</div>
            <p className="mt-1 text-xs text-slate-500">Automatic free ACH direct deposit to primary bank</p>
            <div className="mt-4 rounded-xl bg-[#F7FBF9] border border-[#D9ECE7] p-3 text-xs text-slate-600">
              <span className="font-bold text-[#102723]">Primary Account:</span>
              <p className="font-medium text-slate-700">JPMorgan Chase Bank • Checking • Routing 121000358</p>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#D9ECE7] bg-white p-6 shadow-2xs provider-card-lift transition-all duration-300 animate-fade-in-up animate-delay-3">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Total YTD Earnings</span>
            <div className="mt-2 font-heading text-3xl font-black text-[#15212B] tracking-tight tabular-nums">${totalEarned.toLocaleString()}</div>
            <p className="mt-1 text-xs text-emerald-700 font-semibold">+22% compared to last quarter</p>
            <div className="mt-4 rounded-xl bg-[#F7FBF9] border border-[#D9ECE7] p-3 text-xs text-slate-600">
              <span className="font-bold text-[#102723]">Remuneration Split:</span>
              <p className="font-medium text-slate-700">75% Clinician Net • 25% Dispatch &amp; Malpractice Umbrella</p>
            </div>
          </div>
        </div>

        {/* Payout History Ledger */}
        <div className="rounded-[24px] border border-[#D9ECE7] bg-white p-6 shadow-2xs provider-card-lift transition-all duration-300 animate-fade-in-up animate-delay-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F2F8F5]">
            <div>
              <h3 className="font-heading text-base font-extrabold text-[#15212B] tracking-tight">Historical Settlement Statements</h3>
              <p className="text-xs text-slate-500">
                Itemized payment vouchers with IRS 1099 accounting codes.
              </p>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-[#D9ECE7]">
            <table className="min-w-full divide-y divide-[#D9ECE7] text-left text-xs">
              <thead className="bg-[#F7FBF9] font-bold text-slate-700">
                <tr>
                  <th className="px-4 py-3">Pay Period</th>
                  <th className="px-4 py-3">Visits / Shifts</th>
                  <th className="px-4 py-3">Gross Total</th>
                  <th className="px-4 py-3">Platform Fee (25%)</th>
                  <th className="px-4 py-3">Net Remittance</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Reference ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F8F5] bg-white">
                {payouts.map((pay) => (
                  <tr key={pay.id} className="hover:bg-[#F2F8F5] transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#102723]">{pay.period}</td>
                    <td className="px-4 py-3 text-slate-600">{pay.visitsCount} visits</td>
                    <td className="px-4 py-3 font-mono text-slate-900">${pay.totalEarnings}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">-${pay.commission}</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#065F46]">
                      ${pay.netPayout}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                        {pay.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400 text-right">
                      {pay.transactionRef}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
}
