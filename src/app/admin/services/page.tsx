'use client';

import React, { useState } from 'react';
import { db, ServiceRecord } from '@/lib/db';
import { AdminLayout } from '@/components/layout/AdminLayout';
import {
  Layers,
  DollarSign,
  Edit3,
  CheckCircle2,
  Sparkles,
  X,
  Plus,
} from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceRecord[]>(db.getServices());
  const [editingService, setEditingService] = useState<ServiceRecord | null>(null);
  const [basePrice, setBasePrice] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [shortDesc, setShortDesc] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleEdit = (svc: ServiceRecord) => {
    setEditingService(svc);
    setBasePrice(svc.basePrice);
    setName(svc.name);
    setShortDesc(svc.shortDesc);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    db.updateService(editingService.id, {
      name,
      basePrice,
      shortDesc,
    });

    setServices([...db.getServices()]);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setEditingService(null);
    }, 1200);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#065F46]">
                Clinical Catalog & Pricing Engine
              </span>
              <span className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-bold text-[#065F46]">
                {services.length} Service Lines Active
              </span>
            </div>
            <h1 className="font-heading text-2xl font-black text-[#102820] sm:text-3xl mt-0.5">
              Healthcare Service Lines & Tariffs
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Configure base procedure fees, shift surcharges, and active doorstep service line offerings.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="flex flex-col justify-between rounded-2xl border border-[#E2EBE7] bg-white p-6 shadow-xs hover:border-[#CBDCD5] hover:shadow-sm transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="rounded-lg bg-[#ECFDF5] px-2.5 py-1 text-xs font-bold text-[#065F46] border border-[#D1FAE5]">
                    {svc.categoryLabel}
                  </span>
                  <div className="text-right">
                    <span className="font-heading text-2xl font-black text-[#102820]">
                      ${svc.basePrice}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-medium">
                      Base Visit Fee
                    </span>
                  </div>
                </div>

                <h3 className="mt-3 font-heading text-base font-bold text-[#102820]">
                  {svc.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                  {svc.shortDesc}
                </p>

                <div className="mt-4 border-t border-[#F2F8F5] pt-3">
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    Procedures Included
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {svc.features.map((feat, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-[#F5F9F7] border border-[#E2EBE7] px-2.5 py-1 text-[11px] text-slate-600 font-medium"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#F2F8F5] pt-4 text-xs">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#065F46]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Active in Patient App</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleEdit(svc)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#064E3B] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#065F46] transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Tariff</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Pricing Modal */}
        {editingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl border border-[#E2EBE7] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[#E2EBE7] pb-3">
                <h3 className="font-heading text-base font-bold text-[#102820]">
                  Edit Service: {editingService.name}
                </h3>
                <button
                  onClick={() => setEditingService(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-[#F2F8F5] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#102820]">Service Line Title</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-[#E2EBE7] p-2.5 text-xs font-semibold text-[#102820] focus:border-[#064E3B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#102820]">Base Procedure Tariff ($)</label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="mt-1 block w-full rounded-xl border border-[#E2EBE7] p-2.5 text-xs font-mono font-bold text-[#102820] focus:border-[#064E3B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#102820]">Short Summary</label>
                  <textarea
                    rows={3}
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-[#E2EBE7] p-2.5 text-xs text-slate-700 focus:border-[#064E3B] focus:outline-none"
                  />
                </div>

                {savedSuccess && (
                  <p className="rounded-lg bg-[#ECFDF5] p-2 text-xs font-bold text-[#065F46] text-center">
                    Service pricing updated across all booking workflows!
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-[#F2F8F5]">
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="rounded-xl border border-[#E2EBE7] px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-[#F2F8F5] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#064E3B] px-5 py-2 text-xs font-semibold text-white hover:bg-[#065F46] shadow-xs transition-colors"
                  >
                    Save & Deploy Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
