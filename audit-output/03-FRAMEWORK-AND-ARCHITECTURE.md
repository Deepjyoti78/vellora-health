# 03 — Framework & Technical Architecture Audit

This section evaluates the Next.js 15 App Router foundation, React 19 integration, TypeScript typing system, styling pipelines, and state management architecture.

---

## 1. Core Technology Stack Matrix

| Layer | Selected Technology | Version | Assessment |
| :--- | :--- | :---: | :--- |
| **Framework** | Next.js App Router | `15.5.29` | **Optimal.** Leverages Server Components by default with explicit `"use client"` directives for interactive portals. |
| **View Library** | React | `19.0.0` | **Latest Stable.** Uses React 19 primitives, concurrent features, and modern hook standards. |
| **Language** | TypeScript | `5.7.2` | **Strict Mode.** Strict typing enforced in `tsconfig.json`. All entities in `types/index.ts` strongly typed. |
| **Styling** | Tailwind CSS & PostCSS | `v4.0.0-beta.8` | **Hybrid Modern.** Utilizes utility-first styling combined with semantic CSS classes for brand colors and dark hero styles. |
| **Icons** | Lucide React | `0.468.0` | **Consistent.** Standardized icon set across public, patient, provider, and admin portals. |
| **ORM / Schema** | Prisma ORM | `6.1.0` | **Declared.** Complete relational schema modeled in `prisma/schema.prisma` targeting PostgreSQL. |
| **Runtime Persistence** | In-Memory DB Repository | In-house (`src/lib/db.ts`) | **Simulated Production.** 890+ lines of transactional state, relational seeds, and query methods. |

---

## 2. Server vs Client Component Boundary Analysis

Next.js App Router best practice mandates Server Components for data fetching and static markup, reserving `"use client"` for components requiring interactivity, browser APIs, or React Context.

### Boundary Breakdown:
- **Server Components:**
  - `src/app/layout.tsx`: Root HTML shell, font injection, viewport, and metadata.
  - `src/app/robots.ts` & `src/app/sitemap.ts`: Dynamic search engine manifests.
  - Static marketing sections in public pages where no interactive state is needed.
- **Client Components (`"use client"`):**
  - All Patient, Provider, and Admin dashboard views (required for tab switching, forms, modals, and localStorage simulation).
  - `src/components/layout/Header.tsx`: Handles active route highlighting and responsive mobile menu state.
  - `src/components/home/HeroSection.tsx`: Houses the role switcher and interactive quick booking triggers.
  - `src/context/AuthContext.tsx` & `src/context/BookingContext.tsx`: Universal state providers.

---

## 3. Hydration & Extension Resilience

In previous audit runs, browser extensions (such as Hammy Translation or password managers) injected DOM attributes like `data-hammy-mounted="true"` prior to React hydration, triggering standard Next.js hydration mismatch warnings.

**Resolution Verified in Codebase:**
In `src/app/layout.tsx` (lines 50–52):
```tsx
<html lang="en" suppressHydrationWarning className={`${fontHeading.variable} ${fontBody.variable}`}>
  <body suppressHydrationWarning className="font-sans antialiased text-[#111827] bg-[#ffffff]">
```
This safely instructs React 19 to ignore browser-injected root attributes without suppressing genuine component-level hydration errors. Browser QA verified zero console hydration warnings.

---

## 4. State Management & Data Flow Architecture

The application implements a 3-tier architectural flow:
1. **Presentation Layer:** App Router pages (`src/app/**`) consuming domain-specific components.
2. **Context & State Layer:**
   - `AuthContext`: Manages current persona (`PATIENT`, `PROVIDER_DOCTOR`, `PROVIDER_NURSE`, `ADMIN`), mock sessions, and profile attributes.
   - `BookingContext`: Orchestrates 4-step booking funnel state (service selection, schedule/shift, patient vitals/notes, and payment).
3. **Data Access Layer (`src/lib/db.ts`):**
   - Singleton mock database simulating tables: `users`, `providers`, `patients`, `services`, `bookings`, `medicalRecords`, `reviews`, `auditLogs`.
   - Methods: `getBookings()`, `getBookingById()`, `updateBookingStatus()`, `createBooking()`, `getProviders()`, `verifyPin()`.

---
*Report generated for technical reviewer evaluation.*
