# Frontend stabilization report

18 November 2026. Local frontend and demonstration behavior fixes.

## Completed

- R01–R02, frontend portion. Admin and clinician demo access states, patient record ownership filtering, and clinician encounter filtering. These checks depend on client state. Server authorization remains a backend requirement.
- R04–R05, frontend portion. Notes use the selected encounter's patient, clinician forms begin without prefilled medication/diagnosis/vital values, observations and care tasks require input, arbitrary four-character PIN acceptance is removed, and demo assignment/status rules reject ineligible providers and terminal-state reversal. Administrative reassignment retains an explicit path.
- R06 and R11, demo behavior. Payment/payout status, password changes, exports, sharing failures, contact/support messages, settings, and notifications now avoid claiming completed real operations. Demo requests remain payment-pending.
- R07–R09. Expo preserves selected package/service and price, beneficiary relationship, generated reference, and current calendar dates. Cancellation/rescheduling update the session store and notify mounted lists. Web booking dates use the local calendar and reject invalid/past dates. Exact doctor lookup replaces silent fallback.
- R10 and R14, demo portion. Provider documents begin unuploaded and missing evidence is excluded from submitted demo metadata. Account setup retains the entered name and validated dependent information in session state. The mobile acknowledgement describes demonstration/session behavior.
- R15. Reduced-motion content stays visible, reveal fallback covers every reveal variant, and touched mobile controls expose button semantics with labels for key icon controls.
- R16, partial. Added focused date, checkout, store notification, cancellation/rescheduling, clinician eligibility, ID, and terminal-transition regression coverage.

## Files modified by stabilization work

- Web booking pages under src/app/book, legacy patient checkout, src/lib/booking-date.ts, src/lib/db.ts, globals.css, ScrollAnimationProvider, and RequestSuccessState.
- Patient account, support, booking-detail, and record-detail pages.
- Provider clinical records, appointment cockpit, requests, earnings, and onboarding pages.
- Admin dispatch, finance, settings, AdminLayout, ProviderLayout, and contact page.
- Expo booking and service-detail screens, Home/Bookings/Records/Account tabs, create-account and patient-setup screens, AuthContext, mockData, and domain types.
- tests/booking-date.test.cjs and tests/booking-state.test.cjs.

Pre-existing and concurrent edits were preserved. The complete working-tree diff also contains the owner's changes.

## Verification

- Seven targeted Node regression tests passed. Actual date handlers and mobile checkout handler are extracted from source and executed alongside isolated web/mobile stores.
- Date boundary tests passed in Asia/Kolkata and America/Los_Angeles.
- Web and Expo TypeScript checks passed during the completed batches.
- Final Next.js production build and final Expo web export both passed.
- Browser checks verified past-date rejection, a non-doctor ID opening the not-found screen, guest admin access showing the demo access state, and a CBC selection retaining its ₹349 estimate through the details, current-month calendar, review, and demo-payment screen. No console errors were observed in the checked Expo journey.
- The browser tool became unavailable during verification. Later copy/label and clinician-filter refinements received source/type/build checks. Full end-to-end submission/cancellation UI coverage, before/after visual comparison, responsive matrix, reduced-motion browser emulation, and native-device verification remain unverified.
- git diff --check passed with line-ending notices.
- Web standalone lint stops at missing ESLint configuration. Expo has no configured lint script/configuration. No lint dependencies were installed. TypeScript, executable regressions, and build/export checks provide the available automated validation.

## UI and scope

Existing layout structure, fonts, colors, card styling, dimensions, and image assets were preserved by these fixes. Necessary visible changes are truthful demo wording, date/error behavior, empty clinical inputs, ownership/access states, and reduced-motion visibility. Pixel-identical rendering across all devices has not been established.

Operational records remain session/demo data. Production authentication, shared persistence, payment/refund settlement, SMS, document storage, signed clinical workflows, durable audit events, and production-grade authorization require backend implementation. Dependency-advisory remediation, real policy content, brand/contact/region decisions, production headers, measured image performance, and native-device checks remain outside this frontend pass. The previous readiness audit remains open for those items.

No packages were installed. No commits, pushes, remote modifications, deployments, or publishing were performed.
