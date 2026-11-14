# 13 — Client RFP Requirements & Traceability Matrix

This matrix maps every functional capability and clinical workflow specified in the client Request for Proposal (RFP) against the verified codebase implementation.

---

## 1. Core Clinical Services Traceability (4 Core Services)

| Service Domain | RFP Requirement Specification | Codebase Implementation | Verification Status |
| :--- | :--- | :--- | :---: |
| **1. Doctor Home Visit** | - Board-certified physician home consultation.<br>- Patient symptom triage.<br>- Bedside physical examination.<br>- Digital electronic prescription (e-Rx). | - Catalog: `/services/home-doctor-visit`<br>- Booking: `/patient/book` (Doctor Visit, $85)<br>- Bedside: `/provider/appointments/[id]` (ICD-10 notes & e-Rx generator)<br>- Records: `/patient/records` (Saved e-Rx view) | **100% Implemented & Verified** |
| **2. At-Home Nursing Care** | - Registered nurse home care.<br>- 12-hour day/night or 24-hour continuous shifts.<br>- Vital signs monitoring (BP, SpO2, pulse, glucose).<br>- IV cannula and wound dressing management. | - Catalog: `/services` (Nursing Care)<br>- Booking: `/patient/book` (12h/24h shift picker, $45/shift)<br>- Bedside: `/provider/appointments/[id]` (RN vitals charting & procedure checklist) | **100% Implemented & Verified** |
| **3. Trained Caretaker** | - Dedicated non-clinical mobility assistance.<br>- Elderly care, hygiene, and feeding support.<br>- Shift logs and daily living activity tracking. | - Catalog: `/services` (Caretaker)<br>- Booking: `/patient/book` (12h/24h continuous, $35/shift)<br>- Bedside: `/provider/appointments/[id]` (ADL checklist & mobility log) | **100% Implemented & Verified** |
| **4. Home Diagnostic Lab Tests** | - Certified phlebotomist home blood draw.<br>- Vacuum tube barcode tracking & cold-chain logging.<br>- Diagnostic test panel selection.<br>- Digital printable lab report with reference ranges. | - Catalog: `/services` (Home Diagnostics)<br>- Booking: `/patient/book` (CBC, Lipid, HbA1c panels, $65)<br>- Bedside: `/provider/appointments/[id]` (Tube barcode checklist)<br>- Report: `/patient/records/lab-1` (Printable lab report) | **100% Implemented & Verified** |

---

## 2. Platform Persona & Role Matrix

| Stakeholder Persona | RFP Specification Scope | Implemented Route Coverage | Status |
| :--- | :--- | :--- | :---: |
| **Public Visitor** | Explore services, doctors, hospital credentials, and initiate booking. | `/`, `/services`, `/services/[slug]`, `/doctors`, `/facilities`, `/about`, `/contact` | **Complete** |
| **Patient / Customer** | Auth, booking engine, live tracking, security PIN, EHR, family profiles. | `/patient/login`, `/register`, `/dashboard`, `/book`, `/bookings`, `/bookings/[id]`, `/records`, `/records/[id]`, `/family`, `/account`, `/support` | **Complete** |
| **Healthcare Provider** | Duty toggle, proximity requests, bedside transit, PIN unlock, e-Rx, shifts, payouts. | `/provider/login`, `/onboarding`, `/dashboard`, `/appointments`, `/appointments/[id]`, `/availability`, `/earnings`, `/profile` | **Complete** |
| **Super Admin** | Dispatch Kanban desk, KPI oversight, clinician verification, catalog rates, finance. | `/admin/dashboard`, `/dispatch`, `/bookings`, `/providers`, `/verifications`, `/patients`, `/services`, `/finance`, `/feedback`, `/settings` | **Complete** |

---

## 3. Discrepancy & Priority Adjudication
Per client instructions: *"If any design image contradicts the RFP, prioritize the RFP for functionality and the approved website for visual identity."*

1. **Service Card Presentation:** Early mockups depicted 3 horizontal cards; the RFP mandates 4 core services. The implementation resolved this with a 4-column responsive grid displaying all 4 services concurrently.
2. **Hero Composition:** The user requested the dark cinematic hero image with white text and right-aligned stats. The visual identity of the approved website was maintained while integrating full interactive links to the clinical booking engine.

---
*Report generated for technical reviewer evaluation.*
