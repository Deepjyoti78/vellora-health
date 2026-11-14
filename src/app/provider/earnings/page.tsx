'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';
import { ProviderLayout } from '@/components/layout/ProviderLayout';
import { Icon } from '@/components/common/Icon';

export default function ProviderEarningsPage() {
  const { currentUser } = useAuth();
  const [payouts, setPayouts] = useState(db.getPayouts(currentUser.id));
  const [instantPayoutDone, setInstantPayoutDone] = useState(false);

  const totalEarned = payouts.reduce((sum, p) => sum + p.netPayout, 0) + 1485;

  const handleInstantPayout = () => {
    setInstantPayoutDone(true);
    setTimeout(() => setInstantPayoutDone(false), 5000);
  };

  return (
    <ProviderLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#116b70]">
            Financial Ledger
          </span>
          <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
            Earnings & Direct Deposits
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Track your completed clinical shifts, net remuneration, and automated Friday ACH transfers.
          </p>
        </div>

        {/* Financial KPI Cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
            <span className="text-xs font-bold uppercase text-gray-400">Available For Cashout</span>
            <div className="mt-2 text-3xl font-black text-[#116b70]">$1,485.00</div>
            <p className="mt-1 text-xs text-gray-500">Accrued from 9 completed shifts this week</p>
            <button
              type="button"
              onClick={handleInstantPayout}
              className="mt-4 w-full rounded-xl bg-[#116b70] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0d5559] transition-colors"
            >
              Instant Transfer to Chase Bank (•••• 4921)
            </button>
            {instantPayoutDone && (
              <p className="mt-2 text-xs font-bold text-emerald-700 text-center">
                Instant deposit initiated! Funds will arrive in minutes.
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
            <span className="text-xs font-bold uppercase text-gray-400">Next Scheduled Payout</span>
            <div className="mt-2 text-3xl font-black text-gray-900">Friday, Nov 20</div>
            <p className="mt-1 text-xs text-gray-500">Automatic free ACH direct deposit to primary bank</p>
            <div className="mt-4 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
              <span className="font-bold text-gray-800">Primary Account:</span>
              <p>JPMorgan Chase Bank • Checking • Routing 121000358</p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
            <span className="text-xs font-bold uppercase text-gray-400">Total YTD Earnings</span>
            <div className="mt-2 text-3xl font-black text-gray-900">${totalEarned.toLocaleString()}</div>
            <p className="mt-1 text-xs text-emerald-700 font-semibold">+22% compared to last quarter</p>
            <div className="mt-4 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
              <span className="font-bold text-gray-800">Platform Split:</span>
              <p>75% Clinician Remuneration • 25% Operations & Malpractice Umbrella</p>
            </div>
          </div>
        </div>

        {/* Payout History Ledger */}
        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
          <h3 className="text-base font-bold text-gray-900">Historical Settlement Statements</h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Bi-weekly itemized payment vouchers with IRS 1099 accounting codes.
          </p>

          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
              <thead className="bg-gray-100 font-bold text-gray-700">
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
              <tbody className="divide-y divide-gray-100 bg-white">
                {payouts.map((pay) => (
                  <tr key={pay.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{pay.period}</td>
                    <td className="px-4 py-3 text-gray-600">{pay.visitsCount} visits</td>
                    <td className="px-4 py-3 font-mono text-gray-900">${pay.totalEarnings}</td>
                    <td className="px-4 py-3 font-mono text-gray-500">-${pay.commission}</td>
                    <td className="px-4 py-3 font-mono font-black text-emerald-700">
                      ${pay.netPayout}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                        {pay.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-400 text-right">
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
