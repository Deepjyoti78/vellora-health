# 05 — Design System & Visual Hierarchy Audit

This document examines the typography, color palette, component design tokens, button states, spacing scales, and visual consistency across the Vellora Health platform.

---

## 1. Color Palette & Token Definitions

The design system employs a high-contrast clinical palette balancing a dark, cinematic hero treatment with an ultra-clean, clinical-grade white presentation across lower body sections and application portals.

### Color Tokens:
| Token Name | Hex Value | Usage & Application |
| :--- | :---: | :--- |
| `primary-forest` | `#113a2e` | Primary clinical brand color, deep hospital green used in buttons, active states, and public accents. |
| `primary-forest-hover` | `#0d2c23` | Darkened hover state for interactive elements. |
| `primary-forest-light` | `#1a4f3f` | Secondary accent, badge backgrounds, and subtle highlight rings. |
| `hero-dark-bg` | `#081014` | Hero section backdrop, matching original cinematic photography mood. |
| `pure-white-body` | `#ffffff` | Universal page background for all body content, eliminating off-white margins. |
| `surface-neutral-50` | `#f8fafc` | Table headers, secondary cards, muted badges, and input fills. |
| `surface-neutral-100`| `#f1f5f9` | Dividers, card borders, and disabled controls. |
| `text-neutral-900` | `#0f172a` | Primary headings, clinical labels, patient names, and data values. |
| `text-neutral-600` | `#475569` | Body paragraphs, secondary metadata, timestamps, and captions. |
| `clinical-emerald` | `#059669` | Success badges, verified clinician tags, completed visits, positive vitals. |
| `clinical-amber` | `#d97706` | Pending dispatch, in-transit status, and abnormal lab flags. |
| `clinical-rose` | `#e11d48` | Emergency alerts, canceled visits, critical lab results, and validation errors. |

---

## 2. Typography Hierarchy

The platform imports modern sans-serif typography (`Inter` or `Plus Jakarta Sans`) configured via Next.js `next/font/google` in `src/app/layout.tsx`.

| Hierarchy Level | Font Size / Weight | Line Height | Usage Example |
| :--- | :--- | :--- | :--- |
| **Display H1** | `48px – 64px` / Bold (800) | `1.1 – 1.15` | Hero headline: *"EXCEPTIONAL HEALTHCARE ALWAYS"* |
| **Page H2** | `32px – 40px` / Bold (700) | `1.2 – 1.25` | Section headers: *"Everything you need for better health"* |
| **Section H3** | `22px – 26px` / SemiBold (600) | `1.3` | Card titles, modal headers, dashboard summary widgets |
| **Subheading H4** | `18px – 20px` / Medium (500) | `1.4` | Doctor names, service card categories, dispatch column headers |
| **Body Large** | `16px` / Regular (400) | `1.5 – 1.6` | Narrative copy, clinical descriptions, service explanations |
| **Body Small** | `14px` / Regular (400) | `1.4` | Table cell data, patient metadata, form inputs, secondary badges |
| **Microcopy / Caption** | `12px` / Medium (500) | `1.3` | Stat sub-labels: *"Patients Served Successfully"*, time ago stamps |

---

## 3. UI Primitives & Component Patterns

### A. Buttons & CTAs
- **Primary Action (`.btn-primary`):** Rounded pill (`rounded-full` or `rounded-xl`), `#113a2e` background with white text and chevron icon.
- **Secondary Action (`.btn-secondary`):** Translucent glass pill (`border border-white/20 bg-white/10 text-white`) in the dark hero, or neutral outline (`border-slate-300 bg-white text-slate-800`) in light sections.
- **Interactive State Feedback:** Includes smooth CSS transitions (`transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`).

### B. Cards & Elevators
- **Public Service Cards:** 4-column responsive grid on desktop. Each card features an image container with rounded corners (`rounded-2xl`), categorical chip (e.g. `01 / CARE`), bold title, descriptive text, and a bottom arrow icon.
- **Dashboard Metric Cards:** Flat surface (`bg-white border border-slate-200 rounded-2xl p-6 shadow-sm`), top stat number in bold `28px`, icon badge, and trend indicator.

### C. Tables & Grids
- Designed for high-density administrative readability.
- Subtle row striping, sticky headers, and horizontal scroll wrappers (`overflow-x-auto`) to guarantee mobile and tablet compliance.

---
*Report generated for technical reviewer evaluation.*
