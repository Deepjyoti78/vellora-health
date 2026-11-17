# Vellora Health production readiness review

Reviewed on 17 November 2026 in Asia/Kolkata against commit `d181388` and the working files available during the review.

The review assumes the intended release will support real patients, clinicians, appointments, clinical records, and payments. A real-patient launch should be held until the P0 findings are resolved. The current implementation exposes demonstration identity controls and maintains its operational data in browser memory.

The review identified **20 grouped findings**, comprising **6 P0 launch blockers, 10 P1 major issues, and 4 P2 improvements**. Severity reflects the impact of operating these flows with real data. Existing seeded records are demonstration fixtures. This review establishes application behavior and does not establish that real patient records have been exposed.

## Scope and verification

The review covered the Next.js public site, patient portal, clinician portal, admin portal, Prisma schema and tooling, Expo patient application, package locks, configuration, assets, and existing project documentation. It included repository-wide source searches and detailed tracing of authentication, booking, dispatch, clinical documentation, financial actions, onboarding, account changes, and record downloads.

| Check | Observed result |
| --- | --- |
| Web TypeScript | Passed `tsc --noEmit --incremental false` |
| Expo TypeScript | Passed `tsc --noEmit --incremental false` |
| Next.js production build | Passed compilation, type checking, page generation, and build tracing |
| Web route smoke test | All 51 page-file routes returned HTTP 200, following redirects and substituting representative IDs for dynamic routes |
| Expo web export | Passed and produced the web bundles |
| Guest browser access | Admin patient registry and clinician appointment cockpit opened while the role indicator showed Guest |
| Patient ownership | The Eleanor fixture account opened `bkg-104`, which belongs to `pat-2` |
| Expo booking journey | Services → Home Lab Investigation → Book Home Sample Draw opened a physician checkout priced at ₹1,200 |
| Isolated data-layer checks | Reproduced duplicate IDs at the same millisecond, unapproved and wrong-category assignment, a cancelled-to-completed transition, and independent stores losing each other's mutations |
| Local asset scan | Found no missing files among 134 literal `/assets/` references in 100 web TypeScript/TSX files |
| Dependency advisory scan | Web reported 1 high and 1 moderate affected package entry. Expo reported 3 moderate entries |
| ESLint | Web has no installed top-level ESLint and no project lint configuration. Expo has no lint script or lint configuration. Standalone lint remains unavailable |
| Prisma CLI | The installed prerelease CLI rejected `prisma validate` with `CLI.UNKNOWN_COMMAND`. Schema validity and database migrations remain unverified |

HTTP success verifies route availability. The browser and source checks establish the defects described below. Native iOS/Android execution, device screen readers, production hosting headers, payment-provider calls, real SMS delivery, database recovery, load testing, and external clinical operations remain unverified. Security advisory applicability depends on the vulnerable dependency's input path.

Concurrent changes appeared in Doctors and Services, two new mobile image assets, and the Expo `expo-linear-gradient` dependency during the review. The catalog diffs were inspected and the production build was repeated. Mobile type checking passed again after the dependency addition, and a repeated mobile audit retained the same three moderate package entries. Expo export and browser observations preceded that later dependency addition. Browser observations refer to the local production build and the exported Expo web app. No live deployment was modified.

## P0 launch blockers

### R01. Browser controls can establish privileged identities

The root layout renders the role switcher without an environment gate. It exposes Super Admin and clinician identities to a guest. `login()` matches an email or phone, then falls back to the first user with a requested role. `switchRole()` also chooses the first user in a role and stores its ID in `sessionStorage`. Password and OTP screens use simulation behavior. The Expo context starts authenticated as `CURRENT_PATIENT` and verifies a fixed OTP.

An unauthenticated browser opened `/admin/patients` and `/provider/appointments/bkg-101`, displaying seeded patient information and the prescription editor. Those screens have no effective role gate. The prescription editor offered its release action to the guest.

Before release, establish identity through a server-verified authentication service, use protected sessions, and enforce role authorization at every server operation. Keep demonstration impersonation inside an explicitly isolated demo environment. Verify guest, patient, clinician, suspended-provider, and admin access through the normal navigation paths and direct URLs.

