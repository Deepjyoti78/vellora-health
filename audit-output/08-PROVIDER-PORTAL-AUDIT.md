# 08 — Healthcare Provider Portal Audit

This document audits the clinical features, dispatch interaction, bedside encounter documentation, and scheduling capabilities of the Provider Workstation (`/provider/*`).

---

## 1. Multi-Persona Authentication (`/provider/login`)

The provider portal accommodates diverse medical roles with tailored field responsibilities:
- **Doctor (MD - General Medicine & Geriatrics):** Authorized for clinical diagnosis, e-Prescriptions, and specialist referrals.
- **Nurse (RN - Critical Care & Infusion):** Authorized for vital sign logging, IV cannula administration, and wound dressing notes.
- **Caretaker (Elderly & Post-Op Mobility Aide):** Authorized for ADL assistance, hygiene tracking, and meal/mobility logs.
- **Phlebotomist (Diagnostic Sample Collection):** Authorized for vacuum tube barcode scanning, fasting verification, and cold-chain sample logging.

*Reviewer Note:* The login page includes 1-click persona switchers that automatically log in as the target clinical provider, allowing instant verification without manual password entry.

---

## 2. Real-Time Duty Dashboard & Proximity Queue (`/provider/dashboard`)

- **Duty Toggle (`Online / On Duty` vs `Offline`):**
  - Instantaneous switch updating clinician availability in the central dispatch repository.
  - When offline, incoming dispatch requests are suppressed.
- **KPI Overview:** Today's completed visits, current shift earnings ($240), average patient CSAT (4.9/5), and scheduled on-call hours.
- **Live Dispatch Queue:**
  - Displays pending home-visit requests within the provider's operating radius.
  - Shows Patient Name, Chief Complaint, Service Type, Distance (e.g. `2.4 km`), and Estimated Payout ($68).
  - Action buttons: **Accept Visit** (triggers patient SMS and transitions booking to `CONFIRMED`) or **Decline**.

---

## 3. Bedside Encounter Console (`/provider/appointments/[id]`)

The encounter console represents the core clinical workflow in the field.

### A. Transit Workflow Controls
- Provider progresses status via action buttons:
  - `Mark In-Transit` (notifies patient that clinician is traveling).
  - `I Have Arrived` (notifies patient that clinician is at the door).

### B. Two-Factor Bedside PIN Unlock
- Before clinical documentation can be edited, the clinician must input the patient's 4-digit security PIN (`4829`).
- Incorrect PIN prevents submission. Correct PIN unlocks the encounter record and stamps GPS verification.

### C. Role-Specific Clinical Documentation
The UI dynamically adapts based on the active provider persona:
1. **Physician (MD):**
   - Chief Complaint & Clinical Examination notes.
   - ICD-10 Diagnosis code search.
   - **Electronic Prescription (e-Rx) Builder:** Add medication name, dosage (e.g. `500mg`), frequency (`TID`), duration (`5 days`), and dispensing instructions.
2. **Nurse (RN):**
   - **Vitals Charting:** Blood Pressure (Systolic/Diastolic), Heart Rate (BPM), SpO2 (%), Temperature (°F), and Blood Glucose (mg/dL).
   - Nursing procedure checklist (IV infusion rate, wound dressing condition, catheter check).
3. **Phlebotomist:**
   - Sample collection checklist (EDTA Lavender tube, Serum Gel Yellow tube, Fluoride Grey tube).
   - Barcode scanning & specimen integrity verification.
4. **Caretaker:**
   - Shift log (Hygiene assistance, bed-to-chair transfer, hydration monitoring, cognitive alertness check).

---

## 4. Scheduling & Financial Settlements (`/provider/availability` & `/provider/earnings`)

- **Shift Planner (`/provider/availability`):**
  - Weekly interactive schedule grid (Monday through Sunday, Morning/Afternoon/Night shifts).
  - Operating radius slider (5 km to 30 km) to prevent dispatching calls outside reasonable travel times.
- **Earnings & Payout Ledger (`/provider/earnings`):**
  - Transparent revenue breakdown (Gross Earnings, Platform Fee, Net Payout).
  - Completed trip transaction history with date, patient name, and disbursement status (`Paid` vs `Pending Direct Deposit`).

---
*Report generated for technical reviewer evaluation.*
