import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { Typography, Shadows } from '../../constants/theme';

const Palette = {
  primary: '#0F5B43',        // Primary forest green
  primaryLight: '#EAF5EE',   // Soft mint accent
  primaryDark: '#083B2B',    // Dark forest green
  mint: '#EAF5EE',           // Soft mint accent
  bgWarm: '#FBFAF7',         // Warm ivory page background
  surface: '#FFFFFF',        // Card white
  textDark: '#1B2A24',       // Primary text
  textMuted: '#6B7E75',      // Secondary text
  border: '#DCE9E1',         // Clean border
  badgeDot: '#E53E3E',       // Red notification dot
};

export interface ServiceCategoryCard {
  id: string;
  title: string;
  subtitle: string;
  bgImage: any;
  badgeIcon: keyof typeof Ionicons.glyphMap;
  route: string;
}

export const FOUR_CORE_SERVICES: ServiceCategoryCard[] = [
  {
    id: 'doctor-visit',
    title: 'Doctor Visit',
    subtitle: 'Consult a verified doctor at home.',
    bgImage: require('../../../assets/images/doorstep-1.png'),
    badgeIcon: 'home',
    route: '/services/doctor-visit', // Opens All Doctors Page
  },
  {
    id: 'nursing-care',
    title: 'Nursing Care',
    subtitle: 'Post-op, IV & injection care.',
    bgImage: require('../../../assets/images/nurse-elder-care.png'),
    badgeIcon: 'heart',
    route: '/services/nursing-care', // Opens All Nurses Page
  },
  {
    id: 'caretakers',
    title: 'Attendant Care',
    subtitle: 'Elderly support & daily assistance.',
    bgImage: require('../../../assets/images/doorstep-3.png'),
    badgeIcon: 'people',
    route: '/services/caretakers', // Opens All Caregivers Page
  },
  {
    id: 'lab-investigation',
    title: 'Home Lab Tests',
    subtitle: 'Blood tests & basic diagnostics.',
    bgImage: require('../../../assets/images/doorstep-2.png'),
    badgeIcon: 'flask',
    route: '/services/home-lab', // Opens All Lab Tests Page
  },
];