Evidence appears in [web authentication](<C:/Users/deepjyoti/Desktop/vellora-health/src/context/AuthContext.tsx:96>), [role switching](<C:/Users/deepjyoti/Desktop/vellora-health/src/components/common/RoleSwitcher.tsx:16>), [root layout](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/layout.tsx:76>), [admin layout](<C:/Users/deepjyoti/Desktop/vellora-health/src/components/layout/AdminLayout.tsx:9>), and [Expo authentication](<C:/Users/deepjyoti/Desktop/vellora-health/vellora-health-mobile/src/context/AuthContext.tsx:18>).

### R02. Record IDs grant access without an ownership check

Patient booking and lab-report detail pages retrieve data by the route ID. `PatientLayout` checks authentication but does not verify that the current patient owns the requested record. The clinician cockpit also retrieves a booking by ID without checking its assigned clinician. Clinical charting loads all clinical notes.

In the browser, the Eleanor fixture account, `pat-1`, successfully opened `/patient/bookings/bkg-104`, owned by `pat-2`. This creates a direct path to another patient's appointment information once real data is connected.

Authorize each read and mutation on the server using the verified caller and the record's ownership or care relationship. Scope queries before returning data, and cover guessed IDs and cross-patient access with regression tests.

Evidence appears in [patient booking detail](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/patient/bookings/[id]/page.tsx:136>), [lab-report detail](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/patient/records/[id]/page.tsx:16>), and [clinician cockpit](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/provider/appointments/[id]/page.tsx:19>).

### R03. Operational data has no durable shared storage

The web store is a singleton of seeded mutable arrays imported by client components. Its comment mentions LocalStorage synchronization, but its implementation does not persist mutations. Expo similarly mutates a module-level fixture array. The Prisma schema is unused by these flows, and the source contains no API route or server-action layer for them.

Reloading creates a fresh store. A newly registered user can lose both their profile and the ability to restore a session. Bookings, dispatch, clinical notes, and account changes cannot synchronize across patient, clinician, and admin devices. Isolated evaluations of the store reproduced this separation.

Store operational records behind an authenticated server API and a durable database. Use database constraints, transactions, stable IDs, operation idempotency, and tested backup restoration. Ensure client bundles contain only the caller's authorized data. Demonstration patient arrays are currently shipped with client code.

Evidence appears in [web store](<C:/Users/deepjyoti/Desktop/vellora-health/src/lib/db.ts:2063>), [booking creation](<C:/Users/deepjyoti/Desktop/vellora-health/src/lib/db.ts:2136>), and [Expo fixture store](<C:/Users/deepjyoti/Desktop/vellora-health/vellora-health-mobile/src/data/mockData.ts:240>).

### R04. Clinical documentation can be attributed to the wrong patient

The clinical-record form always saves `patientId` as `patient-1`, regardless of the selected booking. Seeded booking owners use IDs such as `pat-1` and `pat-2`. The form also starts with a diagnosis, antibiotic medications, normal vitals, and completed care tasks. A user can change its role tab and save under that role. The cockpit similarly starts with prefilled clinical content.

This can create wrongly linked records and record observations or treatment that the clinician never entered for that encounter.

Derive patient and clinician identity from an authorized encounter on the server. Start clinical fields empty for a new encounter, validate entered measurements, constrain documentation by credentialed role, and require explicit review before releasing a signed prescription or completed note. Preserve correction history and authorship.

Evidence appears in [clinical-record save](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/provider/clinical-records/page.tsx:120>) and [cockpit clinical defaults](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/provider/appointments/[id]/page.tsx:27>).

### R05. Clinician verification and visit transitions do not enforce safety rules

The arrival check accepts `pinInput === '4829' || pinInput.length === 4`, so any four-character value passes. The store's `assignProvider()` checks only that a booking and user exist. It accepts a pending provider and a clinician whose role does not match the service. `updateBookingStatus()` accepts arbitrary supported statuses, including changing a cancelled visit directly to completed. These assignment and transition defects were reproduced in an isolated process.

Use an encounter-specific, expiring PIN with server verification and attempt limits. Check approved credentials, service eligibility, availability, assignment ownership, and permitted status transitions on every mutation. Enforce exclusive assignment atomically.

Evidence appears in [arrival PIN check](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/provider/appointments/[id]/page.tsx:97>), [assignment](<C:/Users/deepjyoti/Desktop/vellora-health/src/lib/db.ts:2159>), and [status updates](<C:/Users/deepjyoti/Desktop/vellora-health/src/lib/db.ts:2150>).

### R06. Financial success is recorded without financial settlement

