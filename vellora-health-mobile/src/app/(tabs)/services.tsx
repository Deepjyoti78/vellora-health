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
import { Typography, Shadows } from '../../constants/theme';

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
  amberText: '#B45309',      // Amber text
  greenBadge: '#ECFDF5',     // Light emerald pill
  greenText: '#047857',      // Emerald text
};

export type ServiceCategoryFilter = 'ALL' | 'DOCTOR' | 'NURSING' | 'CARE' | 'LAB';

export interface ServiceDetailItem {
  id: string;
  category: ServiceCategoryFilter;
  title: string;
  shortTitle: string;
  tag: string;
  rating: string;
  ratingCount: string;
  price: string;
  pricePeriod?: string;
  description: string;
  route: string;
  image: any;
  badgeIcon: keyof typeof Ionicons.glyphMap;
  highlights: string[];
  clinicianType: string;
}

export const FOUR_CORE_SERVICES: ServiceDetailItem[] = [
  {
    id: 'doctor-consultation',
    category: 'DOCTOR',
    title: 'Doctor Home Visit Consultation',
    shortTitle: 'Doctor Visit',
    tag: '⚡ 45m Doorstep Dispatch',
    rating: '4.9',
    ratingCount: '1.2k+ reviews',
    price: '₹850',
    pricePeriod: 'per consultation',
    description:
      'Expert general physicians and specialists arrive at your doorstep equipped with complete diagnostic kits for bedside clinical care.',
    route: '/services/doctor-visit',
    image: require('../../../assets/images/service-doctor.png'),
    badgeIcon: 'flash',
    clinicianType: 'MD / MBBS General Physician',
    highlights: [
      'Physical checkup, vitals, bedside ECG & blood sugar',
      'Instant digital prescription with medicine schedule',
      'Doorstep medical kit & sterile diagnostics included',
      'Free 3-day digital chat follow-up with your doctor',
    ],
  },
  {
    id: 'nursing-care',
    category: 'NURSING',
    title: 'Specialized Home Nursing Care',
    shortTitle: 'Nursing Care',
    tag: 'Verified Registered RN',
    rating: '4.8',
    ratingCount: '890+ reviews',
    price: '₹1,200',
    pricePeriod: 'per visit',
    description:
      'Certified, experienced registered nurses for skilled bedside clinical procedures, surgical post-operative care, and continuous recovery.',
    route: '/services/nursing-care',
    image: require('../../../assets/images/service-nurse.png'),
    badgeIcon: 'heart',
    clinicianType: 'Registered B.Sc / GNM Nurse',
    highlights: [
      'IV infusion, IV/IM injections & cannula care',
      'Sterile post-op wound dressing & stitch removal',
      'Urinary catheterization & Ryle’s tube management',
      'Continuous vitals charting & clinical recovery monitoring',
    ],
  },
  {
    id: 'caretakers',
    category: 'CARE',
    title: 'Patient Caregiver & Attendant',
    shortTitle: 'Attendant Care',
    tag: '12h / 24h Dedicated Shifts',
    rating: '4.9',
    ratingCount: '640+ reviews',
    price: '₹800',
    pricePeriod: 'per 12h shift',
    description:
      'Compassionate, background-verified male and female care attendants for elderly support, bedridden patient assistance, and daily mobility.',
    route: '/services/caretakers',
    image: require('../../../assets/images/service-caretaker.png'),
    badgeIcon: 'people',
    clinicianType: 'Trained & Police-Verified Attendant',
    highlights: [
      'Mobility, walking support, wheelchair & bed transfers',
      'Bathing, personal sponge hygiene & diaper changing',
      'Timely medication administration & feeding support',
      '24/7 bedside companionship and emergency vigilance',
    ],
  },
  {
    id: 'lab-investigation',
    category: 'LAB',
    title: 'Home Lab & Diagnostic Tests',
    shortTitle: 'Lab Tests',
    tag: 'Digital Report in 6–12h',
    rating: '5.0',
    ratingCount: '2.1k+ reviews',
    price: '₹650',
    pricePeriod: 'starting package',
    description:
      'Certified phlebotomists collect blood and pathology samples at home using 100% sterile vacuum tubes with cold-chain transport to NABL labs.',
    route: '/services/home-lab',
    image: require('../../../assets/images/service-lab.png'),
    badgeIcon: 'flask',
    clinicianType: 'Certified Phlebotomist & NABL Lab',
    highlights: [
      '100% painless vacuum-sealed sterile blood draw',
      'CBC, Diabetes, Lipid, Thyroid & 60+ health parameters',
      'Temperature-controlled cold-chain sample logistics',
      'WhatsApp & App smart report + free doctor review',
    ],
  },
];

