import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { Typography, Shadows } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { REGIONAL_CONFIG } from '../../data/mockData';

const Palette = {
  primary: '#0F5B43',        // Primary forest green
  primaryLight: '#EAF5EE',   // Soft mint accent
  primaryDark: '#083B2B',    // Dark forest green
  mint: '#EAF5EE',           // Soft mint accent
  mintDeep: '#D5ECE0',
  bgWarm: '#FBFAF7',         // Warm ivory page background
  surface: '#FFFFFF',        // Card white
  textDark: '#1B2A24',       // Primary text
  textMuted: '#6B7E75',      // Secondary text
  border: '#DCE9E1',         // Clean border
  badgeDot: '#E53E3E',       // Red notification dot
  logoutRed: '#E11D48',      // Rose/Red for logout
  logoutBg: '#FFF1F2',       // Soft rose background
  logoutBorder: '#FECDD3',   // Soft rose border
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const patientName = user?.name || 'Arjun Sharma';
  const patientEmail = user?.email || 'arjun.sharma@example.com';

  const handleLogout = () => {
    try {
      logout();
    } catch (err) {
      console.warn('Logout error', err);
    }
    router.replace('/(auth)/welcome');
  };

  const handleCallSupport = () => {
    Alert.alert(
      '24/7 Care Coordinator',
      'Would you like to connect with your dedicated clinical coordinator (+91 80 4910 8800)?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', onPress: () => Linking.openURL(`tel:${REGIONAL_CONFIG.supportPhone}`) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      {/* Ambient Wellness Background Glow Orbs */}
      <View style={styles.ambientGlowTopRight} pointerEvents="none" />
      <View style={styles.ambientGlowMidLeft} pointerEvents="none" />
      <View style={styles.ambientGlowBottomRight} pointerEvents="none" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ============================================================ */}
        {/* 1. TOP BRAND HEADER                                          */}
        {/* ============================================================ */}
        <View style={styles.topBrandBar}>
          <TouchableOpacity
            style={styles.brandContainer}
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)')}
          >
            <Image
              source={require('../../../assets/images/logo-dark.png')}
              style={styles.brandLogo}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.topActionButtons}>
            <TouchableOpacity
              style={styles.bellBtn}
              activeOpacity={0.75}
              onPress={() => router.push('/(tabs)/bookings')}
              accessibilityLabel="View notifications"
            >
              <Ionicons name="notifications-outline" size={20} color={Palette.textDark} />
              <View style={styles.bellBadgeDot} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.plusBtn}
              activeOpacity={0.75}
              onPress={() => router.push('/services/doctor-visit')}
              accessibilityLabel="Book new visit"
            >
              <Ionicons name="add" size={22} color={Palette.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 2. ILLUSTRATED DIGITAL PATIENT HEALTH CARD                    */}
        {/* ============================================================ */}
        <View style={styles.healthCard}>
          {/* Decorative Subtle Medical SVG Watermark in Background */}
          <Svg
            style={styles.cardWatermarkSvg}
            width={160}
            height={160}
            viewBox="0 0 100 100"
            fill="none"
          >
            <Circle cx="50" cy="50" r="42" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="8" />
            <Path
              d="M50 25v50M25 50h50"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </Svg>

          {/* Top Row: Brand & ID Badge */}
          <View style={styles.cardTopRow}>
            <View style={styles.cardPriorityPill}>
              <Ionicons name="leaf" size={11} color="#A7F3D0" style={{ marginRight: 4 }} />
              <Text style={styles.cardPriorityText}>Priority Home Care Pass</Text>
            </View>

            <Text style={styles.cardMemberId}>#VEL-2025-0842</Text>
          </View>

          {/* Clinician & Patient Info Row */}
          <View style={styles.cardPatientRow}>
            <View style={styles.avatarWrapper}>
              <Image
                source={require('../../../assets/images/avatar-indian-1.jpg')}
                style={styles.patientAvatar}
                resizeMode="cover"
              />
              <View style={styles.avatarVerifiedBadge}>
                <Ionicons name="checkmark" size={10} color="#FFFFFF" />
              </View>
            </View>

            <View style={styles.patientDetailsCol}>
              <Text style={styles.patientName}>{patientName}</Text>
              <Text style={styles.patientEmail}>{patientEmail}</Text>
              <Text style={styles.patientMeta}>34 Yrs • Male • Primary Account</Text>
            </View>
          </View>

          {/* Quick Health & Clinical Vitals Chips */}
          <View style={styles.clinicalChipsRow}>
            <View style={styles.clinicalChip}>
              <Text style={styles.clinicalChipLabel}>Blood</Text>
              <Text style={styles.clinicalChipValue}>O+ Positive</Text>
            </View>

            <View style={styles.clinicalChip}>
              <Text style={styles.clinicalChipLabel}>Allergies</Text>
              <Text style={styles.clinicalChipValue}>None (NKA)</Text>
            </View>

            <View style={styles.clinicalChip}>
              <Text style={styles.clinicalChipLabel}>Care Plan</Text>
              <Text style={styles.clinicalChipValue}>Family Pro</Text>
            </View>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 3. GROUPED CLINICAL & ACCOUNT MENUS                           */}
        {/* ============================================================ */}

        {/* Group A: Care & Medical Records */}
        <Text style={styles.menuGroupHeading}>MY CARE & MEDICAL RECORDS</Text>
        <View style={styles.menuGroupCard}>
          {/* 1. Bookings */}
          <TouchableOpacity
            style={styles.menuRowItem}
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/bookings')}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#EAF5EE' }]}>
              <Ionicons name="calendar-outline" size={18} color={Palette.primary} />
            </View>
            <View style={styles.menuItemTextCol}>
              <Text style={styles.menuLabel}>My Home Bookings</Text>
              <Text style={styles.menuSublabel}>Track active, upcoming & past doctor visits</Text>
            </View>
            <View style={styles.menuBadgePill}>
              <Text style={styles.menuBadgePillText}>2 Scheduled</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#A0AEC0" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* 2. Health Records */}
          <TouchableOpacity
            style={styles.menuRowItem}
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/records')}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="folder-outline" size={18} color="#2563EB" />
            </View>
            <View style={styles.menuItemTextCol}>
              <Text style={styles.menuLabel}>Health Records & e-Prescriptions</Text>
              <Text style={styles.menuSublabel}>Digital consultation notes, lab tests & Rx PDFs</Text>
            </View>
            <View style={[styles.menuBadgePill, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
              <Text style={[styles.menuBadgePillText, { color: '#1D4ED8' }]}>4 Files</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#A0AEC0" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* 3. Family Members */}
          <TouchableOpacity
            style={styles.menuRowItem}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Family Profiles', '3 profiles active: Arjun Sharma (Self), Kavita Sharma (Mother), Ramesh Sharma (Father).')}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="people-outline" size={18} color="#D97706" />
            </View>
            <View style={styles.menuItemTextCol}>
              <Text style={styles.menuLabel}>Family Members & Dependents</Text>
              <Text style={styles.menuSublabel}>Manage care for elderly parents & children</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#A0AEC0" />
          </TouchableOpacity>
        </View>

        {/* Group B: Doorstep Details & Preferences */}
        <Text style={styles.menuGroupHeading}>DOORSTEP DETAILS & PREFERENCES</Text>
        <View style={styles.menuGroupCard}>
          {/* Saved Addresses */}
          <TouchableOpacity
            style={styles.menuRowItem}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Saved Address', '#502, Orchid Residency, Koramangala, Bengaluru - 560034.')}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="location-outline" size={18} color="#7E22CE" />
            </View>
            <View style={styles.menuItemTextCol}>
              <Text style={styles.menuLabel}>Saved Doorstep Address</Text>
              <Text style={styles.menuSublabel}>#502, Orchid Residency, Koramangala</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#A0AEC0" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Payment Methods */}
          <TouchableOpacity
            style={styles.menuRowItem}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Payment Methods', 'UPI, Cards, and Cash on Visit are accepted for all doorstep services.')}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="card-outline" size={18} color="#059669" />
            </View>
            <View style={styles.menuItemTextCol}>
              <Text style={styles.menuLabel}>Payment Methods & Invoices</Text>
              <Text style={styles.menuSublabel}>UPI, Credit Cards, Cash on Visit</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#A0AEC0" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Notifications */}
          <TouchableOpacity
            style={styles.menuRowItem}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Notifications', 'SMS & WhatsApp appointment arrival notifications are active.')}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="notifications-outline" size={18} color="#475569" />
            </View>
            <View style={styles.menuItemTextCol}>
              <Text style={styles.menuLabel}>Visit Notifications & SMS</Text>
              <Text style={styles.menuSublabel}>Real-time dispatch and arrival updates</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#A0AEC0" />
          </TouchableOpacity>
        </View>

        {/* Group C: Support & Security */}
        <Text style={styles.menuGroupHeading}>SUPPORT & SECURITY</Text>
        <View style={styles.menuGroupCard}>
          <TouchableOpacity
            style={styles.menuRowItem}
            activeOpacity={0.7}
            onPress={handleCallSupport}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#EAF5EE' }]}>
              <Ionicons name="headset-outline" size={18} color={Palette.primary} />
            </View>
            <View style={styles.menuItemTextCol}>
              <Text style={styles.menuLabel}>24/7 Clinical Care Helpdesk</Text>
              <Text style={styles.menuSublabel}>Instant helpline +91 80 4910 8800</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#A0AEC0" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuRowItem}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Privacy & Security', 'Your health data is 100% encrypted and compliant with medical privacy standards.')}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#334155" />
            </View>
            <View style={styles.menuItemTextCol}>
              <Text style={styles.menuLabel}>Medical Privacy & Terms</Text>
              <Text style={styles.menuSublabel}>End-to-end encrypted clinical health records</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#A0AEC0" />
          </TouchableOpacity>
        </View>

        {/* ============================================================ */}
        {/* 5. SOLID RED PROPER LOGOUT BUTTON                           */}
        {/* ============================================================ */}
        <TouchableOpacity
          style={styles.signOutButton}
          activeOpacity={0.85}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.signOutButtonText}>Sign Out Account</Text>
        </TouchableOpacity>

        <Text style={styles.appVersionText}>Velora Health • Version 1.2.4 (Build 842)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /* Ambient Wellness Background Glows */
  ambientGlowTopRight: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(15, 91, 67, 0.08)',
  },
  ambientGlowMidLeft: {
    position: 'absolute',
    top: 340,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
  },
  ambientGlowBottomRight: {
    position: 'absolute',
    bottom: 80,
    right: -70,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(167, 243, 208, 0.16)',
  },

  safeArea: {
    flex: 1,
    backgroundColor: Palette.bgWarm,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 14 : 8,
    paddingBottom: 110,
  },

  /* 1. Top Brand Header */
  topBrandBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    marginBottom: 14,
  },
  brandContainer: {
    justifyContent: 'center',
  },
  brandLogo: {
    width: 124,
    height: 34,
  },
  topActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Palette.surface,
    borderWidth: 1.2,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Shadows.subtle,
  },
  bellBadgeDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Palette.badgeDot,
  },
  plusBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Palette.mint,
    borderWidth: 1.2,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },

  /* 2. Illustrated Health Pass Card */
  healthCard: {
    backgroundColor: Palette.primary,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    ...Shadows.card,
  },
  cardWatermarkSvg: {
    position: 'absolute',
    right: -25,
    bottom: -25,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardPriorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  cardPriorityText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardMemberId: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '600',
    color: '#A7F3D0',
    letterSpacing: 0.5,
  },
  cardPatientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  patientAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: '#A7F3D0',
  },
  avatarVerifiedBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Palette.primary,
  },
  patientDetailsCol: {
    flex: 1,
  },
  patientName: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  patientEmail: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '400',
    color: '#D1E7DD',
    marginBottom: 3,
  },
  patientMeta: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '500',
    color: '#A7F3D0',
  },
  clinicalChipsRow: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 12,
  },
  clinicalChip: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  clinicalChipLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 9.5,
    fontWeight: '500',
    color: '#A7F3D0',
    marginBottom: 1,
  },
  clinicalChipValue: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* 3. Illustrated Care Concierge Banner */
  careConciergeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: Palette.border,
    padding: 14,
    marginBottom: 20,
    ...Shadows.subtle,
  },
  conciergeIllustration: {
    width: 82,
    height: 82,
    marginRight: 12,
  },
  conciergeTextCol: {
    flex: 1,
  },
  conciergeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  conciergeTagText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primary,
  },
  conciergeTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  conciergeSubtitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '400',
    color: '#64748B',
    lineHeight: 15,
    marginBottom: 8,
  },
  conciergeCallBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  conciergeCallBtnText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* 4. Menu Groups */
  menuGroupHeading: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.6,
    marginBottom: 8,
    marginTop: 2,
    paddingLeft: 4,
  },
  menuGroupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
    paddingHorizontal: 14,
    marginBottom: 18,
    ...Shadows.subtle,
  },
  menuRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemTextCol: {
    flex: 1,
  },
  menuLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 1,
  },
  menuSublabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '400',
    color: '#64748B',
  },
  menuBadgePill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginRight: 6,
  },
  menuBadgePillText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 10.5,
    fontWeight: '700',
    color: '#15803D',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 48,
  },

  /* 5. Darker Reddish Rounded Logout Button */
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#991B1B',
    borderRadius: 26,
    paddingVertical: 14,
    paddingHorizontal: 22,
    marginTop: 10,
    marginBottom: 16,
    shadowColor: '#450A0A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  signOutButtonText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  appVersionText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 8,
  },
});
