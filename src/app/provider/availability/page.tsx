'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProviderLayout } from '@/components/layout/ProviderLayout';
import { Icon } from '@/components/common/Icon';

export default function ProviderAvailabilityPage() {
  const { currentUser } = useAuth();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [schedule, setSchedule] = useState([
    { day: 'Monday', enabled: true, start: '08:00', end: '18:00', shift12h: true, shift24h: false },
    { day: 'Tuesday', enabled: true, start: '08:00', end: '18:00', shift12h: true, shift24h: false },
    { day: 'Wednesday', enabled: true, start: '08:00', end: '18:00', shift12h: false, shift24h: false },
    { day: 'Thursday', enabled: true, start: '08:00', end: '18:00', shift12h: true, shift24h: false },
    { day: 'Friday', enabled: true, start: '08:00', end: '16:00', shift12h: false, shift24h: false },
    { day: 'Saturday', enabled: false, start: '09:00', end: '14:00', shift12h: false, shift24h: false },
    { day: 'Sunday', enabled: false, start: '09:00', end: '14:00', shift12h: false, shift24h: false },
  ]);

  const [emergencyOnCall, setEmergencyOnCall] = useState(true);

  const toggleDay = (idx: number) => {
    const updated = [...schedule];
    updated[idx].enabled = !updated[idx].enabled;
    setSchedule(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <ProviderLayout>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#116b70]">
            Scheduling & Shift Management
          </span>
          <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
            Duty Availability & Working Hours
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Define your operational hours and shift preferences. Our automated dispatch matches you to patient requests within these windows.
          </p>
        </div>

        {/* Emergency On-Call Card */}
        <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-xs flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-950">
                Priority Emergency Dispatch (1.5x Surge Payout)
              </h3>
            </div>
            <p className="mt-1 text-xs text-emerald-800">
              Receive immediate notifications for acute same-day home visits within a 10-mile radius.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEmergencyOnCall(!emergencyOnCall)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
              emergencyOnCall
                ? 'bg-[#116b70] text-white shadow-sm'
                : 'border border-gray-300 bg-white text-gray-700'
            }`}
          >
            {emergencyOnCall ? 'Enrolled in Surge Dispatch' : 'Enroll in Surge Dispatch'}
          </button>
        </div>

        {/* Weekly Schedule Form */}
        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
          <h3 className="text-base font-bold text-gray-900">Weekly Shift Recurring Timetable</h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Toggle your active days and adjust working time blocks.
          </p>

          <form onSubmit={handleSave} className="mt-6 space-y-4">
            <div className="divide-y divide-gray-100">
              {schedule.map((item, idx) => (
                <div
                  key={item.day}
                  className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-3 sm:w-1/4">
                    <button
                      type="button"
                      onClick={() => toggleDay(idx)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        item.enabled ? 'bg-[#116b70]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          item.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span
                      className={`text-sm font-bold ${
                        item.enabled ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>

                  {item.enabled ? (
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">From:</span>
                        <input
                          type="time"
                          value={item.start}
                          onChange={(e) => {
                            const up = [...schedule];
                            up[idx].start = e.target.value;
                            setSchedule(up);
                          }}
                          className="rounded-lg border border-gray-300 p-1.5 text-xs font-medium"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">To:</span>
                        <input
                          type="time"
                          value={item.end}
                          onChange={(e) => {
                            const up = [...schedule];
                            up[idx].end = e.target.value;
                            setSchedule(up);
                          }}
                          className="rounded-lg border border-gray-300 p-1.5 text-xs font-medium"
                        />
                      </div>
                      <label className="flex items-center gap-1.5 text-gray-700">
                        <input
                          type="checkbox"
                          checked={item.shift12h}
                          onChange={(e) => {
                            const up = [...schedule];
                            up[idx].shift12h = e.target.checked;
                            setSchedule(up);
                          }}
                          className="h-4 w-4 rounded text-[#116b70]"
                        />
                        <span>Accept 12h Shifts</span>
                      </label>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-gray-400 italic">
                      Unavailable / Off Duty
                    </span>
                  )}
                </div>
              ))}
            </div>

            {savedSuccess && (
              <p className="text-xs font-bold text-emerald-700">
                Availability updated successfully! Dispatch routing has synced.
              </p>
            )}

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-[#116b70] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0d5559] transition-colors"
              >
                Save Schedule Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProviderLayout>
  );
}
