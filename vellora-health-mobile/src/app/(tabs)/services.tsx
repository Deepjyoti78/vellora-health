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
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { Typography, Shadows } from '../../constants/theme';
import { REGIONAL_CONFIG } from '../../data/mockData';

const Palette = {
  primary: '#0F5B43',        // Primary forest green
  primaryLight: '#EAF5EE',   // Soft mint accent
  primaryDark: '#083B2B',    // Dark forest green
  mint: '#EAF5EE',           // Soft mint accent
  mintCard: '#E4F3E8',       // Banner card background
  bgWarm: '#FBFAF7',         // Warm ivory page background
  surface: '#FFFFFF',        // Card white
  textDark: '#1B2A24',       // Primary text
  textMuted: '#6B7E75',      // Secondary text
  border: '#DCE9E1',         // Clean border
  badgeDot: '#E53E3E',       // Red notification dot
  amberBadge: '#FEF3C7',     // Amber pill background
  amberText: '#D97706',      // Amber text
};

/**
 * Welcoming Doctor Illustration for Bottom Assistance Card
 * Exactly reproduced from Reference Image (holding clipboard, gesturing right)
 */
function AssistanceDoctorIllustration({ width = 90, height = 90 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 100 100" fill="none">
      {/* Background Soft Botanical Leaves */}
      <Path
        d="M20 75C12 50 25 25 50 18C52 44 40 68 20 75Z"
        fill="#A3D4B6"
        opacity={0.7}
      />
      <Path
        d="M10 65C6 45 18 28 38 24C40 45 30 62 10 65Z"
        fill="#C3DFCF"
        opacity={0.8}
      />

      {/* Hair Bun / Ponytail */}
      <Circle cx="70" cy="38" r="11" fill="#4B3224" />
      <Path d="M68 40C72 48 74 55 70 60C68 58 66 50 66 45Z" fill="#3F2A1E" />

      {/* Body / Torso (White Lab Coat) */}
      <Path d="M30 100C30 82 40 76 52 76C64 76 72 82 72 100H30Z" fill="#FFFFFF" />
      <Path d="M46 76H58L54 90H50L46 76Z" fill="#2A7A5E" />
      <Path d="M36 78L48 90L44 100H31L36 78Z" fill="#F3F7F5" />
      <Path d="M68 78L56 90L60 100H73L68 78Z" fill="#EDF3F0" />

      {/* Green Clipboard in Right Hand */}
      <Rect
        x="24"
        y="75"
        width="18"
        height="24"
        rx="3"
        fill="#26413A"
        transform="rotate(-10 24 75)"
      />
      <Rect
        x="26"
        y="77"
        width="14"
        height="20"
        rx="2"
        fill="#2A7A5E"
        transform="rotate(-10 26 77)"
      />
      {/* Hand holding clipboard */}
      <Circle cx="35" cy="88" r="3.5" fill="#F8CFAF" />

      {/* Left Arm Gesturing Outward */}
      <Path
        d="M66 82C74 80 82 75 90 70C92 73 90 77 82 82C76 86 70 86 66 84"
        fill="#FFFFFF"
      />
      {/* Left Hand open in friendly presentation */}
      <Path
        d="M89 69C93 66 96 68 98 71C96 73 93 75 89 73Z"
        fill="#F8CFAF"
      />

      {/* Neck */}
      <Rect x="48" y="66" width="8" height="12" rx="2" fill="#F4C6A4" />

      {/* Head & Face */}
      <Circle cx="52" cy="50" r="13" fill="#F8CFAF" />

      {/* Hair Front */}
      <Path
        d="M39 48C39 39 45 32 53 32C61 32 66 37 66 45C62 41 57 39 52 39C46 39 42 42 39 48Z"
        fill="#4B3224"
      />
      {/* Face details */}
      <Circle cx="47" cy="50" r="1.3" fill="#2E1F16" />
      <Circle cx="56" cy="50" r="1.3" fill="#2E1F16" />
      <Path d="M45.5 47C47 46 48.5 46 49.5 47" stroke="#3F2A1E" strokeWidth="0.8" strokeLinecap="round" />
      <Path d="M53.5 47C54.5 46 56 46 57.5 47" stroke="#3F2A1E" strokeWidth="0.8" strokeLinecap="round" />
      <Path d="M50 56C51 57.5 53 57.5 54 56" stroke="#C86A58" strokeWidth="1.1" strokeLinecap="round" />
      <Circle cx="44" cy="53" r="1.6" fill="#F6A89B" opacity={0.5} />
      <Circle cx="59" cy="53" r="1.6" fill="#F6A89B" opacity={0.5} />

      {/* Stethoscope */}
      <Path
        d="M44 76C43 82 46 88 52 88C58 88 61 82 60 76"
        stroke="#314B42"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <Circle cx="52" cy="89" r="2.5" fill="#99B8AC" stroke="#234036" strokeWidth="0.8" />
    </Svg>
  );
}