export default function ServicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return FOUR_CORE_SERVICES;
    const q = searchQuery.toLowerCase();
    return FOUR_CORE_SERVICES.filter(
      (svc) =>
        svc.title.toLowerCase().includes(q) ||
        svc.subtitle.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      {/* Ambient Background Glow Orbs */}
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
        {/* 2. HERO SECTION: "Our Services" + HOUSE ILLUSTRATION         */}
        {/* ============================================================ */}
        <View style={styles.heroSection}>
          <View style={styles.heroTextCol}>
            <Text style={styles.heroTitle}>Our Services</Text>
            <Text style={styles.heroSubtitle}>
              Professional at-home care{'\n'}designed for you and your family.
            </Text>
          </View>

          <View style={styles.heroImageContainer}>
            <Image
              source={require('../../../assets/images/home-garden.png')}
              style={styles.heroHouseImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* ============================================================ */}
        {/* 3. SEARCH SERVICES BAR                                       */}
        {/* ============================================================ */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={19} color={Palette.textMuted} style={styles.searchIcon} />
          <TextInput
            placeholder="Search services (e.g. doctor, nurse, lab)..."
            placeholderTextColor={Palette.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            style={styles.searchInput}
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{ marginRight: 4 }}
            >
              <Ionicons name="close-circle" size={18} color={Palette.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* ============================================================ */}
        {/* 4. EXACT 4 MINIMAL, CLEAN CARDS (2 ROWS x 2 CARDS)           */}
        {/* ============================================================ */}
        <View style={styles.servicesGrid}>
          {filteredServices.map((svc) => (
            <TouchableOpacity
              key={svc.id}
              style={styles.gridCard}
              activeOpacity={0.88}
              onPress={() => router.push(svc.route as any)}
            >
              {/* Layer 1: Photographic Background Image */}
              <Image
                source={svc.bgImage}
                style={styles.gridCardBgImage}
                resizeMode="cover"
              />

              {/* Layer 2: Seamless Deep Scrim Gradient */}
              <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Defs>
                  <LinearGradient id={`scrim-${svc.id}`} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#000000" stopOpacity="0.04" />
                    <Stop offset="38%" stopColor="#0B2B20" stopOpacity="0.32" />
                    <Stop offset="68%" stopColor="#072018" stopOpacity="0.82" />
                    <Stop offset="100%" stopColor="#04140F" stopOpacity="0.96" />
                  </LinearGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" fill={`url(#scrim-${svc.id})`} />
              </Svg>

              {/* Layer 3: Minimal, Clean Elements Above Image */}
              <View style={styles.gridCardContent}>
                {/* Top-Left Doorstep Care Floating Pill */}
                <View style={styles.gridTagBadge}>
                  <Ionicons name={svc.badgeIcon} size={13} color="#0F5B43" style={{ marginRight: 4 }} />
                  <Text style={styles.gridTagText}>Doorstep Care</Text>
                </View>

                {/* Bottom Title, Subtitle & Explore Circle Button */}
                <View style={styles.gridCardBottomInfo}>
                  <Text style={styles.gridCardHeading}>{svc.title}</Text>
                  <Text style={styles.gridCardSubtitle} numberOfLines={2}>
                    {svc.subtitle}
                  </Text>

                  <View style={styles.gridCardActionRow}>
                    <Text style={styles.gridCardActionText}>Explore</Text>
                    <View style={styles.gridExploreCircle}>
                      <Ionicons name="arrow-forward" size={14} color="#0F5B43" />
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Help Banner at the bottom */}
        <View style={styles.consultBanner}>
          <View style={styles.consultBannerIcon}>
            <Ionicons name="headset-outline" size={22} color={Palette.primary} />
          </View>
          <View style={styles.consultBannerTextCol}>
            <Text style={styles.consultBannerTitle}>Need clinical advice on what to book?</Text>
            <Text style={styles.consultBannerSubtitle}>
              Speak directly to our medical coordinator for a customized doorstep care plan.
            </Text>
          </View>
        </View>
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
    marginBottom: 8,
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

  /* 2. Hero Section */
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  heroTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  heroTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 24,
    fontWeight: '600',
    color: Palette.primary,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    fontWeight: '400',
    color: Palette.textMuted,
    lineHeight: 17,
  },
  heroImageContainer: {
    width: 140,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroHouseImage: {
    width: 135,
    height: 96,
  },

  /* 3. Search Bar */
  searchBar: {
    height: 48,
    borderRadius: 24,
    backgroundColor: Palette.surface,
    borderWidth: 1.2,
    borderColor: Palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 16,
    ...Shadows.subtle,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    color: Palette.textDark,
    height: '100%',
    fontWeight: '400',
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none', borderWidth: 0 } as any) : {}),
  },

  /* 4. 2x2 Clean Minimal Services Grid - Exact Design from Reference */
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
    marginBottom: 20,
  },
  gridCard: {
    width: '48.2%',
    height: 222,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#0F5B43',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  gridCardBgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  gridCardContent: {
    position: 'relative',
    flex: 1,
    padding: 13,
    justifyContent: 'space-between',
  },
  gridTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  gridTagText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0F5B43',
  },
  gridCardBottomInfo: {
    paddingBottom: 2,
  },
  gridCardHeading: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  gridCardSubtitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '400',
    color: '#E2E8F0',
    lineHeight: 15,
    marginBottom: 10,
  },
  gridCardActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridCardActionText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    fontWeight: '600',
    color: '#C7EADB',
  },
  gridExploreCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#C7EADB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Bottom Help Banner */
  consultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF5EE',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#D4EADE',
    padding: 14,
    marginBottom: 16,
    gap: 12,
  },
  consultBannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  consultBannerTextCol: {
    flex: 1,
  },
  consultBannerTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    fontWeight: '700',
    color: Palette.primary,
    marginBottom: 2,
  },
  consultBannerSubtitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '400',
    color: '#4B6B5C',
    lineHeight: 15,
  },
});
