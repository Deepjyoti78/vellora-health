# Vellora Health design system

The reference comes from [global CSS](../src/app/globals.css), [Tailwind configuration](../tailwind.config.ts), [root font configuration](../src/app/layout.tsx), and the separate [Expo theme](../vellora-health-mobile/src/constants/theme.ts). Project metadata and repository naming use **Vellora Health**. Some logo alternative text uses Velora or Valora.

## Foundations

| Role | Public web | Patient and provider web | Admin | Expo patient app |
| --- | --- | --- | --- | --- |
| Primary action | Teal #116B70, hover #0E5559 | Forest #064E3B and teal #116B70 | Forest #064E3B, interactive #047857 | Forest #075239, pressed #063D2E |
| Foreground | Ink #11191B, supporting #687476 | Deep green #102820 with slate supporting text | Text #102820, secondary #64748B | Ink #142B26, secondary #586660 |
| Canvas | White #FFFFFF, mist #F5F7F7 | White or pale #F8FAF9 | Canvas #F5F9F7, sidebar #F2F8F5 | Ivory #FAF8F4, white cards |
| Tint and line | Teal tint #EAF4F3, line #E5E9E9 | Mint #ECFDF5, border #E2EBE7 | Accent #D1FAE5, border #E2EBE7 | Sage #E9F0E7, border #DFE5DC |

**Typography.** Web loads DM Sans for body and UI, Manrope for headings, and Playfair Display for selected typography. The next/font configuration requests Manrope and DM Sans in weights 400–800. Expo uses system sans fonts and platform serif display fonts, with a 12–34 px size scale and line heights from 16 to 40 px.

**Layout.** The public container caps at 1432 px. Custom CSS includes breakpoints at 620, 768, 900, and 1200 px alongside Tailwind breakpoints. The code uses responsive wrapping, horizontal card strips, mobile drawers, and a 20 px custom radius. Admin changes its sidebar to a drawer below the Tailwind md breakpoint. The Expo theme defines 4, 8, 12, 16, 20, 24, 32, and 40 px spacing, a 22 px screen inset, 18 px card corners, pill buttons, and a 48 px target token.

## Reusable patterns

| Pattern | Existing implementation | Candidate Figma states |
| --- | --- | --- |
| Primary and secondary actions | Public global CSS buttons, portal Tailwind controls, Expo Button | Primary, secondary, hover or pressed, disabled, loading |
| Header and navigation | Header, Footer, PatientLayout, ProviderLayout, Expo tab layout | Desktop, mobile closed/open, guest/account, active tab |
| Admin sidebar and header | AdminSidebar, AdminHeader, AdminLayout | Expanded, collapsed, drawer, selected row |
| Input and dropdown | Web form controls, Expo Input, native select in reviewed forms | Default, focused, populated, error, disabled |
| Dialogs and confirmations | BookingModal, AuthModal, RequestSuccessState | Closed/open, validation, submitting, success |
| Cards and status | Public service and doctor cards, patient booking cards, Expo ServiceCard and Badge | Default, selected, requested, scheduled, completed, canceled |
| Dashboard and tables | MetricCard, RecentAppointmentsTable, PatientVisitsChart, RevenueDonutChart and other admin components | Active filters, filled, empty, row detail |

The design file contains editable capture hierarchy and source image fills. The public homepage was inspected in the Figma editor as an Auto Layout frame with nested editable layers. The [patient verification button set](https://www.figma.com/design/WjeTBD8esH0aNX0Joe8y4t?node-id=123-11) contains native Default and Hover variants with Auto Layout and a While hovering → Change to interaction. Its fills use the web implementation’s #064E3B and #065F46. The other patterns are documented for conversion to main components and instances. Figma’s editor surfaced a missing-font notice on the imported file. Resolve the listed font families against the web configuration before presenting or editing type.

## Handoff checks

- [Route and asset inventory](figma-page-inventory.md)
- [Interaction status and native wiring steps](prototype-interactions.md)
- Preserve the actual form labels, semantic status colors, and role-specific shells when creating variants.
- The reduced-motion rule disables animations globally. Elements initialized to opacity zero by entrance classes remain invisible in that mode. Review the final styles of the affected classes under reduced motion when making a code accessibility fix.
- In the updated Expo web preview at 390 × 844, the header mark is partially clipped on Home and Services, and the Home tab labels are partially clipped. Native safe-area behavior needs device verification.
