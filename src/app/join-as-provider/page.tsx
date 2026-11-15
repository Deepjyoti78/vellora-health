'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Stethoscope,
  HeartHandshake,
  UserCheck,
  Activity,
  Syringe,
  ShieldCheck,
  Clock,
  DollarSign,
  CalendarCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronRight,
  HelpCircle,
  FileCheck,
} from 'lucide-react';

export default function JoinAsProviderPage() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'DOCTOR' | 'NURSE' | 'CARETAKER' | 'PHYSIOTHERAPIST' | 'PHLEBOTOMIST'>('ALL');

  const providerRoles = [
    {
      id: 'DOCTOR',
      title: 'Visiting Physicians & Doctors',
      qualification: 'MBBS / MD / Specialization with State/National Medical Council License',
      rate: '$95 – $150 per consultation',
      type: 'Flexible Home Visits',
      icon: Stethoscope,
      accent: 'emerald',
      description:
        'Deliver unhurried 45–60 minute bedside consultations, chronic illness evaluations, acute fever assessments, and issue verified digital prescriptions.',
      skills: ['General Health Assessment', 'Bedside Diagnosis', 'Pediatric & Senior Care', 'Digital E-Prescriptions'],
      benefits: ['Choose your preferred service radius', 'Zero clinic overhead expenses', 'Full dispatch & diagnostic backing'],
    },
    {
      id: 'NURSE',
      title: 'Registered Visiting Nurses',
      qualification: 'BSN / GNM / Registered Nurse License with Nursing Council Registration',
      rate: '$65 – $95 per procedure/shift',
      type: 'Home Shifts & Procedures',
      icon: Activity,
      accent: 'teal',
      description:
        'Provide clinical bedside interventions including IV cannulation, catheter care, sterile surgical wound dressing, vital signs monitoring, and post-op rehabilitation.',
      skills: ['Sterile Wound Care', 'IV Fluid Administration', 'Post-Op Observation', 'In-Home Vitals Telemetry'],
      benefits: ['Comprehensive disposable medical kits provided', 'Guaranteed shift buffers', 'Weekly automated direct deposits'],
    },
    {
      id: 'CARETAKER',
      title: 'Elderly & Patient Caretakers',
      qualification: 'Certified Nursing Assistant / Geriatric Care Certificate / Cleared Background Check',
      rate: '$35 – $55 per hour',
      type: 'Half-Day & Full-Day Shifts',
      icon: HeartHandshake,
      accent: 'amber',
      description:
        'Offer compassionate, respectful bedside support including assisted mobility, hygiene maintenance, scheduled medication reminders, and comfort companionship.',
      skills: ['Assisted Bed-to-Chair Transfers', 'Nutritional Meal Support', 'Medication Reminders', 'Daily Hygiene Care'],
      benefits: ['Transparent shift logs with supervisor support', 'Overtime allowances', 'Continuous eldercare skill workshops'],
    },
    {
      id: 'PHYSIOTHERAPIST',
      title: 'Home Physiotherapists',
      qualification: 'BPT / MPT with Registered Physiotherapy Council Certification',
      rate: '$75 – $115 per session',
      type: 'Bedside Rehab Sessions',
      icon: UserCheck,
      accent: 'blue',
      description:
        'Conduct individualized rehabilitation sessions for post-stroke hemiplegia recovery, joint replacement recovery, neurological rehabilitation, and fall prevention.',
      skills: ['Bedside Gait Retraining', 'Post-Surgical Joint Mobilization', 'Neuro Rehab Drills', 'Muscle Strengthening'],
      benefits: ['Direct patient continuity of care', 'Complete session-by-session telemetry tracking', 'No referral commission deductions'],
    },
    {
      id: 'PHLEBOTOMIST',
      title: 'Mobile Phlebotomists & Lab Techs',
      qualification: 'Certified Medical Laboratory Technician (DMLT/BMLT) with Phlebotomy Certification',
      rate: '$40 – $65 per collection',
      type: 'Morning & Slot-Based Visits',
      icon: Syringe,
      accent: 'purple',
      description:
        'Perform painless home blood draws and specimen collections with strict cold-chain maintenance, delivering samples to accredited NABL partner laboratories.',
      skills: ['Venipuncture Mastery', 'Strict Cold-Chain Transport', 'Pediatric & Geriatric Blood Draws', 'Barcode Sample Tagging'],
      benefits: ['Vellora chilled phlebotomy travel kit provided', 'Predictable morning route clustering', 'Instant digital chain-of-custody handoff'],
    },
  ];

  const filteredRoles = activeTab === 'ALL' ? providerRoles : providerRoles.filter((r) => r.id === activeTab);

  const steps = [
    {
      num: '01',
      title: 'Submit Basic Profile & Credentials',
      desc: 'Complete our 5-minute digital registration with your medical council license, qualification details, and practice zones.',
    },
    {
      num: '02',
      title: 'Clinical & Background Verification',
      desc: 'Our Medical Governance Board authenticates your degrees, registration council status, and completes standard criminal background verification.',
    },
    {
      num: '03',
      title: 'Digital Onboarding & Kit Dispatch',
      desc: 'Receive access to your Vellora Practitioner workstation app, clinical orientation, and specialized equipment kit.',
    },
    {
      num: '04',
      title: 'Accept Dispatches & Earn Weekly',
      desc: 'Toggle your availability "On Duty", accept nearby home visit requests matching your specialties, and receive automated weekly payouts.',
    },
  ];

  const perks = [
    {
      icon: Clock,
      title: 'Complete Schedule Autonomy',
      desc: 'Set your exact working hours, toggle duty on/off in real-time, and only accept visits within your preferred travel distance.',
    },
    {
      icon: DollarSign,
      title: 'Transparent Weekly Settlements',
      desc: 'No hidden deductions. Earn premium per-visit or per-shift compensation deposited directly into your bank account every Monday.',
    },
    {
      icon: ShieldCheck,
      title: 'Safety & Bedside Verification',
      desc: 'Every home visit is secured with verified patient identities, live dispatch coordination, and mandatory 4-digit bedside PIN checks.',
    },
    {
      icon: CalendarCheck,
      title: 'Seamless Digital Charting',
      desc: 'No paper charts. Record vitals, diagnosis, prescriptions, or sample tags in seconds directly on your mobile-optimized dashboard.',
    },
  ];

  const faqs = [
    {
      q: 'What credentials are required to practice on Vellora?',
      a: 'Doctors must have valid MBBS/MD qualifications and active State/National Medical Council registration. Nurses must have GNM/B.Sc Nursing with State Nursing Council licenses. Physiotherapists require BPT/MPT certification. Phlebotomists require DMLT/MLT licenses. Caretakers require verified background checks and geriatric care experience.',
    },
    {
      q: 'How long does the verification process take?',
      a: 'Our medical credentials team reviews submitted documents within 24 to 48 business hours. You will receive real-time SMS and email updates on your application status.',
    },
    {
      q: 'Can I practice part-time while working at a hospital or clinic?',
      a: 'Yes. Many of our clinicians work part-time or pick up weekend morning slots around their existing hospital shifts. You are in complete control of your schedule.',
    },
    {
      q: 'How and when are provider earnings paid?',
      a: 'Earnings are tallied daily and disbursed every Monday morning via direct electronic transfer to your verified bank account with itemized statements.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7FBF9] text-[#102723] font-sans antialiased">
      <Header theme="light" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EBF5F1] via-[#F4F9F6] to-[#F7FBF9] py-14 sm:py-20">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#D1FAE5] blur-3xl opacity-60 pointer-events-none" />
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#D9ECE7] px-3.5 py-1 text-xs font-bold text-[#065F46] shadow-2xs mb-4">
              <Sparkles className="h-3.5 w-3.5 text-[#10B981]" />
              <span>PRACTITIONER NETWORK ENROLLMENT</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#102723] leading-[1.15]">
              Deliver Compassionate Healthcare On <span className="text-[#065F46]">Your Own Terms.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Join Vellora Health&apos;s verified clinical fleet. Provide hospital-grade bedside medicine to patients at home while enjoying complete schedule flexibility, transparent weekly settlements, and dedicated dispatch support.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/provider/register"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#065F46] hover:bg-[#054d39] px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-900/10 transition-all hover:scale-[1.02]"
              >
                <span>Apply as a Healthcare Provider</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/provider/login"
                className="inline-flex items-center gap-2 rounded-full border border-[#D9ECE7] bg-white hover:bg-[#F2F8F5] px-6 py-3.5 text-sm font-bold text-[#102723] transition-colors shadow-2xs"
              >
                <span>Already Registered? Sign In</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>

            {/* Quick Trust Highlights */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#D9ECE7]/80">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[#065F46]">$3k – $8k+</p>
                <p className="text-xs text-slate-500 font-medium">Monthly Earning Potential</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[#065F46]">100% Flexible</p>
                <p className="text-xs text-slate-500 font-medium">Choose Hours &amp; Locations</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[#065F46]">Weekly Payouts</p>
                <p className="text-xs text-slate-500 font-medium">Direct Bank Settlement</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[#065F46]">4.9★ Vetted Fleet</p>
                <p className="text-xs text-slate-500 font-medium">Clinical Excellence Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Roles Directory */}
      <section className="py-14 mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#065F46]">Choose Your Specialty</span>
            <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-bold text-[#102723]">
              Who Can Practice With Vellora?
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
              We welcome licensed doctors, nurses, caretakers, physical therapists, and laboratory phlebotomists who uphold the highest ethical bedside standards.
            </p>
          </div>

          {/* Role Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-white border border-[#D9ECE7] shadow-2xs">
            {(['ALL', 'DOCTOR', 'NURSE', 'CARETAKER', 'PHYSIOTHERAPIST', 'PHLEBOTOMIST'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                  activeTab === tab
                    ? 'bg-[#065F46] text-white'
                    : 'text-slate-600 hover:text-[#102723] hover:bg-[#F2F8F5]'
                }`}
              >
                {tab === 'ALL'
                  ? 'All Roles'
                  : tab === 'DOCTOR'
                  ? 'Doctors'
                  : tab === 'NURSE'
                  ? 'Nurses'
                  : tab === 'CARETAKER'
                  ? 'Caretakers'
                  : tab === 'PHYSIOTHERAPIST'
                  ? 'Physio'
                  : 'Phlebotomists'}
              </button>
            ))}
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role) => {
            const RoleIcon = role.icon;
            return (
              <div
                key={role.id}
                className="group flex flex-col justify-between rounded-[24px] border border-[#D9ECE7] bg-white p-6 shadow-[0_4px_20px_rgba(6,95,70,0.03)] hover:shadow-[0_8px_30px_rgba(6,95,70,0.08)] hover:border-[#A7F3D0] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#065F46] border border-[#D1FAE5] group-hover:scale-105 transition-transform">
                      <RoleIcon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3 py-1 text-[11px] font-bold text-[#065F46]">
                      {role.rate}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-[#102723]">{role.title}</h3>
                  <p className="mt-1 text-xs text-[#065F46] font-semibold">{role.type}</p>
                  <p className="mt-2.5 text-xs text-slate-500 leading-relaxed">{role.description}</p>

                  <div className="mt-4 pt-3 border-t border-[#F2F8F5]">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Qualifications</p>
                    <p className="text-xs text-slate-700 font-medium leading-snug">{role.qualification}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F2F8F5]">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Key Competencies</p>
                    <div className="flex flex-wrap gap-1.5">
                      {role.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded-md bg-[#F7FBF9] border border-[#D9ECE7] px-2 py-0.5 text-[10px] font-medium text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F2F8F5]">
                  <Link
                    href={`/provider/register?role=${role.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F2F8F5] hover:bg-[#065F46] text-[#065F46] hover:text-white py-2.5 text-xs font-bold transition-colors"
                  >
                    <span>Apply for this Role</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Perks / Why Choose Vellora */}
      <section className="py-14 bg-white border-y border-[#D9ECE7]">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#065F46]">Why Practice With Us</span>
            <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-bold text-[#102723]">
              Empowering Clinicians to Practice Medicine Without Red Tape
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk, idx) => {
              const PerkIcon = perk.icon;
              return (
                <div
                  key={idx}
                  className="rounded-[22px] border border-[#D9ECE7] bg-[#F7FBF9] p-6 shadow-2xs hover:border-[#A7F3D0] transition-colors"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-[#D9ECE7] text-[#065F46] mb-4">
                    <PerkIcon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-[#102723]">{perk.title}</h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">{perk.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works (4 Steps) */}
      <section className="py-16 mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#065F46]">Simple Onboarding Journey</span>
          <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-bold text-[#102723]">
            From Application to Your First Home Visit in 4 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {steps.map((st, i) => (
            <div
              key={i}
              className="relative flex flex-col rounded-[22px] border border-[#D9ECE7] bg-white p-6 shadow-2xs"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#065F46] text-white text-xs font-black">
                  {st.num}
                </span>
                <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
              </div>
              <h3 className="font-heading text-base font-bold text-[#102723]">{st.title}</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-14 bg-[#F2F8F5] border-t border-[#D9ECE7]">
        <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#065F46]">Common Questions</span>
            <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-bold text-[#102723]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, fIdx) => (
              <div
                key={fIdx}
                className="rounded-[20px] border border-[#D9ECE7] bg-white p-5 shadow-2xs"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-[#065F46] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#102723]">{faq.q}</h4>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-14 mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-[28px] bg-[#064E3B] p-8 sm:p-12 text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 bg-white/10 px-3 py-1 rounded-full border border-white/20 mb-3 inline-block">
              Start Your Application Today
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ready to Transform Bedside Medicine in Your Community?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Complete your verification profile today and start receiving guaranteed visit dispatches within 48 hours.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/provider/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-xs sm:text-sm font-bold text-[#064E3B] shadow-sm hover:bg-[#F2F8F5] transition-colors"
            >
              <span>Apply as a Provider Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/provider/login"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-transparent px-6 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-white/10 transition-colors"
            >
              <span>Provider Login</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
