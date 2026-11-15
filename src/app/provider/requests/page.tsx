'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db, JobOfferRecord, BookingRecord } from '@/lib/db';
import { ProviderLayout } from '@/components/layout/ProviderLayout';
import {
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export default function ProviderJobRequestsPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const providerId = currentUser?.id || 'doc-1';

  const [jobOffers, setJobOffers] = useState<JobOfferRecord[]>([]);
  const [unassignedBookings, setUnassignedBookings] = useState<BookingRecord[]>([]);
  const [acceptedId, setAcceptedId] = useState<string | null>(null);

  const loadData = () => {
    // 1. Get explicit job offers
    const offers = db.getJobOffers(providerId).filter((o) => o.status === 'OFFERED');
    setJobOffers(offers);

    // 2. Also check confirmed bookings waiting for a provider matching role
    const allBookings = db.getBookings();
    const available = allBookings.filter((b) => {
      if (b.providerId) return false;
      return b.status === 'CONFIRMED' || b.status === 'REQUESTED';
    });
    setUnassignedBookings(available);
  };

  useEffect(() => {
    loadData();
  }, [providerId]);

  const handleAcceptOffer = (offer: JobOfferRecord) => {
    db.respondToJobOffer(offer.id, true);
    db.assignProvider(offer.bookingId, providerId);
    db.updateBookingStatus(offer.bookingId, 'ASSIGNED');

    setAcceptedId(offer.bookingId);
    setTimeout(() => {
      router.push(`/provider/appointments/${offer.bookingId}`);
    }, 600);
  };

  const handleDeclineOffer = (offerId: string) => {
    db.respondToJobOffer(offerId, false);
    loadData();
  };

  const handleClaimBooking = (booking: BookingRecord) => {
    db.assignProvider(booking.id, providerId);
    db.updateBookingStatus(booking.id, 'ASSIGNED');

    setAcceptedId(booking.id);
    setTimeout(() => {
      router.push(`/provider/appointments/${booking.id}`);
    }, 600);
  };

  const totalOffersCount = jobOffers.length + unassignedBookings.length;

  return (
    <ProviderLayout>
      <div className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#065F46]">
                Real-Time Dispatch Console
              </span>
              <span className="rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-2.5 py-0.5 text-[11px] font-bold text-[#065F46]">
                {totalOffersCount} Active Offers
              </span>
            </div>
            <h1 className="font-heading text-2xl font-black text-[#15212B] sm:text-3xl tracking-tight mt-0.5">
              Incoming Visit Dispatches
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Review nearby patient care requests matched to your clinical credentials and travel zones.
            </p>
          </div>

          <Link
            href="/provider/appointments"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9ECE7] bg-white hover:bg-[#F2F8F5] px-4 py-2.5 text-xs font-bold text-[#102723] shadow-2xs hover:shadow-xs transition-all self-start sm:self-center"
          >
            <span>My Active Schedule</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Accepted notification pill */}
        {acceptedId && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2 shadow-2xs animate-fade-in-up">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 animate-bounce" />
            <span>Visit accepted! Launching clinical appointment cockpit...</span>
          </div>
        )}

        {/* Job Offers List */}
        <div className="space-y-4">
          {totalOffersCount === 0 ? (
            <div className="rounded-[24px] border border-dashed border-[#D9ECE7] bg-white p-12 text-center text-slate-500 animate-fade-in-up">
              <Bell className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <h3 className="font-heading font-extrabold text-sm text-[#102723]">No Active Dispatch Requests Right Now</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                You are currently on duty and eligible for new patient requests. When patients book in your service zones, new job offers will appear here automatically.
              </p>
            </div>
          ) : (
            <>
              {/* Direct Job Offers */}
              {jobOffers.map((offer, oIdx) => (
                <div
                  key={offer.id}
                  className={`rounded-[22px] border border-[#D1FAE5] bg-gradient-to-r from-white via-white to-[#F2F8F5] p-6 shadow-2xs provider-card-lift transition-all duration-300 animate-fade-in-up animate-delay-${Math.min(oIdx + 1, 4)}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2F8F5]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                          <Sparkles className="h-3 w-3 text-emerald-600" />
                          DIRECT DISPATCH OFFER
                        </span>
                        <span className="font-mono text-xs text-slate-400">{offer.id}</span>
                      </div>
                      <h3 className="font-heading text-lg font-extrabold text-[#15212B] tracking-tight mt-1">{offer.serviceName}</h3>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Estimated Net Payout</span>
                      <p className="font-heading text-2xl font-black text-[#065F46] tracking-tight tabular-nums">${offer.estimatedFee}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar className="h-4 w-4 text-[#065F46] shrink-0" />
                      <span>{offer.scheduledDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock className="h-4 w-4 text-[#065F46] shrink-0" />
                      <span className="font-mono font-medium">{offer.scheduledTimeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <MapPin className="h-4 w-4 text-[#065F46] shrink-0" />
                      <span>{offer.addressArea}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#F2F8F5] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <ShieldCheck className="h-4 w-4 text-[#065F46]" />
                      <span>Verified Patient • 4-Digit Bedside PIN Security Enabled</span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handleDeclineOffer(offer.id)}
                        className="flex-1 sm:flex-initial rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAcceptOffer(offer)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#065F46] hover:bg-[#054d39] px-6 py-2 text-xs font-bold text-white shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Accept Visit (${offer.estimatedFee})</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Unassigned Pool Bookings */}
              {unassignedBookings.map((b, bIdx) => (
                <div
                  key={b.id}
                  className={`rounded-[22px] border border-[#D9ECE7] bg-white p-6 shadow-2xs provider-card-lift transition-all duration-300 animate-fade-in-up animate-delay-${Math.min(bIdx + 2, 5)}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2F8F5]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-blue-800">
                          OPEN DISPATCH POOL
                        </span>
                        <span className="font-mono text-xs text-slate-400">{b.bookingNumber}</span>
                      </div>
                      <h3 className="font-heading text-lg font-extrabold text-[#15212B] tracking-tight mt-1">{b.serviceName}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Patient: <strong className="text-slate-700">{b.patientName}</strong></p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Estimated Net Payout</span>
                      <p className="font-heading text-2xl font-black text-[#065F46] tracking-tight tabular-nums">${b.totalAmount}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar className="h-4 w-4 text-[#065F46] shrink-0" />
                      <span>{b.scheduledDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock className="h-4 w-4 text-[#065F46] shrink-0" />
                      <span className="font-mono font-medium">{b.scheduledTimeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <MapPin className="h-4 w-4 text-[#065F46] shrink-0" />
                      <span className="truncate">{b.addressText || 'Springfield Care Zone'}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#F2F8F5] flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[11px] text-slate-500">
                      Auto-matched based on your verified credentials
                    </div>

                    <button
                      type="button"
                      onClick={() => handleClaimBooking(b)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#065F46] hover:bg-[#054d39] px-6 py-2 text-xs font-bold text-white shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Claim &amp; Accept Visit</span>
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </ProviderLayout>
  );
}