Web patient checkout marks card bookings as `PAID` after a timer. Admin payout approval changes the local status to `PAID`. The provider cash-out action shows a success state without a transfer. Expo Pay creates a confirmed fixture booking without a provider transaction. No corresponding gateway integration or webhook is present in these flows.

This would give patients and clinicians receipts, paid statuses, and transfer assurances without proof that money moved.

Use server-created payment orders with server-calculated amounts. Update financial status from verified provider events and reconcile payments, refunds, and payouts with transaction IDs. Make callbacks and retries idempotent. Present simulated financial actions clearly throughout a demo.

Evidence appears in [patient checkout](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/patient/book/page.tsx:95>), [payout approval](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/admin/finance/page.tsx:21>), [provider cash-out](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/provider/earnings/page.tsx:26>), and [Expo payment](<C:/Users/deepjyoti/Desktop/vellora-health/vellora-health-mobile/src/app/booking/[serviceId].tsx:310>).

## P1 major issues

### R07. Expo loses the selected service, patient relationship, clinician, and reference

The lab booking journey opened a doctor consultation checkout at ₹1,200. The payment handler hard-codes `doctor-visit`, a doctor-consultation title, `Self`, age 34, a fixed clinician, and the price. Confirmation displays a fixed reference while creation generates a separate random reference. Selecting a different service or family recipient therefore produces inconsistent booking details.

Carry validated service, package, beneficiary, clinician selection, and price through the flow. Render the returned saved booking consistently on review, confirmation, details, and the booking list. Cover each service category and family booking through its visible entry point.

Evidence appears in [Expo service selection](<C:/Users/deepjyoti/Desktop/vellora-health/vellora-health-mobile/src/app/services/[id].tsx:407>) and [checkout](<C:/Users/deepjyoti/Desktop/vellora-health/vellora-health-mobile/src/app/booking/[serviceId].tsx:310>).

### R08. Expo rescheduling and cancellation leave the saved booking untouched

Rescheduling updates screen-local strings. Cancellation displays a success alert and navigates away. Neither handler updates the booking store. The Bookings tab computes its upcoming list with an empty-dependency `useMemo`, so it can retain stale data after visiting checkout. It also labels several incoming statuses as Confirmed and Paid Online.

Persist each operation against the actual booking ID, return its updated state, and refresh subscribed or focused screens. Render the recorded booking and payment statuses faithfully. A cancelled visit must disappear from upcoming care and appear in cancellation history.

Evidence appears in [booking actions](<C:/Users/deepjyoti/Desktop/vellora-health/vellora-health-mobile/src/app/booking/[serviceId].tsx:353>) and [booking list](<C:/Users/deepjyoti/Desktop/vellora-health/vellora-health-mobile/src/app/(tabs)/bookings.tsx:165>).

### R09. Scheduling contains stale dates and permits invalid timing

Expo starts its calendar in May 2025 and uses fixed 2025 rescheduling and reference strings. The home screen presents an upcoming appointment from May 2025. Web patient checkout has a fixed November 2026 default. Booking handlers lack authoritative past-date, slot availability, and clinician conflict checks. Several web date strings use UTC conversion while the product spans different regions.

Generate dates in an explicit service timezone, use available slots from the server, reject past or conflicting slots at submission, and render saved timestamps consistently. Keep historical fixtures visibly historical.

Evidence appears in [Expo calendar](<C:/Users/deepjyoti/Desktop/vellora-health/vellora-health-mobile/src/app/booking/[serviceId].tsx:134>) and [web patient scheduling](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/patient/book/page.tsx:33>).

### R10. Credential evidence and administrative audit logs are simulated

Provider onboarding begins with government ID, council license, degree, and background-check documents already marked uploaded. The inspected flow does not store and retrieve their actual binary evidence. Administrative audit logs are a hard-coded array. A reviewer cannot establish which documents were received or who performed a later action.

Start evidence requirements empty. Store actual documents in protected storage, validate type and size, associate them with an application, authorize reviewer access, and record review outcomes and sensitive mutations in durable audit events.

Evidence appears in [credential defaults](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/provider/onboarding/page.tsx:72>) and [administrative logs](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/admin/settings/page.tsx:24>).

### R11. Account, support, and document actions report work that never happened

The web password-change handler clears inputs and displays success without changing a credential. Contact submission only sets a success flag. Settings handlers report saved state without persisting it. Expo report downloads display a saved-PDF message without writing a file, and sharing failure reports that a link was copied without performing that copy. Several account items claim linked payment methods and enabled notifications through alerts.