type ServiceCategoryFilter = 'ALL' | 'DOCTOR' | 'NURSING' | 'CARE' | 'LAB';

const CORE_SERVICES = [
  {
    id: 'doctor-consultation',
    category: 'DOCTOR',
    title: 'Home Visit\nDoctor Consultation',
    tag: '⚡ 45m Dispatch',
    rating: '4.9 (1.2k)',
    price: 'From ₹850',
    subtitle: 'Bedside diagnosis & e-Rx',
    route: '/services/doctor-visit',
    image: require('../../../assets/images/service-doctor.png'),
    badgeIcon: 'flash',
  },
  {
    id: 'nursing-care',
    category: 'NURSING',
    title: 'Home Nursing Care',
    tag: 'Registered RN',
    rating: '4.8 (890)',
    price: 'From ₹1,200',
    subtitle: 'Post-op, IV & vitals care',
    route: '/services/nursing-care',
    image: require('../../../assets/images/service-nurse.png'),
    badgeIcon: 'heart',
  },
  {
    id: 'caretakers',
    category: 'CARE',
    title: 'Patient Care,\nCaregiver & Medical Maid',
    tag: '12h / 24h Shifts',
    rating: '4.9 (640)',
    price: 'From ₹800',
    subtitle: 'Elderly mobility & daily care',
    route: '/services/caretakers',
    image: require('../../../assets/images/service-caretaker.png'),
    badgeIcon: 'people',
  },
  {
    id: 'lab-investigation',
    category: 'LAB',
    title: 'Home Lab\nInvestigation',
    tag: 'Results in 12h',
    rating: '5.0 (2.1k)',
    price: 'From ₹650',
    subtitle: 'Sterile doorstep blood draw',
    route: '/services/home-lab',
    image: require('../../../assets/images/service-lab.png'),
    badgeIcon: 'flask',
  },
];

const CATEGORY_CHIPS: { id: ServiceCategoryFilter; label: string; icon: any }[] = [
  { id: 'ALL', label: 'All Services', icon: 'grid-outline' },
  { id: 'DOCTOR', label: 'Doctor Visit', icon: 'medkit-outline' },
  { id: 'NURSING', label: 'Nursing Care', icon: 'heart-outline' },
  { id: 'CARE', label: 'Attendant Care', icon: 'people-outline' },
  { id: 'LAB', label: 'Lab Tests', icon: 'flask-outline' },
];

