# Vellora Health — Next.js Application

A production-ready, accessible, and responsive healthcare web application built with **Next.js (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**, migrated from the original static prototype while preserving 100% of the visual identity, typography, layouts, image assets, and interactions.

---

## Tech Stack & Architecture

- **Framework**: [Next.js](https://nextjs.org/) 15.2 (App Router, Server & Client Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode, full type safety)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & CSS Custom Properties design system
- **Typography**: `next/font/google` with **Manrope** (headings) & **DM Sans** (body), zero layout shift
- **Icons**: Typed SVG icon system matching all original vector paths
- **State Management**: React Context (`BookingContext`) for appointment flow & modal orchestration
- **SEO & Metadata**: Dynamic metadata, OpenGraph tags, sitemap (`/sitemap.xml`), and robots (`/robots.txt`)

---

## Project Structure

```
vellora-health/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout, Google fonts, metadata, providers
│   │   ├── page.tsx           # Assembled landing page
│   │   ├── globals.css        # Tailwind directives, CSS variables, fluid responsive styles
│   │   ├── robots.ts          # Search engine crawler directives
│   │   └── sitemap.ts         # Automated XML sitemap
│   ├── components/
│   │   ├── common/
│   │   │   ├── BookingModal.tsx   # Accessible booking dialog with keyboard focus trap
│   │   │   ├── Icon.tsx           # Typed SVG vector icon sprite
│   │   │   └── SliderArrows.tsx   # Motion-aware horizontal scroll buttons
│   │   ├── home/
│   │   │   ├── HeroSection.tsx        # Photographic hero, trust count, CTAs
│   │   │   ├── ServicesSection.tsx    # Services card slider & value pillars
│   │   │   ├── SpecialtiesSection.tsx # 16 specialty tiles with auto pre-selection
│   │   │   ├── DoctorsSection.tsx     # Specialist doctor cards with booking triggers
│   │   │   ├── ExperienceSection.tsx  # Convenience & patient experience badges
│   │   │   ├── ReviewsSection.tsx     # Testimonials slider with star ratings
│   │   │   ├── FacilitiesSection.tsx  # Modern clinic facilities showcase
│   │   │   ├── FaqSection.tsx         # Exclusive accordion FAQ
│   │   │   └── CtaBanner.tsx          # High-impact closing CTA banner
│   │   └── layout/
│   │       ├── Header.tsx             # Transparent navigation bar & mobile drawer
│   │       └── Footer.tsx             # Multi-column sitemap, legal blurb, dynamic year
│   ├── context/
│   │   └── BookingContext.tsx # Context for modal state and pre-filled inputs
│   ├── data/
│   │   └── site-content.ts    # Decoupled content arrays, links, and text
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces for all content models
│   └── lib/
│       └── utils.ts           # Class merging utilities (clsx + tailwind-merge)
├── public/
│   └── assets/                # WebP photos, avatars, and SVG favicon
├── _original_source/          # Untouched preservation copy of initial HTML/CSS/JS source
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
└── next.config.mjs
```

---

## Getting Started

### Prerequisites
- Node.js `v20.x` or `v22.x`
- npm `v10.x` or higher

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Type Check
```bash
# Verify TypeScript types
npx tsc --noEmit

# Compile production bundle
npm run build

# Start production server
npm run start
```

---

## Verified Features

1. **Pixel-Perfect Visual Fidelity**: Preserved full-bleed hero image composition, gradient masks, trust metric (`135k+`), and button styling.
2. **Context-Aware Booking**:
   - Clicking any general "Book Appointment" button opens the request modal.
   - Clicking any specialty tile (e.g. *Cardiology*) automatically selects that specialty in the dropdown.
   - Clicking a doctor's action arrow (e.g. *Dr. Maya Patel*) automatically fills the doctor input field.
3. **Accessibility**:
   - Focus trapping inside modal dialog (`Tab` / `Shift+Tab`).
   - `Escape` key closes active modals and mobile drawer.
   - Restores focus to the triggering element upon closure.
   - Dynamic date minimum constraint prevents booking past dates.
4. **Smooth-Snap Horizontal Sliders**: Services, Doctors, Reviews, and Facilities sliders scroll smoothly across viewports and honor `prefers-reduced-motion`.
5. **Responsive Design**: Tested and verified across desktop (1280px+), tablet (768px-1024px), and mobile (375px-620px) viewports with zero horizontal overflow.
6. **Zero Errors**: Passed production compilation (`npm run build`) with static generation, zero hydration mismatches, and zero console warnings.
