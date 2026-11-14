/**
 * Vellora Health — Standardized Mobile Design System Tokens
 * Aligned with Vellora's clinical brand:
 * Clean white surfaces, deep charcoal typography, restrained healthcare teal accents,
 * comfortable typography, subtle borders, and generous, accessible spacing.
 */

export const Colors = {
  // Brand Primary & Accents
  forest: '#113a2e',           // Deep hospital/clinical green - primary CTAs & headers
  forestDark: '#0d2c23',       // Darkened state for pressed interactions
  forestLight: '#1a4f3f',      // Secondary accent & subtle highlights
  
  teal: '#116b70',             // Brand healthcare teal accent
  tealLight: '#eaf4f3',        // Soft teal surface tint for badges & icons
  tealHover: '#0e5559',
  tealDark: '#0c4447',

  // Dark Neutrals (High Contrast & Readability)
  ink: '#11191b',              // Primary deep charcoal text
  inkSoft: '#415054',          // Secondary paragraph and supporting text
  darkBg: '#172022',           // Dark surface container

  // Clean Light Neutrals
  white: '#ffffff',            // Pure clinical white
  paper: '#ffffff',
  mist: '#f8fafc',             // Neutral light screen background (eliminates eye strain)
  surface: '#ffffff',          // Card & elevated surface background
  surfaceSubtle: '#f1f5f9',    // Secondary card background / table / input fill
  line: '#e2e8f0',             // Crisp, subtle 1px dividers & borders
  lineStrong: '#cbd5e1',       // High-contrast input borders

  // Muted Typography & Metadata
  muted: '#64748b',            // Captions, timestamps, secondary labels
  mutedLight: '#94a3b8',

  // Clinical Status & Safety Palette
  emerald: '#059669',          // Success, active, verified doctor tag, normal vitals
  emeraldLight: '#ecfdf5',
  emeraldBorder: '#a7f3d0',

  amber: '#d97706',            // In-transit, pending arrival, abnormal review
  amberLight: '#fffbeb',
  amberBorder: '#fde68a',

  rose: '#e11d48',             // Emergency dispatch, cancelled, critical lab flag
  roseLight: '#fff1f2',
  roseBorder: '#fecdd3',

  blue: '#0284c7',             // Information, clinical tips
  blueLight: '#f0f9ff',
  blueBorder: '#bae6fd',
};

export const Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
    heavy: 'System',
  },
  fontSize: {
    xs: 12,        // Minimum accessible text size - no tiny unreadable fonts
    sm: 14,
    base: 15,
    md: 17,
    lg: 19,
    xl: 22,
    xxl: 26,
    display: 30,
    hero: 34,
  },
  lineHeight: {
    xs: 16,
    sm: 19,
    base: 22,
    md: 24,
    lg: 26,
    xl: 28,
    xxl: 32,
    display: 36,
    hero: 40,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
};

export const Spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  screenPadding: 16, // Clean 16px horizontal screen padding for mobile
};

export const BorderRadius = {
  xs: 6,
  sm: 8,
  md: 12,
  card: 16,       // Standard clean mobile card radius (not oversized)
  large: 20,
  pill: 9999,     // Signature Vellora rounded pill buttons & badges
};

export const Shadows = {
  card: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHover: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  subtle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  modal: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },
};

export const TouchTargets = {
  minHeight: 48,  // Minimum accessible touch target per WCAG mobile guidelines
  minWidth: 48,
};
