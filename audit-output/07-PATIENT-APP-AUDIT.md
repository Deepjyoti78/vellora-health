# 07 — Patient & Customer Application Audit

This document audits the user experience, clinical workflows, data persistence, and interactive capabilities of the Patient Portal (`/patient/*`).

---

## 1. Authentication & Onboarding (`/patient/login` & `/patient/register`)

- **Login Flow (`/patient/login`):**
  - Implements an OTP phone verification pattern standard for modern healthcare applications.
  - A test OTP simulator (`4829`) is displayed in an alert badge, allowing testers and reviewers to bypass live SMS latency.
  - Submitting the 4-digit code hydrates the `AuthContext` with the patient persona (`John Doe`, ID: `pat-1`) and redirects to `/patient/dashboard`.
- **Registration Flow (`/patient/register`):**
  - Captures full legal name, date of birth, biological sex, blood group, chronic conditions, and emergency contact details.
  - Validates required fields before writing the patient record into `src/lib/db.ts`.

---

## 2. 4-Stage Clinical Booking Engine (`/patient/book`)

The booking engine is the primary revenue-generating funnel of the patient application, representing all 4 core RFP healthcare services.

### Stage Breakdown:
1. **Step 1: Clinical Service Selection:**
   - Cards for **Home Doctor Visit** ($85), **At-Home Nursing Care** ($45/shift), **Trained Caretaker** ($35/shift), and **Home Diagnostic Lab Tests** ($65).
   - Dynamic UI adaptations: Selecting Nursing or Caretaker unlocks shift duration options (12-Hour Day Shift, 12-Hour Night Shift, or 24-Hour Continuous Care).
2. **Step 2: Patient & Dependent Selection:**
   - Allows booking for the logged-in patient or selecting family dependents (e.g. `Eleanor Doe - Mother, 74 yrs`).
   - Captures visit location (GPS auto-detection or saved address) and patient chief complaint / medical symptoms.
3. **Step 3: Appointment Schedule & Urgency:**
   - Date picker with morning, afternoon, and evening time slot selector.
   - Emergency dispatch toggle: Flagging as "Emergency Immediate Dispatch" applies a dynamic surcharge ($25) and triggers priority queuing in the Admin Dispatch Console.
4. **Step 4: Review, Promo Codes & Payment:**
   - Itemized bill breakdown (Consultation Fee + Consumables + Tax - Discount).
   - Promo code simulator (e.g. `VELLORA10` applies a 10% discount).
   - Payment method toggle: Credit/Debit Card (mock Stripe UI) or "Pay at Home After Service".
   - Submitting generates a unique booking ID (e.g. `bkg-new-1`) with an auto-generated 4-digit security PIN (`4829`).

---

## 3. Live Care Tracking & PIN Security (`/patient/bookings/[id]`)

A critical requirement of the clinical workflow is patient safety and field presence verification.

- **7-Stage Visual Stepper:**
  - `REQUESTED` ➔ `CONFIRMED` ➔ `DISPATCHED` ➔ `IN_TRANSIT` ➔ `ARRIVED` ➔ `IN_PROGRESS` ➔ `COMPLETED`.
  - Active stage is illuminated with real-time ETA estimates (e.g. *"Dr. Maya Patel is 8 mins away"*).
- **Physical Verification PIN:**
  - A prominent security card displays: *"Share this 4-digit PIN only with your clinician upon arrival: 4829"*.
  - The clinician cannot unlock the clinical encounter console without this PIN, preventing phantom billing and ensuring verified bedside presence.
- **Assigned Clinician Card:** Displays clinician photo, board certifications, phone contact button, and hospital affiliation.
- **Post-Care Rating & Review:** Upon transition to `COMPLETED`, the view dynamically exposes a 5-star rating widget with clinical feedback tags.

---

## 4. Medical Records & EMR (`/patient/records` & `records/[id]`)

- **EHR Summary Dashboard:** Filterable timeline of past doctor prescriptions, nurse vital sheets, and diagnostic lab reports.
- **Comprehensive Diagnostic Report (`/patient/records/lab-1`):**
  - Professional digital laboratory report (Complete Blood Count - CBC with Differential).
  - Displays Parameter, Result, Reference Range, Unit, and Status (`NORMAL` vs `HIGH`/`CRITICAL`).
  - Includes a "Print / Save PDF" browser trigger and QR code verification stamp.

---

## 5. Dependents, Account & Helpdesk (`/patient/family`, `/account`, `/support`)

- **Family Directory (`/family`):** Add/edit dependent profiles with specific medical history, allergies, and mobility requirements.
- **Account & Security (`/account`):** Manage saved addresses, emergency contacts, and two-factor authentication preferences.
- **Support & Grievance Desk (`/support`):** Direct clinical escalation tickets with priority tagging (`Low`, `Medium`, `Urgent Clinical Query`) and direct access to the 24/7 Chief Nurse Hotline.

---
*Report generated for technical reviewer evaluation.*
