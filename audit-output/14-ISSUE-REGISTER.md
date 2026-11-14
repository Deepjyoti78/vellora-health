# 14 — Issue Register & Technical Findings

This register catalogs all architectural limitations, technical debt, security recommendations, and production prerequisites identified during the audit. Findings are classified by priority:
- **P0 (Blocker for Production Launch)**
- **P1 (High Priority / Enterprise Compliance)**
- **P2 (Medium Priority / Workflow Enhancement)**
- **P3 (Low Priority / UI Polish)**

---

## 1. Prioritized Findings Table

| Issue ID | Priority | Category | Finding Summary | Impact | Recommended Remediation |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **ISS-001** | **P0** | **Database Persistence** | Data currently resides in in-memory repository (`src/lib/db.ts`). Server restart resets mock mutations. | Data loss across server reboots or horizontal scale. | Wire existing `prisma/schema.prisma` to a managed PostgreSQL instance (e.g. Supabase, Neon, AWS RDS). |
| **ISS-002** | **P0** | **Authentication Security** | Phone login accepts static test OTP (`4829`) without cryptographic signature or JWT issuance. | Unauthorized session creation in production. | Connect Twilio Verify or Firebase Phone Auth; issue signed HTTP-only cookies with JWT claims. |
| **ISS-003** | **P1** | **Payment Gateway Integration** | Checkout on `/patient/book` uses a mock card input and immediate client-side confirmation. | Cannot charge real patient credit cards or UPI. | Integrate Stripe Elements or Razorpay SDK with secure webhook callback listener on `/api/webhooks/stripe`. |
| **ISS-004** | **P1** | **Real-Time Dispatch Updates** | Provider queue and patient live tracking rely on client polling / manual refresh. | Latency in emergency bedside dispatching. | Implement WebSockets or Server-Sent Events (SSE) via Supabase Realtime or Pusher for sub-second fleet sync. |
| **ISS-005** | **P2** | **Document & Asset Storage** | Provider credential uploads (`/provider/onboarding`) store file metadata in state without binary upload. | Cannot view actual PDF medical licenses in production. | Configure AWS S3 or Cloudflare R2 bucket with presigned upload URLs for encrypted clinical PDF storage. |
| **ISS-006** | **P2** | **HIPAA / PHI Compliance** | Electronic medical records lack field-level audit logging required for HIPAA / GDPR health data. | Regulatory non-compliance in enterprise healthcare. | Implement an immutable `AuditLog` trigger for any read/write access to patient diagnostic records. |
| **ISS-007** | **P3** | **Interactive Map Visualization** | Live tracking view uses a stylized SVG graphic and progress step indicator rather than an active Mapbox/Google Maps canvas. | Stylized representation rather than interactive turn-by-turn map. | Embed Google Maps JavaScript API or Mapbox GL with vehicle marker animation. |
| **ISS-008** | **P3** | **Multi-Language Support (i18n)** | Public marketing and clinical portals are currently English-only (`en`). | Limits non-English speaking patient demographics. | Integrate `next-intl` to support localized languages (e.g. Spanish, Hindi, German). |

---

## 2. Evidence & Audit Footnotes
- **ISS-001 Evidence:** Verified in `src/lib/db.ts` lines 1–890. While comprehensive, array methods (`bookings.push(...)`) are in-memory.
- **ISS-002 Evidence:** Verified in `src/app/patient/login/page.tsx` line 24 (`const testOtp = "4829"`).
- **ISS-003 Evidence:** Verified in `src/app/patient/book/page.tsx` lines 320–340.

---
*Report generated for technical reviewer evaluation.*