Connect each success state to a verified operation, expose failures, and retain a retry path. A support request needs a durable ticket and a delivery outcome. A document download needs an actual file and an accessible completion state. Integrate account credentials with the real identity service.

Evidence appears in [password change](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/patient/account/page.tsx:133>), [contact submission](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/contact/page.tsx:21>), and [Expo documents](<C:/Users/deepjyoti/Desktop/vellora-health/vellora-health-mobile/src/app/(tabs)/records.tsx:100>).

### R12. Installed dependency trees contain published advisories

The web audit reported a high-severity affected PostCSS entry nested under Next.js, plus a moderate parent Next.js entry. The installed nested PostCSS is 8.4.31, while the separate top-level PostCSS is 8.5.33. Updating only the top-level package would leave the nested copy. Expo's three moderate entries trace to minimatch through `@expo/fingerprint` and Expo. These package counts include dependency-chain propagation and do not represent five independent exploits.

Review the vulnerable input paths and resolve a compatible patched dependency tree. Then repeat the audit, build, and affected flows. npm suggested a major Next.js upgrade and an Expo downgrade, so those automatic suggestions need compatibility review before application. No exploit against these dependencies was attempted. The maintainers describe attacker-controlled CSS source-map processing and minimatch pattern amplification in their advisories. [PostCSS advisory](https://github.com/postcss/postcss/security/advisories/GHSA-6g55-p6wh-862q), [minimatch advisory](https://github.com/isaacs/minimatch/security/advisories/GHSA-g3hv-75wg-m249)

Evidence also appears in [web lockfile](<C:/Users/deepjyoti/Desktop/vellora-health/package-lock.json>) and [Expo lockfile](<C:/Users/deepjyoti/Desktop/vellora-health/vellora-health-mobile/package-lock.json>).

### R13. Booking validation can misidentify the clinician and overstate coverage

The doctor route falls back to the first doctor for an unknown slug and also accepts an arbitrary user returned by `getUserById()`. Coverage is presented as available based on input length. The shared guest ID `pat-guest` gives separate guest requests the same owner identity, without a scoped recovery token. Client-calculated prices and HTML date minimums provide no authoritative validation.

Reject unknown or ineligible clinician IDs, validate service coverage and slot availability through the server, calculate prices from the active catalog, and associate guest requests with a scoped verified contact or secure recovery mechanism.

Evidence appears in [doctor lookup](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/book/doctor/[slug]/page.tsx:36>), [service validation](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/book/service/[slug]/page.tsx:90>), and [guest booking ownership](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/book/service/[slug]/page.tsx:132>).

### R14. Policy acceptance and onboarding do not create a usable account record

Expo requires accepting Terms of Service and Privacy Policy, but those text elements have no document navigation. The entered name is passed to setup, whose completion verifies the demonstration OTP and returns to the tabs. It does not persist a new patient profile or the chosen dependent information.

Publish accessible policy documents for the intended service and provide working links. Save the verified account and dependent details, then restore them after relaunch. Record the policy version and acceptance event where the chosen release requirements call for it. Jurisdiction-specific legal review remains an owner decision.

Evidence appears in [account creation](<C:/Users/deepjyoti/Desktop/vellora-health/vellora-health-mobile/src/app/(auth)/create-account.tsx:67>) and [setup completion](<C:/Users/deepjyoti/Desktop/vellora-health/vellora-health-mobile/src/app/(auth)/patient-setup.tsx:102>).

### R15. Reduced-motion CSS can leave content invisible, and mobile controls need semantics

Web animation classes such as `animate-fade-in-up` start at `opacity: 0`. The reduced-motion media query disables animations without restoring that opacity. Animated content can remain invisible when reduced motion is enabled. The observer's no-IntersectionObserver fallback also omits several reveal variants. Expo home has icon controls without descriptive accessibility labels or roles, and the browser accessibility tree exposed many actions as generic elements.

Make the reduced-motion state explicitly visible, retain useful focus feedback, and reveal every supported variant in the fallback. Add descriptive labels, roles, states, and focus order to mobile actions, then verify VoiceOver/TalkBack, large text, keyboard handling, and adequate touch targets on devices. Full WCAG conformance and native assistive-technology behavior were not measured in this review.

Evidence appears in [animation defaults](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/globals.css:2733>), [reduced-motion rules](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/globals.css:2835>), [reveal fallback](<C:/Users/deepjyoti/Desktop/vellora-health/src/components/common/ScrollAnimationProvider.tsx:7>), and [Expo home actions](<C:/Users/deepjyoti/Desktop/vellora-health/vellora-health-mobile/src/app/(tabs)/index.tsx:250>).

### R16. Release checks do not exercise the high-risk journeys

The repository has no configured behavioral test suite or CI workflow for these application flows. Standalone lint has no usable configuration. Passing TypeScript and a production build did not catch the reproduced unauthorized access, wrong-service checkout, or nonpersistent cancellation.

Add focused regression coverage for denied access, record ownership, all service bookings, cancellation/rescheduling, encounter attribution, assignment races, and payment callbacks. Run type checking, lint, the production build, and those tests in the release pipeline. Include a native-device check before a mobile release.

Evidence appears in [web scripts](<C:/Users/deepjyoti/Desktop/vellora-health/package.json:6>) and [Expo scripts](<C:/Users/deepjyoti/Desktop/vellora-health/vellora-health-mobile/package.json:25>).

## P2 professional quality and maintenance

### R17. Browser response protections need deployment verification

The local production response lacked Content-Security-Policy, frame restrictions, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy headers. Hosting may add headers, which this local check cannot establish. Third-party avatars, external fonts, map links, and the development-only Figma capture script also need an explicit resource policy.

Set and test a resource policy appropriate to the actual integration set, restrict framing, prevent MIME sniffing, and minimize unnecessary permissions and referrer exposure. Verify the final hosted response. These controls supplement the authorization fixes above.

Evidence appears in [Next configuration](<C:/Users/deepjyoti/Desktop/vellora-health/next.config.mjs:1>) and [development capture hook](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/layout.tsx:64>).

### R18. Branding, claims, regional data, SEO, and documentation drift

The interface mixes Vellora, Velora, and Valora. Web fixtures use US phone numbers, dollars, and locations, while Expo checkout uses rupees and Bangalore details. Public copy advertises a 135K+ trust count, verified visits, PIN identity protection, GPS tracking, and rapid escalation. Several pages do include prototype and illustrative-profile disclosures, which help, but the evidence behind live operational claims is outside the repository.

The README and earlier audit contain production-readiness claims and outdated implementation descriptions. The earlier report calls the schema PostgreSQL and styling Tailwind v4, while the current schema specifies SQLite and the project uses Tailwind 3. The sitemap contains only the homepage on a hard-coded domain. Robots allows all routes, including portal routes. Robots rules do not provide access control.

Choose the authoritative brand, service region, locale, contact details, and canonical host. Replace stale fixtures and substantiate public claims before release. Update documentation from verified behavior, add canonical public routes to the sitemap, and apply suitable indexing policy to private and demo surfaces.

Evidence appears in [brand artwork usage](<C:/Users/deepjyoti/Desktop/vellora-health/src/components/layout/Footer.tsx:1>), [public claims](<C:/Users/deepjyoti/Desktop/vellora-health/src/data/site-content.ts:24>), [sitemap](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/sitemap.ts:1>), [robots](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/robots.ts:1>), and [previous audit](<C:/Users/deepjyoti/Desktop/vellora-health/VELLORA-COMPLETE-AUDIT.md:30>).

### R19. Large images and scattered styling increase mobile cost

The desktop and narrow-screen hero PNGs are approximately 1.84 MB each before transfer compression. Expo exports include several roughly 2 MB doorstep images. Next image optimization is disabled globally. Source tokens exist, but many screens repeat local palettes, typography values, and large inline style definitions.

Generate appropriately sized modern image variants, preserve the approved image composition, and measure transfer size and LCP on a constrained mobile connection. Consolidate repeated semantic tokens and controls as screens are corrected. Native memory pressure, frame rate, and actual Core Web Vitals remain unmeasured.

Evidence appears in [hero backgrounds](<C:/Users/deepjyoti/Desktop/vellora-health/src/app/globals.css:324>), [Next images configuration](<C:/Users/deepjyoti/Desktop/vellora-health/next.config.mjs:10>), and [Expo theme](<C:/Users/deepjyoti/Desktop/vellora-health/vellora-health-mobile/src/constants/theme.ts:10>).

### R20. Environment tracking and database tooling need a supported release setup

`.env` is tracked. The inspected values describe development, simulated SMS/payment providers, empty SMS credentials, and placeholder-like payment keys. This inspection did not establish a leaked production credential. Tracking that file nevertheless creates a straightforward path for future credentials to enter Git.

The installed Prisma CLI is `8.0.0-rc.33`, while `@prisma/client` is `7.10.1`. The conventional validation command is unavailable in this CLI. The project has a schema but no verified persistence integration or migration workflow.

Keep documented placeholders in `.env.example`, keep real environment values outside Git, and inspect history if production credentials have ever been committed. Select a supported compatible database toolchain and verify schema generation, migrations, production provisioning, and recovery before relying on it.

Evidence appears in [ignore rules](<C:/Users/deepjyoti/Desktop/vellora-health/.gitignore:25>), [database dependencies](<C:/Users/deepjyoti/Desktop/vellora-health/package.json:13>), and [schema](<C:/Users/deepjyoti/Desktop/vellora-health/prisma/schema.prisma:1>).

## Interface audit

Implementation integrity fails the real-patient release standard because visible success messages and security assurances do not consistently match the operation performed. Existing layout and component work can be retained while those behaviors are corrected.

These are provisional source-review scores. They are not a performance benchmark, accessibility certification, or an overall security score.

| Web dimension | Score out of 4 | Evidence |
| --- | --- | --- |
| Accessibility | 2 | Labels, landmarks, image descriptions, and dialog handling exist. Reduced-motion visibility and some control semantics need work |
| Performance | 2 | Build output is usable and lazy loading exists. Large hero assets and disabled image optimization remain |
| Responsive design | 3 | The sampled narrow homepage had matching document and content widths, with a usable mobile header. Full route/device coverage remains pending |
| Theming | 2 | CSS/theme tokens exist alongside repeated local values and inconsistent brand spelling |
| Implementation integrity | 1 | Several primary journeys report success or verification without the corresponding operation |
| Total | 10/20 | Significant work remains before release |

| Native source dimension | Score out of 4 | Evidence and limit |
| --- | --- | --- |
| Accessibility | 1 | Many touch actions lack explicit names or roles. Device screen-reader and large-text checks remain pending |
| Performance | 2 | Export succeeds. Several large image assets exist. Native startup and frame behavior remain unmeasured |
| Appearance and theming | 2 | Shared theme exists with many per-screen palettes |
| Platform conformance | 2 | Expo Router and safe-area handling are present. Keyboard and assistive-technology behavior need device checks |
| Adaptivity | 1 | Portrait phone layouts dominate. Tablet and multi-window behavior remain unverified |
| Total | 8/20 | Provisional source assessment with native validation still pending |

The web detector returned 12 warnings. They include spring/bounce styling, layout-property transitions, a rounded accent border, and one muted-text color pairing. The spring/border preferences were not promoted to major risks. Width transitions require profiling before making a jank claim, and color contrast needs measurement in its actual rendered state. The confirmed reduced-motion defect and misleading operational states take priority.

Positive findings include strict TypeScript, successful production compilation, working representative routes, semantic public-page landmarks and image descriptions, FAQ states, some focus and dialog handling, an internal redirect validator, reusable layout components, centralized content, Expo Router, safe-area support, and explicit demo disclosures on several public sections.

## Recommended fix order and release evidence

1. Resolve R01–R03 by establishing protected identity, record authorization, and durable shared storage. Verify that a guest cannot read operational data and that one patient cannot read another patient's record. Verify that bookings survive refresh, relaunch, and separate devices.
2. Resolve R04–R06 by linking clinical records to authorized encounters, enforcing clinician eligibility and visit transitions, and making payment and payout status depend on verified financial events.
3. Resolve R07–R14 through the normal patient and provider journeys. A lab order must remain a lab order, a cancelled visit must remain cancelled after relaunch, and every saved profile, uploaded document, support request, and download must have a durable result.
4. Resolve R15–R20, run the regression checks from R16, and verify the hosted environment and native devices. Substantiate public claims and publish the required operational and policy content before removing demo disclosures.

For interface remediation, `$impeccable harden` fits the misleading success/error states, `$impeccable animate` fits reduced-motion visibility, `$impeccable adapt` fits device and touch behavior, `$impeccable optimize` fits measured asset and rendering cost, and `$impeccable clarify` fits inconsistent product copy. Finish with `$impeccable polish` after functional verification. Re-run `$impeccable audit` after those fixes. These interface passes can be scheduled individually or together.

Only this review document was authored as part of the audit. Existing application changes were preserved. Isolated data-layer mutations ran in a separate process against fixtures, and browser state changes stayed in the local test session.
