# 11 — Interaction, State & User Experience Audit

This document audits the user interactions, form validation behavior, modal overlays, notifications, and client-side error handling across the Vellora Health platform.

---

## 1. Interactive Form Validation & Feedback

### A. Patient Booking Engine (`/patient/book`)
- **Step Gating:** Users cannot progress from Step 1 to Step 2 without selecting a service card.
- **Dynamic Field Exposure:** When a user selects *Nursing Care* or *Caretaker*, the form dynamically reveals a required shift length selector (12h Day / 12h Night / 24h). Attempting to proceed without selecting a shift highlights the field in clinical amber.
- **Date & Slot Restrictions:** Past dates are disabled in the date picker. Time slots show real-time availability badges.
- **Promo Code Feedback:** Typing `VELLORA10` and clicking Apply instantly calculates discount deductions and updates the order summary in real time; entering an invalid string displays an inline error message (*"Invalid promotion code"*).

### B. Provider Bedside Verification (`/provider/appointments/[id]`)
- **PIN Unlock Guard:** The clinical encounter notes and e-Prescription builder remain locked behind a 4-digit PIN input.
- **Feedback State:** Entering incorrect digits displays a shake animation and error toast (*"Invalid verification PIN. Please request the code from the patient."*).
- **Success State:** Submitting `4829` reveals a green success checkmark, logs a timestamped verification event, and unlocks the clinical documentation fields.

---

## 2. Modals, Drawers & Overlays

| Component | Trigger | Behavior & Accessibility |
| :--- | :--- | :--- |
| **Quick Booking Modal (`BookingModal.tsx`)** | "Book Appointment" in Header & Doctor Cards | Traps focus, dims background backdrop with `backdrop-blur-sm`, ESC key dismisses. |
| **Manual Reassign Modal (`/admin/dispatch`)** | "Reassign" on dispatch card | Renders active clinician list with distance indicators; selecting a clinician updates card immediately. |
| **Mobile Navigation Drawer (`Header.tsx`)** | Mobile hamburger button | Slides smoothly from right, provides clear close (X) button and backdrop tap dismiss. |
| **Role Switcher Pill (`RoleSwitcher.tsx`)** | Fixed floating bottom-left widget | Allows instant switching between Patient, Provider (MD/RN), and Admin roles for review purposes. |

---

## 3. Micro-Interactions & State Polish

- **Button Hover Transitions:** All primary buttons employ CSS transitions (`transition-all duration-200 hover:shadow-md hover:scale-[1.01]`).
- **Live Tracking Pulse:** Active dispatch stages on `/patient/bookings/[id]` feature an animated radar pulse (`animate-ping`) illustrating real-time location streaming.
- **Doctor Filter Tabs:** On `/doctors` and `/services`, clicking specialty pills (`All Specialties`, `Internal Medicine & Geriatrics`, `Pediatrics & Family Medicine`) filters the card grid without full page reloads.

---
*Report generated for technical reviewer evaluation.*
