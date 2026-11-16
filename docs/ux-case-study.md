# Vellora Health
## UI/UX case study

**Project type** · Home healthcare platform and companion patient app  
**Disciplines** · UI/UX design review, design systems, and frontend handoff  
**Scope** · Existing public website, patient portal, provider portal, administration workspace, and a separate Expo patient app

### 01 · Cover

Vellora Health brings home healthcare discovery, visit requests, patient follow-up, and provider operations into one interface family. The cover shows the running public homepage and the Expo welcome screen.

### 02 · One platform, four web experiences

- **Public website.** Visitors can browse service categories, find visiting clinicians, and request a callback or a more specific appointment.
- **Patient portal.** Patients can book for themselves or a dependent, track a visit, review records, and manage their account.
- **Provider portal.** Clinicians can apply, follow verification, manage availability and visits, and enter clinical notes in the demo workspace.
- **Administration.** Operations teams can review bookings, dispatch, clinicians, patients, service tariffs, and applications.
- **Companion app.** A separate Expo project provides a mobile patient experience with a distinct forest-and-ivory palette.

The local review used seeded data. Account verification, care requests, dispatch updates, and payment labels were represented by the demo.

### 03 · Making a care request easier to understand

**Observed.** The public site exposes three different entry points. The callback form collects contact details, the doctor path starts with visit mode and scheduling, and the service path starts with a specific care offering. The portal then handles patient, address, scheduling, and review.

**UX hypothesis.** A patient may interpret each booking CTA as an immediately confirmed appointment. The request confirmation, reference number, and return links help show what was submitted and where to go next.

**Observed in QA.** Several animated sections remain transparent when reduced motion is enabled. The implementation handoff records the CSS cause and the relevant capture setting.

### 04 · Information architecture

- Public home → Services → Category → Service detail → Service request.
- Public home → Doctors → Doctor booking. Each specialist card can route to a booking form.
- Public home → Quick enquiry → Callback acknowledgement.
- Patient sign-in → OTP → Dashboard → Booking wizard, My bookings, Records, Family, or Account.
- Join as provider → Registration → Verification wizard → Application status. Provider portal navigation leads to visits, requests, availability, records, earnings, and profile.
- Admin dashboard → Appointments or live dispatch. Doctors also leads to the credential queue.
- Expo welcome → Sign-in and OTP → Account setup or Home. The tabs expose Bookings, Records, and Account.

The facilities URL redirects to Services. Facility content is also presented on the public homepage.

### 05 · From source to design review

1. Read the App Router and Expo Router source, the layouts, and the visual tokens. Compare the live route tree to the older in-repository audit.
2. Run the web application and Expo web preview. Capture public and demo role views at 1440 × 960 and representative mobile views at 390 × 844.
3. Convert rendered screens with Figma's capture integration. Inspect the editable homepage frame in the Figma editor and record the status of native linking.
4. Assemble the case study using application screenshots and the source-backed inventory.

**Toolchain used for this handoff.** Codex, Playwright and Chrome, Figma MCP and the Figma editor, Python and ReportLab, and Poppler. Application interfaces and imagery came from the supplied project. The review, conversion, and documentation were AI-assisted.

### 06 · Visual system

**Public web.** Deep ink #11191B, teal #116B70, and white #FFFFFF. Manrope and DM Sans drive the web type hierarchy, with Playfair Display available for selected editorial accents. The public shell caps content at 1432 px and defines a 20 px custom radius.

**Portals.** Forest #064E3B, interactive emerald #047857, mint #ECFDF5, and a pale #F5F9F7 canvas. Shared layouts repeat status, navigation, and form patterns. Dashboard cards and charts use the administration palette. The Figma patient verification button has native Default and Hover variants.

**Mobile app.** Forest #075239, warm ivory #FAF8F4, sage #E9F0E7, and ink #142B26. The React Native theme sets a 4–40 spacing scale, 18 px cards, and platform-native sans and serif roles.

