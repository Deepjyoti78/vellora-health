'use client';

import React, { useState } from 'react';
import { db, ServiceRecord } from '@/lib/db';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Icon } from '@/components/common/Icon';

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
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#116b70]">
              Clinical Catalog & Pricing Engine
            </span>
            <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
              Healthcare Service Lines & Tariffs
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Configure base procedure fees, shift surcharges, and active service line offerings.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    {svc.categoryLabel}
                  </span>
                  <div className="text-right">
                    <span className="text-xl font-black text-gray-900">${svc.basePrice}</span>
                    <span className="block text-[10px] text-gray-400">Base Visit Fee</span>
                  </div>
                </div>

                <h3 className="mt-4 text-base font-bold text-gray-900">{svc.name}</h3>
                <p className="mt-1 text-xs text-gray-600 line-clamp-2">{svc.shortDesc}</p>

                <div className="mt-4 border-t border-gray-100 pt-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Procedures Included
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {svc.features.map((feat, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-gray-50 px-2 py-0.5 text-[10px] text-gray-600 font-medium"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4 flex items-center justify-between">
                <span className="text-xs text-emerald-700 font-semibold">● Active in Patient App</span>
                <button
                  type="button"
                  onClick={() => handleEdit(svc)}
                  className="rounded-xl bg-[#116b70] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0d5559] transition-colors"
                >
                  Edit Pricing & Tariffs
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Pricing Modal */}
        {editingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-gray-900">
                  Edit Service: {editingService.name}
                </h3>
                <button
                  onClick={() => setEditingService(null)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700">Service Line Title</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">Base Procedure Tariff ($)</label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">Short Summary</label>
                  <textarea
                    rows={3}
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-xs"
                  />
                </div>

                {savedSuccess && (
                  <p className="text-xs font-bold text-emerald-700 text-center">
                    Service pricing updated across all booking workflows!
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#116b70] px-5 py-2 text-xs font-bold text-white hover:bg-[#0d5559] shadow-sm"
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
