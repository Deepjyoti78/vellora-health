'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import {
  ShieldCheck,
  Sliders,
  CheckCircle2,
  Lock,
  Cpu,
  Save,
  Radio,
  FileText,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [surgeActive, setSurgeActive] = useState(false);
  const [smsGateway, setSmsGateway] = useState('SIMULATED_TEST');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const auditLogs = [
    {
      id: 'log-1',
      timestamp: '2026-11-14 06:45:12 UTC',
      actor: 'Super Admin (root)',
      action: 'SERVICE_TARIFF_UPDATE',
      target: 'SVC-101 (Home Doctor Visit)',
      ip: '192.168.1.1 (Authenticated)',
    },
    {
      id: 'log-2',
      timestamp: '2026-11-14 06:30:00 UTC',
      actor: 'System Dispatch Engine',
      action: 'PROVIDER_AUTO_ASSIGNED',
      target: 'BKG-2026-4412 -> Dr. Maya Patel',
      ip: 'Internal Cluster',
    },
    {
      id: 'log-3',
      timestamp: '2026-11-14 05:15:20 UTC',
      actor: 'Super Admin (root)',
      action: 'PAYOUT_BATCH_AUTHORIZED',
      target: 'ACH-2026-WK46 ($32,137.50)',
      ip: '192.168.1.1 (Authenticated)',
    },
    {
      id: 'log-4',
      timestamp: '2026-11-13 18:22:11 UTC',
      actor: 'Chief Medical Officer',
      action: 'PROVIDER_CREDENTIAL_APPROVED',
      target: 'Dr. Ethan Park (MD-CA-448102)',
      ip: '10.0.4.88 (VPN)',
    },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings preview only. Platform configuration is unchanged in this demo.');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#065F46]">
              System Governance
            </span>
            <span className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-bold text-[#065F46]">
              SOC 2 Compliant
            </span>
          </div>
          <h1 className="font-heading text-2xl font-black text-[#102820] sm:text-3xl mt-0.5">
            Settings & Security Audit Trail
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Platform governance rules, testing switches, and immutable compliance audit records.
          </p>
        </div>

        {/* System Settings Form */}
        <div className="rounded-2xl border border-[#E2EBE7] bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-[#F2F8F5] pb-3">
            <Sliders className="h-4 w-4 text-[#065F46]" />
            <h3 className="font-heading text-base font-bold text-[#102820]">
              Platform Core Parameters
            </h3>
          </div>

          <form onSubmit={handleSave} className="mt-4 space-y-4">
            <div className="divide-y divide-[#F2F8F5] text-xs">
              <div className="flex items-center justify-between py-3.5">
                <div>
                  <span className="font-bold text-[#102820] block">
                    Algorithmic Auto-Dispatch
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Automatically matches incoming patient bookings to nearest available verified practitioner within 60 seconds.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoDispatch}
                  onChange={(e) => setAutoDispatch(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#064E3B]"
                />
              </div>

              <div className="flex items-center justify-between py-3.5">
                <div>
                  <span className="font-bold text-[#102820] block">
                    Peak Hours Surge Multiplier (1.5x)
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Applies surge incentives for night shifts and inclement weather emergency calls.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={surgeActive}
                  onChange={(e) => setSurgeActive(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#064E3B]"
                />
              </div>

              <div className="flex items-center justify-between py-3.5">
                <div>
                  <span className="font-bold text-[#102820] block">
                    SMS Gateway Mode
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Current test OTP code is fixed to <strong className="font-mono text-[#065F46]">4829</strong> for development and demonstration.
                  </span>
                </div>
                <select
                  value={smsGateway}
                  onChange={(e) => setSmsGateway(e.target.value)}
                  className="rounded-xl border border-[#E2EBE7] bg-white p-2 text-xs font-semibold text-[#102820] focus:border-[#064E3B] focus:outline-none"
                >
                  <option value="SIMULATED_TEST">Simulated Sandbox (OTP: 4829)</option>
                  <option value="TWILIO_PROD">Twilio Production SMS</option>
                  <option value="AWS_SNS">AWS SNS Telecom</option>
                </select>
              </div>
            </div>

            {savedSuccess && (
              <p className="rounded-lg bg-[#ECFDF5] p-2 text-xs font-bold text-[#065F46] text-center">
                Settings saved and synced across cluster!
              </p>
            )}

            <div className="flex justify-end pt-3 border-t border-[#F2F8F5]">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#064E3B] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#065F46] transition-colors"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Configuration</span>
              </button>
            </div>
          </form>
        </div>

        {/* Security Audit Trail */}
        <div className="overflow-hidden rounded-2xl border border-[#E2EBE7] bg-white shadow-xs">
          <div className="p-5 border-b border-[#E2EBE7] flex items-center justify-between">
            <div>
              <h3 className="font-heading text-base font-bold text-[#102820]">
                Immutable Compliance Audit Logs
              </h3>
              <p className="text-xs text-slate-400">
                HIPAA & SOC 2 Type II audit logging trail.
              </p>
            </div>
            <span className="rounded-full bg-[#ECFDF5] px-3 py-1 font-mono text-[10px] font-bold text-[#065F46]">
              LOG STREAM SECURED
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E2EBE7] text-left text-xs">
              <thead className="bg-[#F2F8F5] font-extrabold uppercase tracking-wider text-[11px] text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">Timestamp (UTC)</th>
                  <th className="px-5 py-3.5">Authenticated Actor</th>
                  <th className="px-5 py-3.5">Security Action</th>
                  <th className="px-5 py-3.5">Target Entity</th>
                  <th className="px-5 py-3.5 text-right">Source IP / Host</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F8F5] bg-white font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F9FCFA] transition-colors">
                    <td className="px-5 py-3.5 text-slate-400">{log.timestamp}</td>
                    <td className="px-5 py-3.5 font-bold text-[#102820]">{log.actor}</td>
                    <td className="px-5 py-3.5 text-[#065F46] font-bold">{log.action}</td>
                    <td className="px-5 py-3.5 text-slate-700">{log.target}</td>
                    <td className="px-5 py-3.5 text-slate-400 text-right">{log.ip}</td>
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
