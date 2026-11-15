'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db, ProviderShiftRecord } from '@/lib/db';
import { ProviderLayout } from '@/components/layout/ProviderLayout';
import {
  Clock,
  CheckCircle2,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export default function ProviderAvailabilityPage() {
  const { currentUser } = useAuth();
  const providerId = currentUser?.id || 'doc-1';

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [maxVisits, setMaxVisits] = useState(6);
  const [surgeEnrolled, setSurgeEnrolled] = useState(true);

  const [selectedZones, setSelectedZones] = useState<string[]>([
    'Springfield Metro',
    'North Suburbs',
    'Downtown Care Corridor',
  ]);

  const [shifts, setShifts] = useState<ProviderShiftRecord[]>([]);

  useEffect(() => {
    const existing = db.getProviderShifts(providerId);
    if (existing && existing.length > 0) {
      setShifts(existing);
    } else {
      const defaultShifts: ProviderShiftRecord[] = [
        { id: 'sh-0', providerId, dayOfWeek: 1, dayName: 'Monday', startTime: '08:00', endTime: '18:00', isActive: true, maxVisitsPerDay: 6, serviceZones: ['Springfield Metro', 'North Suburbs'] },
        { id: 'sh-1', providerId, dayOfWeek: 2, dayName: 'Tuesday', startTime: '08:00', endTime: '18:00', isActive: true, maxVisitsPerDay: 6, serviceZones: ['Springfield Metro', 'North Suburbs'] },
        { id: 'sh-2', providerId, dayOfWeek: 3, dayName: 'Wednesday', startTime: '08:00', endTime: '18:00', isActive: true, maxVisitsPerDay: 6, serviceZones: ['Springfield Metro', 'North Suburbs'] },
        { id: 'sh-3', providerId, dayOfWeek: 4, dayName: 'Thursday', startTime: '08:00', endTime: '18:00', isActive: true, maxVisitsPerDay: 6, serviceZones: ['Springfield Metro', 'North Suburbs'] },
        { id: 'sh-4', providerId, dayOfWeek: 5, dayName: 'Friday', startTime: '08:00', endTime: '16:00', isActive: true, maxVisitsPerDay: 5, serviceZones: ['Springfield Metro', 'North Suburbs'] },
        { id: 'sh-5', providerId, dayOfWeek: 6, dayName: 'Saturday', startTime: '09:00', endTime: '14:00', isActive: false, maxVisitsPerDay: 3, serviceZones: ['Springfield Metro'] },
        { id: 'sh-6', providerId, dayOfWeek: 0, dayName: 'Sunday', startTime: '09:00', endTime: '13:00', isActive: false, maxVisitsPerDay: 2, serviceZones: ['Springfield Metro'] },
      ];
      setShifts(defaultShifts);
      db.setProviderShifts(providerId, defaultShifts);
    }
  }, [providerId]);

  const toggleDay = (idx: number) => {
    const updated = [...shifts];
    updated[idx].isActive = !updated[idx].isActive;
    setShifts(updated);
  };

  const handleTimeChange = (idx: number, field: 'startTime' | 'endTime', val: string) => {
    const updated = [...shifts];
    updated[idx][field] = val;
    setShifts(updated);
  };

  const toggleZone = (zone: string) => {
    setSelectedZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    db.setProviderShifts(providerId, shifts);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const availableZones = [
    'Springfield Metro',
    'North Suburbs',
    'Downtown Care Corridor',
    'East Greenfield',
    'South Lakeview',
    'West Hills Heights',
  ];

  return (
    <ProviderLayout>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#065F46]">
            Scheduling &amp; Dispatch Routing
          </span>
          <h1 className="text-2xl font-black text-[#102723] sm:text-3xl">
            Duty Availability &amp; Shift Windows
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Define your operational days and active consultation windows. Vellora dispatch coordinates patient bedside appointments within these exact boundaries.
          </p>
        </div>

        {/* Priority Emergency Dispatch Banner */}
        <div className="rounded-[24px] border border-[#D1FAE5] bg-[#ECFDF5] p-5 shadow-2xs flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <span className="h-3 w-3 rounded-full bg-[#10B981] animate-pulse shrink-0 mt-1" />
            <div>
              <h3 className="text-sm font-bold text-[#065F46]">
                Priority Same-Day &amp; Urgent Dispatch (1.5x Premium Rate)
              </h3>
              <p className="mt-0.5 text-xs text-slate-600">
                Receive instant priority alerts for acute bedside evaluations within a 10-mile radius.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSurgeEnrolled(!surgeEnrolled)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0 ${
              surgeEnrolled
                ? 'bg-[#065F46] text-white shadow-2xs'
                : 'border border-[#D9ECE7] bg-white text-slate-700 hover:bg-[#F2F8F5]'
            }`}
          >
            {surgeEnrolled ? 'Enrolled in Surge Dispatch' : 'Enable Surge Dispatch'}
          </button>
        </div>

        {/* Service Zones Selection */}
        <div className="rounded-[24px] border border-[#D9ECE7] bg-white p-6 shadow-2xs">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-[#065F46]" />
            <h3 className="text-sm font-bold text-[#102723]">Designated Travel &amp; Service Zones</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Only accept patient requests originating in these selected communities:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {availableZones.map((zone) => {
              const isSelected = selectedZones.includes(zone);
              return (
                <button
                  key={zone}
                  type="button"
                  onClick={() => toggleZone(zone)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                    isSelected
                      ? 'border-[#065F46] bg-[#ECFDF5] text-[#065F46] font-bold'
                      : 'border-[#D9ECE7] bg-[#F7FBF9] text-slate-600 hover:border-[#A7F3D0]'
                  }`}
                >
                  <span>{zone}</span>
                  {isSelected && <CheckCircle2 className="h-4 w-4 text-[#065F46]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Weekly Schedule Form */}
        <div className="rounded-[24px] border border-[#D9ECE7] bg-white p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2F8F5]">
            <div>
              <h3 className="text-base font-bold text-[#102723]">Weekly Shift Recurring Timetable</h3>
              <p className="text-xs text-slate-500">Toggle active operational days and adjust start/end times.</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Max Daily Visits:</span>
              <select
                value={maxVisits}
                onChange={(e) => setMaxVisits(Number(e.target.value))}
                className="rounded-lg border border-[#D9ECE7] bg-[#F7FBF9] px-2.5 py-1 text-xs font-bold text-[#102723]"
              >
                <option value={3}>3 Visits Max</option>
                <option value={5}>5 Visits Max</option>
                <option value={6}>6 Visits Max</option>
                <option value={8}>8 Visits Max</option>
              </select>
            </div>
          </div>

          <form onSubmit={handleSave} className="mt-4 space-y-3">
            <div className="divide-y divide-[#F2F8F5]">
              {shifts.map((item, idx) => (
                <div
                  key={item.dayName}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5"
                >
                  <div className="flex items-center gap-3 sm:w-1/4">
                    <button
                      type="button"
                      onClick={() => toggleDay(idx)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        item.isActive ? 'bg-[#065F46]' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                          item.isActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span
                      className={`text-xs font-bold ${
                        item.isActive ? 'text-[#102723]' : 'text-slate-400'
                      }`}
                    >
                      {item.dayName}
                    </span>
                  </div>

                  {item.isActive ? (
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 text-[11px]">Start:</span>
                        <input
                          type="time"
                          value={item.startTime}
                          onChange={(e) => handleTimeChange(idx, 'startTime', e.target.value)}
                          className="rounded-lg border border-[#D9ECE7] bg-[#F7FBF9] px-2 py-1 text-xs font-mono font-medium"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 text-[11px]">End:</span>
                        <input
                          type="time"
                          value={item.endTime}
                          onChange={(e) => handleTimeChange(idx, 'endTime', e.target.value)}
                          className="rounded-lg border border-[#D9ECE7] bg-[#F7FBF9] px-2 py-1 text-xs font-mono font-medium"
                        />
                      </div>
                      <span className="rounded-md bg-[#ECFDF5] border border-[#D1FAE5] px-2 py-0.5 text-[10px] font-bold text-[#065F46]">
                        Active Shift Window
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-slate-400 italic">
                      Unavailable / Off Duty
                    </span>
                  )}
                </div>
              ))}
            </div>

            {savedSuccess && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Availability timetable and service zones updated! Automated dispatch has synchronized.</span>
              </div>
            )}

            <div className="pt-4 border-t border-[#F2F8F5] flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-[#065F46] hover:bg-[#054d39] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-2xs transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Save Timetable &amp; Zones</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProviderLayout>
  );
}
