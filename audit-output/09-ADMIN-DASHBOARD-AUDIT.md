# 09 — Super Admin Command Desk Audit

This document audits the administrative capabilities, dispatch operations, credentialing oversight, catalog management, and platform governance tools implemented under `/admin/*`.

---

## 1. Executive Fleet Dashboard (`/admin/dashboard`)

- **High-Density Metric Widgets:**
  - Active Visits in Progress: `14` (with real-time pulse indicator).
  - Clinicians on Active Duty: `28 / 35` (Doctors, Nurses, Caretakers, Phlebotomists).
  - Gross Platform Booking Volume (Today): `$3,420.00`.
  - Average Dispatch Response Time: `4.2 minutes`.
  - Overall CSAT Rating: `4.92 / 5.0` (based on 1,420 verified patient reviews).
- **Incident Alert Feed:** Highlights pending emergency dispatch requests, delayed visits exceeding 15 minutes, and unverified clinician license renewals.

---

## 2. 5-Column Live Dispatch Kanban Desk (`/admin/dispatch`)

The dispatch console provides real-time oversight of the home healthcare fleet.

### Column Architecture:
1. **1. Requested (Unassigned):** Inbound patient bookings awaiting clinician acceptance.
2. **2. Confirmed & Assigned:** Matched with a provider; prep time active.
3. **3. En Route (In-Transit):** Clinician traveling to patient home (shows real-time travel ETA).
4. **4. Bedside Encounter (In Progress):** Clinician on-site with unlocked PIN verification.
5. **5. Completed:** Finished visits with pending or verified clinical documentation.

### Operational Controls:
- **Card Metadata:** Patient Name, Service Type Badge, Address, Assigned Clinician Avatar, and Elapsed Timer.
- **Manual Reassignment Modal:** Allows dispatch supervisors to override system routing and reassign a critical or delayed booking to an alternative on-duty clinician with one click.

---

## 3. Credentialing & CMO Verification Queue (`/admin/verifications`)

Healthcare compliance mandates rigorous vetting before clinicians can accept patient home visits.

- **Review Queue Interface:**
  - Displays submitted provider onboarding applications with medical council registration numbers, state licenses, and malpractice insurance certificates.
  - Document Preview: Allows the Chief Medical Officer (CMO) to inspect uploaded medical diplomas and identity credentials.
  - Action Triggers: **Approve & Activate Clinician** (enables online duty toggle) or **Reject with Compliance Note**.

---

## 4. Master Patient Index & Catalog Management (`/admin/patients` & `/admin/services`)

- **Master Patient Index (MPI) (`/admin/patients`):**
  - Searchable by name, phone number, or patient MRN (Medical Record Number).
  - Lists chronic condition tags (e.g. *Type 2 Diabetes, Hypertension, Post-Stroke Rehab*), lifetime visits, and emergency contacts.
- **Service Catalog & Pricing Editor (`/admin/services`):**
  - Allows platform administrators to adjust base consultation fees, 12h/24h nursing rates, lab test consumables markup, and emergency surcharge fees.
  - Active/Inactive toggle to enable or suspend specific services in defined metropolitan territories.

---

## 5. Financial Margins & Governance Settings (`/admin/finance` & `/admin/settings`)

- **Finance & Commission Ledger (`/admin/finance`):**
  - Tracks platform take rate (typically 18%–22%), clinician disbursement batches, automated payout schedules, and merchant processing fees.
- **Platform Governance & SLAs (`/admin/settings`):**
  - Dispatch timeout threshold: Configurable seconds before an unaccepted booking automatically escalates to phone triage.
  - Geo-zone configuration: Definition of operational postal codes and maximum travel radius limits.

---
*Report generated for technical reviewer evaluation.*
