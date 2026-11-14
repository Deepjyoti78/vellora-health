# 01 — Project Structure & File System Anatomy

This section details the physical layout, file organization, directory architecture, and configuration boundaries of the Vellora Health codebase.

---

## 1. Directory Tree Overview

```text
vellora-health/
├── .env                              # Environment variable configuration (mock mode active)
├── .env.example                      # Reference template for production deployment
├── .gitignore                        # Git exclusion rules (.next, node_modules, logs)
├── index.html                        # Original legacy HTML file (preserved for fidelity reference)
├── styles.css                        # Original legacy CSS stylesheet (preserved)
├── script.js                         # Original legacy JavaScript logic (preserved)
├── next.config.mjs                   # Next.js 15 configuration (image domains, redirects)
├── package.json                      # Dependency manifest (Next 15.5.29, React 19, Tailwind 4, Lucide)
├── package-lock.json                 # Pinned dependency lockfile
├── postcss.config.mjs                # PostCSS pipeline for Tailwind CSS
├── tailwind.config.ts                # Tailwind theme extensions, colors, font families
├── tsconfig.json                     # TypeScript strict configuration & module resolution paths
├── tsconfig.tsbuildinfo              # TypeScript incremental build cache
├── README.md                         # Project documentation and developer runbook
│
├── _original_source/                 # Immutable archive of pre-migration source assets
│
├── prisma/
│   └── schema.prisma                 # Declarative relational schema (PostgreSQL target)
│
├── public/
│   └── assets/                       # Static media, SVG icons, team avatars, and webp images
│       ├── avatar-1.webp .. avatar-3.webp
│       ├── compassionate-hospital-care.png
│       ├── doctor-1.webp .. doctor-4.webp
│       ├── facility-1.webp .. facility-4.webp
│       ├── hero-team.webp
│       └── ...
│
├── src/
│   ├── app/                          # Next.js App Router (File-system routing)
│   │   ├── layout.tsx                # Root layout, fonts, metadata, global styles wrapper
│   │   ├── page.tsx                  # Public Homepage route (/)
│   │   ├── globals.css               # Global Tailwind directives & custom CSS variables
│   │   ├── robots.ts                 # SEO search engine crawl rules
│   │   ├── sitemap.ts                # Dynamic XML sitemap generator
│   │   │
│   │   ├── about/page.tsx            # Public About page (/about)
│   │   ├── contact/page.tsx          # Public Contact page (/contact)
│   │   ├── doctors/page.tsx          # Public Doctors catalog (/doctors)
│   │   ├── facilities/page.tsx       # Public Facilities catalog (/facilities)
│   │   ├── services/                 # Public Services directory
│   │   │   ├── page.tsx              # All services overview (/services)
│   │   │   └── [slug]/page.tsx       # Dynamic individual service detail (/services/[slug])
│   │   │
│   │   ├── patient/                  # Patient & Customer Application Portal
│   │   │   ├── layout.tsx (inherits) # Shared Patient navigation header & layout
│   │   │   ├── login/page.tsx        # Phone OTP authentication
│   │   │   ├── register/page.tsx     # Patient onboarding
│   │   │   ├── dashboard/page.tsx    # Patient home command center
│   │   │   ├── book/page.tsx         # 4-stage interactive booking engine
│   │   │   ├── bookings/             # Appointments list & history
│   │   │   │   ├── page.tsx          # Appointments list
│   │   │   │   └── [id]/page.tsx     # Live status tracker & verification PIN
│   │   │   ├── records/              # Medical records & diagnostic reports
│   │   │   │   ├── page.tsx          # EHR summary & vitals history
│   │   │   │   └── [id]/page.tsx     # Printable digital diagnostic report
│   │   │   ├── family/page.tsx       # Family dependent profiles
│   │   │   ├── account/page.tsx      # Personal profile & emergency contacts
│   │   │   └── support/page.tsx      # Helpdesk & incident ticket center
│   │   │
│   │   ├── provider/                 # Healthcare Clinician Portal
│   │   │   ├── login/page.tsx        # Multi-role persona login (MD, RN, Caretaker, Lab)
│   │   │   ├── onboarding/page.tsx   # Professional license & credential upload
│   │   │   ├── dashboard/page.tsx    # Online duty toggle & live dispatch queue
│   │   │   ├── appointments/         # Assigned visits & past encounters
│   │   │   │   ├── page.tsx          # Assigned schedule
│   │   │   │   └── [id]/page.tsx     # Bedside visit execution (PIN unlock, e-Rx, vitals)
│   │   │   ├── availability/page.tsx # Weekly shift scheduler & geo-radius
│   │   │   ├── earnings/page.tsx     # Payouts, completed trips, settlement history
│   │   │   └── profile/page.tsx      # Clinician bio, licenses, malpractice insurance
│   │   │
│   │   └── admin/                    # Super Admin Command Desk
│   │       ├── dashboard/page.tsx    # Fleet KPI overview & financial summary
│   │       ├── dispatch/page.tsx     # Live 5-stage dispatch Kanban board
│   │       ├── bookings/page.tsx     # Master audit table for all system appointments
│   │       ├── providers/page.tsx    # Clinician roster & active status
│   │       ├── verifications/page.tsx# CMO credential verification queue
│   │       ├── patients/page.tsx     # Master Patient Index (MPI)
│   │       ├── services/page.tsx     # Clinical service catalog & rate card editor
│   │       ├── finance/page.tsx      # Platform gross margins, payouts, commission
│   │       ├── feedback/page.tsx     # CSAT ratings, reviews, incident escalation
│   │       └── settings/page.tsx     # System configuration, SLAs, geo-fencing
│   │
│   ├── components/
│   │   ├── common/                   # Shared UI primitives
│   │   │   ├── BookingModal.tsx      # Quick booking overlay modal
│   │   │   ├── Icon.tsx              # Universal icon abstraction
│   │   │   ├── RoleSwitcher.tsx      # Development role switcher pill (Patient/Provider/Admin)
│   │   │   └── SliderArrows.tsx      # Carousel arrow controls
│   │   ├── home/                     # Homepage sectional components
│   │   │   ├── HeroSection.tsx       # Dark hero with right-side stat column & pill badge
│   │   │   ├── ServicesSection.tsx   # 4-column responsive service cards
│   │   │   ├── DoctorsSection.tsx    # Verified doctor highlights
│   │   │   ├── FacilitiesSection.tsx # Hospital & clinical facility cards
│   │   │   ├── SpecialtiesSection.tsx# Clinical specialty badges
│   │   │   ├── ExperienceSection.tsx # Healthcare metrics & clinical standards
│   │   │   ├── ReviewsSection.tsx    # Patient testimonials carousel
│   │   │   ├── FaqSection.tsx        # Collapsible medical FAQ
│   │   │   └── CtaBanner.tsx         # Standalone CTA banner (deprecated/optional)
│   │   └── layout/                   # Role-specific layout wrappers
│   │       ├── Header.tsx            # Main public navbar
│   │       ├── Footer.tsx            # Public corporate footer
│   │       ├── PatientLayout.tsx     # Patient portal sidebar & top navigation
│   │       ├── ProviderLayout.tsx    # Clinician workstation header & status bar
│   │       └── AdminLayout.tsx       # Super Admin high-density sidebar & command bar
│   │
│   ├── context/
│   │   ├── AuthContext.tsx           # Mock multi-persona authentication state
│   │   └── BookingContext.tsx        # Multi-step checkout & booking state
│   │
│   ├── data/
│   │   └── site-content.ts           # Public marketing copy, FAQ items, nav links
│   │
│   ├── lib/
│   │   ├── db.ts                     # In-memory transactional database & seeded entities
│   │   └── utils.ts                  # ClassName concatenation & formatting helpers
│   │
│   └── types/
│       └── index.ts                  # Shared TypeScript interfaces & clinical enum definitions
│
└── audit-output/                     # Target audit deliverables & inspection reports
    ├── 00-EXECUTIVE-SUMMARY.md
    ├── 01-PROJECT-STRUCTURE.md
    ├── 02-FILE-INVENTORY.csv
    ├── assets-manifest.csv
    ├── routes.json
    └── screenshots/                  # 52 High-resolution evidence images
```

---

## 2. File Metrics & Composition
- **Total Tracked Project Files:** 147 (excluding node_modules and .next).
- **TypeScript / TSX Files:** 62 files.
- **CSS Stylesheets:** 2 files (`src/app/globals.css` [34.6 KB] and legacy `styles.css` [25.5 KB]).
- **Image & Icon Assets:** 21 optimized static assets in `public/assets/`.
- **Database Model Files:** 2 files (`prisma/schema.prisma` [declarative] and `src/lib/db.ts` [runtime in-memory]).

---
*Report generated for technical reviewer evaluation.*