export default function ServicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryFilter>('ALL');

  const filteredServices = useMemo(() => {
    return CORE_SERVICES.filter((svc) => {
      // Category filter
      if (selectedCategory !== 'ALL' && svc.category !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        svc.title.toLowerCase().includes(q) ||
        svc.subtitle.toLowerCase().includes(q) ||
        svc.tag.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  const handleServiceSelect = (svc: typeof CORE_SERVICES[0]) => {
    if (svc.id === 'lab-investigation') {
      router.push('/services/home-lab' as any);
    } else if (svc.id === 'nursing-care') {
      router.push('/services/nursing-care' as any);
    } else if (svc.id === 'caretakers') {
      router.push('/services/caretakers' as any);
    } else {
      router.push('/services/doctor-visit' as any);
    }
  };

  const handleGetAssistance = () => {
    Alert.alert(
      'Vellora Care Team Concierge',
      'Need help choosing the right home healthcare service for yourself or a family member?\n\nOur medical care coordinator is on call 24/7.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Coordinator (+91 80 4910 8800)',
          onPress: () => Linking.openURL(`tel:${REGIONAL_CONFIG.supportPhone}`),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

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
              onPress={() => router.push('/services/doctor-visit' as any)}
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
        {/* 3. SEARCH SERVICES BAR WITH SLIDERS FILTER                   */}
        {/* ============================================================ */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={19} color={Palette.textMuted} style={styles.searchIcon} />
          <TextInput
            placeholder="Search services (e.g. doctor, nurse, blood)..."
            placeholderTextColor={Palette.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            style={styles.searchInput}
          />

          {searchQuery.length > 0 ? (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{ marginRight: 8 }}
            >
              <Ionicons name="close-circle" size={18} color={Palette.textMuted} />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.filterBtn}
            activeOpacity={0.75}
            onPress={() => {
              // Cycle through categories
              const order: ServiceCategoryFilter[] = ['ALL', 'DOCTOR', 'NURSING', 'CARE', 'LAB'];
              const nextIndex = (order.indexOf(selectedCategory) + 1) % order.length;
              setSelectedCategory(order[nextIndex]);
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="options-outline" size={18} color={Palette.primary} />
          </TouchableOpacity>
        </View>

        {/* ============================================================ */}
        {/* 4. HORIZONTAL CATEGORY FILTER CHIPS                          */}
        {/* ============================================================ */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryChipsScroll}
        >
          {CATEGORY_CHIPS.map((chip) => {
            const isActive = selectedCategory === chip.id;
            return (
              <TouchableOpacity
                key={chip.id}
                style={[
                  styles.categoryChip,
                  isActive && styles.categoryChipActive,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(chip.id)}
              >
                <Ionicons
                  name={chip.icon}
                  size={14}
                  color={isActive ? '#FFFFFF' : Palette.textDark}
                  style={{ marginRight: 5 }}
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    isActive && styles.categoryChipTextActive,
                  ]}
                >
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ============================================================ */}
        {/* 5. 2x2 GRID OF 4 CORE AT-HOME SERVICES                       */}
        {/* ============================================================ */}
        <View style={styles.servicesGrid}>
          {filteredServices.length === 0 ? (
            <View style={styles.noResultsCard}>
              <Ionicons name="search-outline" size={32} color={Palette.primary} style={{ marginBottom: 8 }} />
              <Text style={styles.noResultsTitle}>No services found</Text>
              <Text style={styles.noResultsSubtitle}>
                No home care services match "{searchQuery}". Try searching for doctor, nurse, or lab test.
              </Text>
              <TouchableOpacity
                style={styles.resetFilterBtn}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
              >
                <Text style={styles.resetFilterText}>View All Services</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredServices.map((svc) => (
              <TouchableOpacity
                key={svc.id}
                style={styles.serviceGridCard}
                activeOpacity={0.88}
                onPress={() => handleServiceSelect(svc)}
              >
                {/* Top Badge: Rating / Quick Tag */}
                <View style={styles.cardTopBadgeRow}>
                  <View style={styles.cardTagPill}>
                    <Text style={styles.cardTagPillText}>{svc.tag}</Text>
                  </View>
                  <View style={styles.cardRatingPill}>
                    <Ionicons name="star" size={10} color="#D97706" style={{ marginRight: 2 }} />
                    <Text style={styles.cardRatingText}>{svc.rating.split(' ')[0]}</Text>
                  </View>
                </View>

                {/* Centered Medical Character Illustration with Soft Vignette */}
                <View style={styles.illustrationCircle}>
                  <View style={styles.avatarVignette}>
                    <Image
                      source={svc.image}
                      style={styles.serviceCardImage}
                      resizeMode="cover"
                    />
                  </View>
                </View>

                {/* Service Title */}
                <Text style={styles.serviceCardTitle} numberOfLines={2}>
                  {svc.title}
                </Text>

                {/* 1-Line Key Feature */}
                <Text style={styles.serviceCardSubtitle} numberOfLines={1}>
                  {svc.subtitle}
                </Text>

                {/* Bottom Row: Transparent Price on Left + Green Chevron on Right */}
                <View style={styles.serviceBottomRow}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.pricePrefixText}>Starting</Text>
                    <Text style={styles.priceValueText}>{svc.price.replace('From ', '')}</Text>
                  </View>

                  <View style={styles.chevronCircleBtn}>
                    <Ionicons name="chevron-forward" size={14} color={Palette.primary} />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* ============================================================ */}
        {/* 6. NEED HELP CHOOSING A SERVICE? ASSISTANCE BANNER           */}
        {/* ============================================================ */}
        <View style={styles.assistanceBanner}>
          {/* Left Doctor Illustration */}
          <View style={styles.assistanceDoctorBox}>
            <AssistanceDoctorIllustration width={88} height={88} />
          </View>

          {/* Right Content */}
          <View style={styles.assistanceTextCol}>
            <Text style={styles.assistanceHeading}>Need help choosing a service?</Text>
            <Text style={styles.assistanceSubtitle}>
              Talk to our care team and get{'\n'}a personalized recommendation.
            </Text>

            <TouchableOpacity
              style={styles.getAssistanceBtn}
              activeOpacity={0.88}
              onPress={handleGetAssistance}
            >
              <Text style={styles.getAssistanceText}>Get Assistance →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 7. WHY VELLORA HOME CARE? TRUST GUARANTEE BANNER             */}
        {/* ============================================================ */}
        <View style={styles.trustBannerCard}>
          <Text style={styles.trustBannerTitle}>Why Patients Trust Vellora</Text>
          <View style={styles.trustFeaturesRow}>
            <View style={styles.trustFeatureItem}>
              <View style={styles.trustIconCircle}>
                <Ionicons name="shield-checkmark" size={16} color={Palette.primary} />
              </View>
              <Text style={styles.trustFeatureText}>Verified Doctors</Text>
            </View>

            <View style={styles.trustFeatureDivider} />

            <View style={styles.trustFeatureItem}>
              <View style={styles.trustIconCircle}>
                <Ionicons name="flash" size={16} color={Palette.primary} />
              </View>
              <Text style={styles.trustFeatureText}>45-Min Dispatch</Text>
            </View>

            <View style={styles.trustFeatureDivider} />

            <View style={styles.trustFeatureItem}>
              <View style={styles.trustIconCircle}>
                <Ionicons name="key" size={16} color={Palette.primary} />
              </View>
              <Text style={styles.trustFeatureText}>Bedside PIN Safe</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 12,
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
  filterBtn: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: Palette.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* 4. Horizontal Category Chips */
  categoryChipsScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 14,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: Palette.surface,
    borderWidth: 1.2,
    borderColor: Palette.border,
  },
  categoryChipActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  categoryChipText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '500',
    color: Palette.textDark,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  /* 5. 2x2 Services Grid */
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  serviceGridCard: {
    width: '48.2%',
    backgroundColor: Palette.surface,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: Palette.border,
    padding: 12,
    justifyContent: 'space-between',
    ...Shadows.subtle,
  },
  cardTopBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardTagPill: {
    backgroundColor: Palette.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  cardTagPillText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 9.5,
    fontWeight: '600',
    color: Palette.primary,
  },
  cardRatingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cardRatingText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 10,
    fontWeight: '600',
    color: '#D97706',
  },
  illustrationCircle: {
    width: '100%',
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarVignette: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EAF5EE',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D8ECE0',
  },
  serviceCardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  serviceCardTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textDark,
    letterSpacing: -0.15,
    lineHeight: 17,
    marginBottom: 2,
  },
  serviceCardSubtitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 10.5,
    fontWeight: '400',
    color: Palette.textMuted,
    marginBottom: 8,
  },
  serviceBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F0F4F2',
  },
  priceContainer: {
    justifyContent: 'center',
  },
  pricePrefixText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 9.5,
    color: Palette.textMuted,
    fontWeight: '400',
  },
  priceValueText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    fontWeight: '600',
    color: Palette.primary,
  },
  chevronCircleBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Empty State */
  noResultsCard: {
    width: '100%',
    backgroundColor: Palette.surface,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: Palette.border,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 15,
    fontWeight: '600',
    color: Palette.textDark,
    marginBottom: 4,
  },
  noResultsSubtitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    color: Palette.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 12,
  },
  resetFilterBtn: {
    backgroundColor: Palette.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
  },
  resetFilterText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '600',
    color: Palette.primary,
  },

  /* 6. Assistance Banner */
  assistanceBanner: {
    borderRadius: 22,
    backgroundColor: Palette.mintCard,
    borderWidth: 1.2,
    borderColor: '#D4E7DC',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 14,
    ...Shadows.subtle,
  },
  assistanceDoctorBox: {
    width: 84,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  assistanceTextCol: {
    flex: 1,
  },
  assistanceHeading: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13.5,
    fontWeight: '600',
    color: Palette.primary,
    letterSpacing: -0.15,
    marginBottom: 2,
  },
  assistanceSubtitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '400',
    color: '#4B6358',
    lineHeight: 15,
    marginBottom: 8,
  },
  getAssistanceBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Palette.primary,
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  getAssistanceText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.1,
  },

  /* 7. Trust Banner */
  trustBannerCard: {
    backgroundColor: Palette.surface,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: Palette.border,
    padding: 14,
    ...Shadows.subtle,
  },
  trustBannerTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '600',
    color: Palette.primary,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.1,
  },
  trustFeaturesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trustFeatureItem: {
    flex: 1,
    alignItems: 'center',
  },
  trustIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  trustFeatureText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 10.5,
    fontWeight: '600',
    color: Palette.textDark,
    textAlign: 'center',
  },
  trustFeatureDivider: {
    width: 1,
    height: 24,
    backgroundColor: Palette.border,
  },
});
