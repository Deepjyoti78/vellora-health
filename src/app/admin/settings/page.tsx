'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Icon } from '@/components/common/Icon';

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
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#116b70]">
            System Configuration
          </span>
          <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
            Settings & Security Audit Trail
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Platform governance rules, testing switches, and immutable compliance audit records.
          </p>
        </div>

        {/* System Settings Form */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
          <h3 className="text-base font-bold text-gray-900">Platform Core Parameters</h3>

          <form onSubmit={handleSave} className="mt-4 space-y-4">
            <div className="divide-y divide-gray-100 text-xs">
              <div className="flex items-center justify-between py-3">
                <div>
                  <span className="font-bold text-gray-900 block">Algorithmic Auto-Dispatch</span>
                  <span className="text-gray-500">
                    Automatically matches incoming patient bookings to nearest available verified practitioner within 60 seconds.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoDispatch}
                  onChange={(e) => setAutoDispatch(e.target.checked)}
                  className="h-4 w-4 rounded text-[#116b70]"
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <span className="font-bold text-gray-900 block">Peak Hours Surge Multiplier (1.5x)</span>
                  <span className="text-gray-500">
                    Applies surge incentives for night shifts and inclement weather emergency calls.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={surgeActive}
                  onChange={(e) => setSurgeActive(e.target.checked)}
                  className="h-4 w-4 rounded text-[#116b70]"
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <span className="font-bold text-gray-900 block">SMS Gateway Mode</span>
                  <span className="text-gray-500">
                    Current test OTP code is fixed to <strong className="font-mono text-[#116b70]">4829</strong> for development and demonstration.
                  </span>
                </div>
                <select
                  value={smsGateway}
                  onChange={(e) => setSmsGateway(e.target.value)}
                  className="rounded-lg border border-gray-300 p-1.5 text-xs font-bold"
                >
                  <option value="SIMULATED_TEST">Simulated Sandbox (OTP: 4829)</option>
                  <option value="TWILIO_PROD">Twilio Production SMS</option>
                  <option value="AWS_SNS">AWS SNS Telecom</option>
                </select>
              </div>
            </div>

            {savedSuccess && (
              <p className="text-xs font-bold text-emerald-700">Settings saved and synced across cluster!</p>
            )}

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                type="submit"
                className="rounded-xl bg-[#116b70] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-[#0d5559]"
              >
                Save Configuration
              </button>
            </div>
          </form>
        </div>

        {/* Security Audit Trail */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xs">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">Immutable Compliance Audit Logs</h3>
              <p className="text-xs text-gray-500">HIPAA & SOC 2 Type II audit logging trail.</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-mono text-[10px] font-bold text-emerald-800">
              LOG STREAM SECURED
            </span>
          </div>

          <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
            <thead className="bg-gray-50 font-bold text-gray-700">
              <tr>
                <th className="px-4 py-3">Timestamp (UTC)</th>
                <th className="px-4 py-3">Authenticated Actor</th>
                <th className="px-4 py-3">Security Action</th>
                <th className="px-4 py-3">Target Entity</th>
                <th className="px-4 py-3 text-right">Source IP / Host</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white font-mono">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{log.timestamp}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{log.actor}</td>
                  <td className="px-4 py-3 text-[#116b70] font-bold">{log.action}</td>
                  <td className="px-4 py-3 text-gray-800">{log.target}</td>
                  <td className="px-4 py-3 text-gray-400 text-right">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
