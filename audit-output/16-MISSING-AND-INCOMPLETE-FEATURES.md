# 16 — Missing, Simulated & Incomplete Features Analysis

This document provides a candid evaluation of features that are currently simulated, mocked, or awaiting backend infrastructure before they can be considered production-ready.

---

## 1. Feature Status Breakdown

| Feature Domain | Current State | Simulation Mechanism | What is Missing for 100% Production |
| :--- | :--- | :--- | :--- |
| **SMS OTP Verification** | Simulated | Static PIN `4829` verified client-side in `src/app/patient/login/page.tsx`. | Live SMS gateway (Twilio, MessageBird, or Firebase Auth) and rate-limiting middleware. |
| **Credit Card Billing** | Mock Gateway | Form accepts mock card numbers, checks expiration format, and simulates 1.5s charge latency. | Stripe / Razorpay backend webhook listener, PCI-compliant tokenization, and refund handling. |
| **Medical License Verification** | Mock CMO Queue | Admins can click "Approve" or "Reject" on `/admin/verifications`, updating in-memory status. | Integration with State Medical Board API or manual third-party credentialing service (e.g. Checkr / Certemy). |
| **Lab Equipment Interfacing (LIS)** | Mock EHR Generator | Standard CBC and Lipid panel values hardcoded in `src/lib/db.ts`. | HL7 / FHIR API integration with external diagnostic labs (e.g. Quest Diagnostics, LabCorp). |
| **Real-Time GPS Vehicle Tracking** | Step Progress Simulation | 7-stage visual stepper with simulated ETA calculations. | Live clinician geolocation background streaming from mobile GPS daemon. |
| **Encrypted Document Storage** | Client-Side Object URLs | Upload inputs generate temporary local preview URLs (`URL.createObjectURL`). | HIPAA-compliant AWS S3 bucket with server-side encryption (SSE-KMS) and presigned access tokens. |
| **Automated Clinician Payouts** | Ledger Simulation | Payout balances tracked in `/provider/earnings` with mock "Transfer Initiated" status. | Stripe Connect Custom Accounts or ACH direct deposit automation. |

---

## 2. Distinction Between Architecture vs Implementation
It is critical to note that the **frontend architecture, data contracts, TypeScript interfaces, and UI interaction states for all of the above features are 100% built and functional**.
The remaining work is exclusively focused on plumbing the existing client hooks to real third-party cloud APIs and database tables.

---
*Report generated for technical reviewer evaluation.*
