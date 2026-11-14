# 17 — Audit Methodology & Evaluation Limitations

This document details the inspection procedures, tooling, environment constraints, and analytical boundaries under which this project audit was conducted.

---

## 1. Audit Methodology & Procedures

The audit was executed in strict adherence to the client's non-destructive guidelines:
1. **Source Code Immutability:** No source code in `src/`, `prisma/`, or `public/` was modified, refactored, or renamed during this audit.
2. **Automated Static Code Analysis:**
   - Recursive file scanning and line-of-code metrics generated via PowerShell automation.
   - Validation of `package.json`, `tsconfig.json`, `tailwind.config.ts`, and `next.config.mjs`.
3. **Headless Browser Visual Inspection:**
   - Playwright automation engine utilized to crawl every route on `http://localhost:3010`.
   - Captured 52 high-resolution screenshots across Desktop (1440px), Tablet (768px), and Mobile (390px).
   - Monitored browser developer console logs for uncaught runtime exceptions, 404 assets, and React hydration errors.
4. **Traceability Mapping:**
   - Cross-referencing implementation against the client Request for Proposal (RFP) and user-supplied reference images.

---

## 2. Testing Environment & Toolchain

- **Operating System:** Microsoft Windows 11 Enterprise
- **Node.js Runtime:** `v20.x` / `v22.x`
- **Application Framework:** Next.js `15.5.29` with React `19.0.0`
- **Browser Automation:** Playwright Chromium headless engine (1440×900, 768×1024, 390×844 viewports)
- **Local Dev Server:** Next.js development server running on port `3010` (PID isolated to prevent port collisions)

---

## 3. Audit Boundaries & Limitations

1. **In-Memory Runtime Scope:** The platform's persistent state was evaluated using the in-memory transactional repository (`src/lib/db.ts`). Long-term stress testing across database connection pools (PgBouncer) could not be executed as no live external PostgreSQL instance was provisioned.
2. **Third-Party API Simulation:** Because live API keys (Stripe, Twilio, SendGrid) are omitted to protect client security, payment gateway webhooks and live SMS handshakes were verified through simulated mock adapters.
3. **Simulated Mobile Emulation:** Mobile viewports were evaluated via Chromium viewport emulation rather than native iOS Safari or Android Chrome hardware devices.

---
*Signed by the Independent Audit Lead.*