### 07 · Public website experience

The homepage uses photography and direct care actions. Services groups offerings by care category, and the doctors directory gives visitors a route into a clinician-specific request. Readers can reach facility information on the homepage and explore the care catalog from the former facilities URL.

**Evidence.** Running homepage, service directory, and clinician directory.

### 08 · Patient experience

The dashboard puts active and upcoming visits ahead of the broader management shortcuts. The booking wizard moves from service and shift to patient and address, visit timing, and review. The bookings list leads into a tracker, and the records area has separate details for seeded reports.

**Evidence.** Dashboard, booking wizard, and verification states captured with the app’s demo patient data.

### 09 · Healthcare provider experience

The application flow collects professional and service details before showing verification status. The workspace groups appointment itinerary, incoming requests, duty availability, clinical records, earnings, and profile. The visit cockpit combines the itinerary and encounter controls for a seeded visit.

**Evidence.** Provider dashboard and practitioner verification wizard.

### 10 · Administration workspace

The dashboard combines summary metrics, visit and revenue charts, and recent appointments. The sidebar leads to the bookings registry, dispatch, clinicians, credential review, patient directory, services, finance, quality, and settings. Metrics and financial values shown in the captures are fixture data.

**Evidence.** Dashboard and bookings registry.

### 11 · Responsive web and Expo

The responsive web homepage keeps its photographic composition as the viewport narrows and collapses navigation behind the menu. The Expo app uses its own welcome screen, forest primary button, editorial type, and four-tab patient navigation. Its updated home adds service search and a link to the catalog, which filters care by category. The 390 px review used the Expo web renderer.

### 12 · Figma design and interaction coverage

The Figma Design file contains editable rendered captures. In Present mode, the Public Website flow starts at Home. Sign in opens the patient login frame and its logo returns to Home. Both links were click-tested. The homepage uses vertical scrolling.

- Public entry → care discovery → request.
- Patient verification → dashboard → bookings and tracking.
- Provider onboarding and workspace navigation.
- Admin dashboard → bookings or credential review.

[Open Figma Design](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t)  
[Play verified sign-in demo](https://www.figma.com/proto/WjeTBD8esH0aNX0Joe8y4t/Vellora-Health-%E2%80%94-Complete-UI-UX-Design-System---Interactive-Prototype?node-id=1-2&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A2)

The interaction report records which captured states still need Figma links. The Starter-plan MCP limit blocked bulk creation of connections and native design-system assets.

### 13 · Implementation and handoff

**Web.** Next.js App Router, React, TypeScript, Tailwind CSS, Lucide and typed SVG icons, and Recharts. Route components consume a seeded TypeScript store. The repository includes a Prisma schema, while the reviewed UI workflows run through the client demo store.

**Expo.** Expo Router and React Native share the app's own fixture and theme modules. The web preview was used for cross-screen evidence.

**Handoff.** The editable Figma file, route inventory, design-system reference, prototype interaction report, reference captures, and case study are part of the delivery. The design documents preserve the existing product structure and record the remaining work needed for a complete native Figma prototype.

### 14 · Project pricing

**Total project fee · ₹30,000 INR**

The fee covers the UI/UX review, editable Figma design, verified sign-in demo, and handoff documented in this case study.

| Workstream | What the fee covers | Fee |
| --- | --- | ---: |
| Product discovery and UX audit | Mapped 48 web screens and 12 Expo screens, including navigation, forms, and role-specific workflows. | ₹5,000 |
| UI/UX and responsive design review | Reviewed layouts and key states across public, patient, provider, and admin journeys on desktop and mobile. | ₹12,000 |
| Editable Figma design and prototype | Converted screens to editable layers, built button variants, and tested the sign-in flow in Present mode. | ₹9,000 |
| Documentation and handoff | Prepared the case study, design-system reference, route inventory, and interaction notes for future updates. | ₹4,000 |
| **Total** | | **₹30,000** |
