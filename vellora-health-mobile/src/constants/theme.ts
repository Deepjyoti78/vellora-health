/**
 * Vellora Health — Premium Customer Mobile App Design System Tokens
 * Strictly aligned with the approved design references:
 * Deep forest green (#075239), warm ivory background (#FAF8F4), soft sage accents (#E9F0E7),
 * deep charcoal text (#142B26), and elegant editorial serif headings.
 */

import { Platform } from 'react-native';

export const Colors = {
  // Brand Primary & Forests
  primary: '#075239',          // Deep forest green for primary buttons, active states, brand
  primaryDark: '#063D2E',      // Darker forest for pressed interactions
  primaryLight: '#0E684B',     // Highlight forest

  // Backgrounds & Surfaces
  background: '#FAF8F4',       // Warm ivory / off-white universal background
  surface: '#FFFFFF',          // Clean white surface for cards & inputs
  surfaceSubtle: '#F4F7F3',    // Light sage tinted container
  
  // Sage & Accents
  sage: '#E9F0E7',             // Soft sage green tint
  sageLight: '#F2F6F1',        // Very soft sage for icon circles
  sageBorder: '#D2DEC0',       // Border for sage elements
  sageText: '#2D5B4F',         // Dark sage text

  // Text Colors
  textPrimary: '#142B26',      // Deep charcoal/forest for headings and primary labels
  textSecondary: '#586660',    // Secondary body and metadata text
  textMuted: '#8A9993',        // Placeholder and timestamp text
  textInverse: '#FFFFFF',      // White text on dark green buttons

  // Dividers, Borders & Lines
  line: '#E7ECE5',             // Subtle 1px dividers
  border: '#DFE5DC',           // Clean input and card borders
  borderFocused: '#075239',    // High-contrast focused border

  // Status & Clinical Signals
  emerald: '#059669',          // Success, active, verified status
  emeraldLight: '#ECFDF5',
  emeraldBorder: '#A7F3D0',
  amber: '#D97706',            // In-transit, pending, ETA status
  amberLight: '#FEF3C7',
  amberBorder: '#FDE68A',
  rose: '#E11D48',             // Error, validation alert, emergency
  roseLight: '#FFE4E6',
  roseBorder: '#FECDD3',

  // Legacy mappings for backwards-compatibility with existing screens
  forest: '#075239',
  forestDark: '#063D2E',
  teal: '#116B70',
  tealDark: '#0E575B',
  tealLight: '#E9F0E7',
  ink: '#142B26',
  inkSoft: '#586660',
  mist: '#FAF8F4',
  white: '#FFFFFF',
  muted: '#586660',
  mutedLight: '#8A9993',
};

export const Typography = {
  fontFamily: {
    // Serif for prominent editorial headings ("Care, closer to home.", "Your care starts here.", etc.)
    serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
    // Clean sans-serif for UI, inputs, buttons, body copy
    sans: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }),
    medium: Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'sans-serif' }),
    semibold: Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'sans-serif' }),
    bold: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }),
    heavy: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }),
    regular: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }),
  },
  fontSize: {
    xs: 12,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    display: 28,
    hero: 34,
  },
  lineHeight: {
    xs: 16,
    sm: 18,
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
  screenPadding: 22, // 22px horizontal screen padding matching references
};

export const BorderRadius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  card: 18,          // Clean rounded card corner
  pill: 9999,        // Pill button & chip
};

export const Shadows = {
  subtle: {
    shadowColor: '#142B26',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  card: {
    shadowColor: '#142B26',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modal: {
    shadowColor: '#142B26',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },
};

export const TouchTargets = {
  minHeight: 48,
  minWidth: 48,
};