const CATEGORY_CHIPS: { id: ServiceCategoryFilter; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
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
    return FOUR_CORE_SERVICES.filter((svc) => {
      // Category filter
      if (selectedCategory !== 'ALL' && svc.category !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        svc.title.toLowerCase().includes(q) ||
        svc.description.toLowerCase().includes(q) ||
        svc.clinicianType.toLowerCase().includes(q) ||
        svc.tag.toLowerCase().includes(q) ||
        svc.highlights.some((h) => h.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory]);

  const handleServiceSelect = (svc: ServiceDetailItem) => {
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
            accessibilityLabel="Filter categories"
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
        {/* 5. 4 COMPREHENSIVE SERVICE CARDS WITH FULL DETAILS           */}
        {/* ============================================================ */}
        <View style={styles.servicesListContainer}>
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
                style={styles.serviceDetailCard}
                activeOpacity={0.92}
                onPress={() => handleServiceSelect(svc)}
              >
                {/* Header Row: Avatar + Title + Badges */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.cardAvatarWrapper}>
                    <Image source={svc.image} style={styles.cardAvatarImage} resizeMode="cover" />
                    <View style={styles.cardBadgeDot} />
                  </View>

                  <View style={styles.cardHeaderInfoCol}>
                    {/* Badges Row */}
                    <View style={styles.cardBadgesRow}>
                      <View style={styles.cardTagPill}>
                        <Text style={styles.cardTagPillText}>{svc.tag}</Text>
                      </View>
                      <View style={styles.cardRatingPill}>
                        <Ionicons name="star" size={10} color="#D97706" style={{ marginRight: 3 }} />
                        <Text style={styles.cardRatingText}>{svc.rating}</Text>
                        <Text style={styles.cardRatingCount}>({svc.ratingCount})</Text>
                      </View>
                    </View>

                    <Text style={styles.cardTitleText}>{svc.title}</Text>
                    <View style={styles.cardClinicianTypeRow}>
                      <Ionicons name="shield-checkmark" size={12} color={Palette.primary} style={{ marginRight: 4 }} />
                      <Text style={styles.cardClinicianTypeText}>{svc.clinicianType}</Text>
                    </View>
                  </View>
                </View>

                {/* Summary Description */}
                <Text style={styles.cardDescriptionText}>{svc.description}</Text>

                {/* What's Included Box */}
                <View style={styles.cardHighlightsBox}>
                  <Text style={styles.cardHighlightsTitle}>WHAT’S INCLUDED</Text>
                  <View style={styles.cardHighlightsList}>
                    {svc.highlights.map((h, i) => (
                      <View key={i} style={styles.highlightRow}>
                        <View style={styles.checkIconCircle}>
                          <Ionicons name="checkmark" size={11} color={Palette.primary} />
                        </View>
                        <Text style={styles.highlightText}>{h}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Footer Row: Price + Book Visit CTA Button */}
                <View style={styles.cardFooterRow}>
                  <View style={styles.cardPriceCol}>
                    <Text style={styles.cardPriceLabel}>Starting at</Text>
                    <View style={styles.cardPriceValueRow}>
                      <Text style={styles.cardPriceValue}>{svc.price}</Text>
                      {svc.pricePeriod && (
                        <Text style={styles.cardPricePeriod}> {svc.pricePeriod}</Text>
                      )}
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.cardBookBtn}
                    activeOpacity={0.85}
                    onPress={() => handleServiceSelect(svc)}
                  >
                    <Text style={styles.cardBookBtnText}>Book Visit</Text>
                    <Ionicons name="arrow-forward" size={13} color="#FFFFFF" style={{ marginLeft: 5 }} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
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

  /* 5. 4 Full-Width Detailed Service Cards */
  servicesListContainer: {
    gap: 14,
    marginBottom: 16,
  },
  serviceDetailCard: {
    backgroundColor: Palette.surface,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: Palette.border,
    padding: 16,
    ...Shadows.subtle,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  cardAvatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Palette.mint,
    borderWidth: 1.5,
    borderColor: '#CDE5D7',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardAvatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  cardBadgeDot: {
    position: 'absolute',
    bottom: 2,
    right: 3,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  cardHeaderInfoCol: {
    flex: 1,
  },
  cardBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 5,
  },
  cardTagPill: {
    backgroundColor: Palette.mint,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: '#D4E7DC',
  },
  cardTagPillText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 10,
    fontWeight: '600',
    color: Palette.primary,
  },
  cardRatingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.amberBadge,
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  cardRatingText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 10,
    fontWeight: '700',
    color: Palette.amberText,
  },
  cardRatingCount: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 9.5,
    fontWeight: '400',
    color: '#92400E',
    marginLeft: 2,
  },
  cardTitleText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 15.5,
    fontWeight: '700',
    color: Palette.textDark,
    lineHeight: 20,
    marginBottom: 2,
  },
  cardClinicianTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardClinicianTypeText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '500',
    color: Palette.primary,
  },
  cardDescriptionText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    fontWeight: '400',
    color: '#4A5B53',
    lineHeight: 18,
    marginBottom: 12,
  },

  /* What's Included Box */
  cardHighlightsBox: {
    backgroundColor: '#F8FAF9',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6EFEA',
    padding: 12,
    marginBottom: 14,
  },
  cardHighlightsTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 10,
    fontWeight: '700',
    color: Palette.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  cardHighlightsList: {
    gap: 6,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkIconCircle: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: Palette.mint,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D0E7D9',
  },
  highlightText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '400',
    color: Palette.textDark,
    flex: 1,
    lineHeight: 16,
  },

  /* Footer: Pricing + Book CTA */
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F4F2',
  },
  cardPriceCol: {
    justifyContent: 'center',
  },
  cardPriceLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 10,
    fontWeight: '400',
    color: Palette.textMuted,
    marginBottom: 1,
  },
  cardPriceValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cardPriceValue: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 18,
    fontWeight: '700',
    color: Palette.primary,
  },
  cardPricePeriod: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '400',
    color: Palette.textMuted,
  },
  cardBookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 16,
    ...Shadows.subtle,
  },
  cardBookBtnText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#FFFFFF',
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
});
