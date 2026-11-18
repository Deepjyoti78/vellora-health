import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
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
};

export interface SubServiceItem {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  icon: keyof typeof Ionicons.glyphMap;
  tag?: string;
  route: string;
}

export interface ServiceCategoryCard {
  id: string;
  shortTitle: string;
  title: string;
  tag: string;
  rating: string;
  reviewCount: string;
  price: string;
  description: string;
  bgImage: any;
  badgeIcon: keyof typeof Ionicons.glyphMap;
  route: string;
  clinicianRole: string;
  subServices: SubServiceItem[];
}

export const FOUR_CORE_SERVICES: ServiceCategoryCard[] = [
  {
    id: 'doctor-visit',
    shortTitle: 'Doctor Visit',
    title: 'Doctor Home Consultation',
    tag: '⚡ 45m Dispatch',
    rating: '4.9',
    reviewCount: '1.2k+ visits',
    price: '₹850',
    description: 'Bedside diagnosis, physical exam & instant e-Rx at home.',
    bgImage: require('../../../assets/images/doorstep-1.png'),
    badgeIcon: 'medkit',
    route: '/services/doctor-visit',
    clinicianRole: 'MD / MBBS General Physicians & Specialists',
    subServices: [
      {
        id: 'doc-gen',
        name: 'General Physician Home Consultation',
        description: 'Complete physical examination, vitals check, bedside diagnosis & digital prescription.',
        price: '₹850',
        duration: '45 mins',
        icon: 'medkit-outline',
        tag: 'Most Popular',
        route: '/services/doctor-visit',
      },
      {
        id: 'doc-spec',
        name: 'Specialist Physician Consultation',
        description: 'Experienced Senior Cardiologist, Neurologist, or Orthopedist consultation at your doorstep.',
        price: '₹1,499',
        duration: '60 mins',
        icon: 'heart-outline',
        tag: 'Senior Specialist',
        route: '/services/doctor-visit',
      },
      {
        id: 'doc-geriatric',
        name: 'Geriatric Health & Senior Care Check',
        description: 'Comprehensive physical, cognitive, medication review and mobility evaluation for elderly patients.',
        price: '₹1,200',
        duration: '60 mins',
        icon: 'people-outline',
        tag: 'Elderly Care',
        route: '/services/doctor-visit',
      },
      {
        id: 'doc-postop',
        name: 'Post-Operative Surgical Follow-up',
        description: 'Surgical recovery review, incision healing check, drain inspection and medication updates.',
        price: '₹999',
        duration: '45 mins',
        icon: 'bandage-outline',
        tag: 'Surgical Care',
        route: '/services/doctor-visit',
      },
      {
        id: 'doc-urgent',
        name: 'Urgent Doorstep Triage Consultation',
        description: 'Priority rapid-response bedside medical consultation for acute fever, pain, or seasonal illness.',
        price: '₹1,250',
        duration: '35 mins',
        icon: 'flash-outline',
        tag: 'Priority Care',
        route: '/services/doctor-visit',
      },
    ],
  },
  {
    id: 'nursing-care',
    shortTitle: 'Nursing Care',
    title: 'Specialized Home Nursing Care',
    tag: 'Registered RN',
    rating: '4.8',
    reviewCount: '890+ visits',
    price: '₹1,200',
    description: 'Post-op wound care, IV infusion & bedside procedures.',
    bgImage: require('../../../assets/images/nurse-elder-care.png'),
    badgeIcon: 'heart',
    route: '/services/nursing-care',
    clinicianRole: 'Certified Registered B.Sc / GNM Nurses',
    subServices: [
      {
        id: 'nurse-iv',
        name: 'IV Infusion & Cannula Placement',
        description: 'Sterile IV cannula insertion, normal saline, multivitamin, or antibiotic infusion by certified nurse.',
        price: '₹600',
        duration: '45 mins',
        icon: 'water-outline',
        tag: 'Sterile Kit',
        route: '/services/nursing-care',
      },
      {
        id: 'nurse-wound',
        name: 'Sterile Wound Dressing & Stitch Removal',
        description: 'Aseptic post-surgical wound cleaning, dressing changes, and painless suture/staple removal.',
        price: '₹750',
        duration: '40 mins',
        icon: 'bandage-outline',
        tag: 'Post-Op Care',
        route: '/services/nursing-care',
      },
      {
        id: 'nurse-cath',
        name: 'Urinary Catheterization & Care',
        description: 'Aseptic Foley catheter insertion, replacement, bag change, and antiseptic bladder wash.',
        price: '₹950',
        duration: '45 mins',
        icon: 'fitness-outline',
        tag: 'Certified RN',
        route: '/services/nursing-care',
      },
      {
        id: 'nurse-ryles',
        name: 'Ryle’s Tube (NG Tube) Insertion & Feed',
        description: 'Nasogastric feeding tube insertion, fixation, and nutritional feeding guidance for patients.',
        price: '₹900',
        duration: '45 mins',
        icon: 'git-network-outline',
        tag: 'Bedside Care',
        route: '/services/nursing-care',
      },
      {
        id: 'nurse-12h',
        name: '12-Hour Critical Care Bedside Nurse',
        description: 'ICU-trained registered nurse for continuous vital charting, oxygen support, and active medication.',
        price: '₹2,400',
        duration: '12 hours',
        icon: 'time-outline',
        tag: 'Day / Night Shift',
        route: '/services/nursing-care',
      },
      {
        id: 'nurse-inject',
        name: 'At-Home Injections (IM / IV / SC)',
        description: 'Doorstep administration of doctor-prescribed intramuscular, intravenous, or subcutaneous injections.',
        price: '₹350',
        duration: '20 mins',
        icon: 'color-filter-outline',
        tag: 'Quick Visit',
        route: '/services/nursing-care',
      },
    ],
  },
  {
    id: 'caretakers',
    shortTitle: 'Attendant Care',
    title: 'Patient Caregiver & Attendant',
    tag: '12h / 24h Shifts',
    rating: '4.9',
    reviewCount: '640+ clients',
    price: '₹800',
    description: 'Elderly assistance, sponge bath & daily mobility support.',
    bgImage: require('../../../assets/images/doorstep-3.png'),
    badgeIcon: 'people',
    route: '/services/caretakers',
    clinicianRole: 'Verified & Background-Checked Caregivers',
    subServices: [
      {
        id: 'care-day',
        name: '12-Hour Day Shift Caregiver',
        description: 'Assistance with morning routines, bathing, feeding, mobility, and medication reminders.',
        price: '₹800',
        duration: '12 hours',
        icon: 'sunny-outline',
        tag: 'Day Shift',
        route: '/services/caretakers',
      },
      {
        id: 'care-night',
        name: '12-Hour Night Shift Caregiver',
        description: 'Nighttime safety, sleep vigilance, position shifting for bedridden elders, and bathroom assistance.',
        price: '₹900',
        duration: '12 hours',
        icon: 'moon-outline',
        tag: 'Night Shift',
        route: '/services/caretakers',
      },
      {
        id: 'care-24h',
        name: '24-Hour Live-in Care Attendant',
        description: 'Dedicated round-the-clock attendant living in-home for comprehensive continuous patient companionship.',
        price: '₹1,600',
        duration: '24 hours',
        icon: 'home-outline',
        tag: 'Full-Time Live-In',
        route: '/services/caretakers',
      },
      {
        id: 'care-bath',
        name: 'Bedridden Patient Sponge Bath & Hygiene',
        description: 'Full-body hygienic sponge bath, bed linen change, hair wash, and anti-bedsore skin barrier care.',
        price: '₹500',
        duration: '60 mins',
        icon: 'sparkles-outline',
        tag: 'Hygiene & Bath',
        route: '/services/caretakers',
      },
      {
        id: 'care-dementia',
        name: 'Dementia & Elderly Companion Support',
        description: 'Specialized companion care for seniors with Alzheimer’s or mild dementia, offering calm engagement.',
        price: '₹1,100',
        duration: '8 hours',
        icon: 'heart-half-outline',
        tag: 'Specialized Care',
        route: '/services/caretakers',
      },
    ],
  },
  {
    id: 'lab-investigation',
    shortTitle: 'Home Lab Tests',
    title: 'Home Lab & Diagnostic Tests',
    tag: 'Report in 6h',
    rating: '5.0',
    reviewCount: '2.1k+ tests',
    price: '₹650',
    description: 'Sterile sample collection & NABL accredited reports.',
    bgImage: require('../../../assets/images/doorstep-2.png'),
    badgeIcon: 'flask',
    route: '/services/home-lab',
    clinicianRole: 'Certified Phlebotomists & NABL Accredited Labs',
    subServices: [
      {
        id: 'lab-cbc',
        name: 'Complete Blood Count (CBC) + ESR',
        description: '24 vital blood parameters including hemoglobin, RBC, WBC, platelet count and infection indices.',
        price: '₹350',
        duration: '15 mins',
        icon: 'analytics-outline',
        tag: 'Results in 6h',
        route: '/services/home-lab',
      },
      {
        id: 'lab-diabetes',
        name: 'Diabetes Panel (HbA1c + Fasting Sugar)',
        description: 'Gold-standard 3-month blood glucose control average (HbA1c) and fasting blood glucose test.',
        price: '₹550',
        duration: '15 mins',
        icon: 'pulse-outline',
        tag: 'High Accuracy',
        route: '/services/home-lab',
      },
      {
        id: 'lab-fullbody',
        name: 'Full Body Health Package (65+ Parameters)',
        description: 'Comprehensive screening: Liver (LFT), Kidney (KFT), Lipid profile, CBC, Thyroid, and urine analysis.',
        price: '₹1,499',
        duration: '20 mins',
        icon: 'shield-checkmark-outline',
        tag: 'Best Value',
        route: '/services/home-lab',
      },
      {
        id: 'lab-lipid',
        name: 'Lipid Profile (Cardiovascular Heart Risk)',
        description: 'Cholesterol, HDL, LDL, VLDL, and triglycerides to assess cardiovascular health and arterial risk.',
        price: '₹650',
        duration: '15 mins',
        icon: 'heart-outline',
        tag: 'Heart Health',
        route: '/services/home-lab',
      },
      {
        id: 'lab-thyroid',
        name: 'Thyroid Profile Total (T3, T4, TSH)',
        description: 'Advanced CLIA hormonal assay to assess thyroid gland function and metabolic regulation.',
        price: '₹450',
        duration: '15 mins',
        icon: 'flask-outline',
        tag: 'Hormone Panel',
        route: '/services/home-lab',
      },
      {
        id: 'lab-kft',
        name: 'Kidney Function Panel (KFT / RFT)',
        description: 'Serum creatinine, blood urea nitrogen (BUN), uric acid, electrolytes and filtration rate.',
        price: '₹600',
        duration: '15 mins',
        icon: 'eyedrop-outline',
        tag: 'Vital Organ',
        route: '/services/home-lab',
      },
    ],
  },
];

export default function ServicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryModal, setSelectedCategoryModal] = useState<ServiceCategoryCard | null>(null);

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return FOUR_CORE_SERVICES;
    const q = searchQuery.toLowerCase();
    return FOUR_CORE_SERVICES.filter(
      (svc) =>
        svc.shortTitle.toLowerCase().includes(q) ||
        svc.title.toLowerCase().includes(q) ||
        svc.description.toLowerCase().includes(q) ||
        svc.subServices.some(
          (sub) => sub.name.toLowerCase().includes(q) || sub.description.toLowerCase().includes(q)
        )
    );
  }, [searchQuery]);

  const handleCardPress = (svc: ServiceCategoryCard) => {
    setSelectedCategoryModal(svc);
  };

  const handleBookSubService = (sub: SubServiceItem, category: ServiceCategoryCard) => {
    setSelectedCategoryModal(null);
    router.push({
      pathname: category.route as any,
      params: {
        serviceId: sub.id,
        serviceTitle: sub.name,
        price: sub.price,
      },
    });
  };

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
        {/* 3. SEARCH SERVICES BAR                                       */}
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
        {/* 4. EXACT 4 CARDS IN A 2x2 GRID (2 ROWS x 2 CARDS)            */}
        {/* ============================================================ */}
        <View style={styles.servicesGrid}>
          {filteredServices.map((svc) => (
            <TouchableOpacity
              key={svc.id}
              style={styles.gridCard}
              activeOpacity={0.92}
              onPress={() => handleCardPress(svc)}
            >
              {/* Layer 1: Background Image */}
              <Image
                source={svc.bgImage}
                style={styles.gridCardBgImage}
                resizeMode="cover"
              />

              {/* Layer 2: Gradient Contrast Scrim */}
              <View style={styles.gridCardScrim} />

              {/* Layer 3: Elements Above the Background Image */}
              <View style={styles.gridCardContent}>
                {/* Top Badge Row */}
                <View style={styles.gridCardTopRow}>
                  <View style={styles.gridTagBadge}>
                    <Ionicons name={svc.badgeIcon} size={10} color="#A7F3D0" style={{ marginRight: 3 }} />
                    <Text style={styles.gridTagText}>{svc.tag}</Text>
                  </View>

                  <View style={styles.gridRatingBadge}>
                    <Ionicons name="star" size={10} color="#FBBF24" style={{ marginRight: 2 }} />
                    <Text style={styles.gridRatingText}>{svc.rating}</Text>
                  </View>
                </View>

                {/* Bottom Card Elements: Heading + Description + Price & Arrow */}
                <View style={styles.gridCardBottomInfo}>
                  <Text style={styles.gridCardHeading}>{svc.shortTitle}</Text>
                  <Text style={styles.gridCardDesc} numberOfLines={2}>
                    {svc.description}
                  </Text>

                  <View style={styles.gridCardFooterRow}>
                    <View style={styles.gridPricePill}>
                      <Text style={styles.gridPriceLabel}>Starting</Text>
                      <Text style={styles.gridPriceValue}>{svc.price}</Text>
                    </View>

                    <View style={styles.gridExploreBtn}>
                      <Ionicons name="arrow-forward" size={13} color={Palette.primary} />
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

      {/* ============================================================ */}
      {/* 5. CATEGORY DETAILS POP-UP MODAL (ALL SERVICES IT PROVIDES)  */}
      {/* ============================================================ */}
      <Modal
        visible={!!selectedCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedCategoryModal(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheetContainer}>
            {/* Sheet Handle */}
            <View style={styles.modalSheetHandle} />

            {/* Modal Header */}
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderTitleCol}>
                <View style={styles.modalCategoryBadge}>
                  <Ionicons
                    name={selectedCategoryModal?.badgeIcon || 'medkit'}
                    size={13}
                    color={Palette.primary}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.modalCategoryBadgeText}>
                    {selectedCategoryModal?.shortTitle}
                  </Text>
                </View>
                <Text style={styles.modalTitleText}>
                  {selectedCategoryModal?.title}
                </Text>
                <Text style={styles.modalClinicianRoleText}>
                  {selectedCategoryModal?.clinicianRole}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.modalCloseBtn}
                activeOpacity={0.8}
                onPress={() => setSelectedCategoryModal(null)}
              >
                <Ionicons name="close" size={20} color={Palette.textDark} />
              </TouchableOpacity>
            </View>

            {/* Modal Section Title */}
            <View style={styles.modalSectionHeadingRow}>
              <Text style={styles.modalSectionTitle}>
                All Available Services & Procedures ({selectedCategoryModal?.subServices.length || 0})
              </Text>
              <View style={styles.modalRatingWrap}>
                <Ionicons name="star" size={12} color="#F59E0B" style={{ marginRight: 3 }} />
                <Text style={styles.modalRatingText}>{selectedCategoryModal?.rating}</Text>
                <Text style={styles.modalReviewCountText}>({selectedCategoryModal?.reviewCount})</Text>
              </View>
            </View>

            {/* Sub-services Scrollable List */}
            <ScrollView
              style={styles.modalSubServicesList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              {selectedCategoryModal?.subServices.map((item) => (
                <View key={item.id} style={styles.subServiceCard}>
                  <View style={styles.subServiceTopRow}>
                    <View style={styles.subServiceIconCircle}>
                      <Ionicons name={item.icon} size={18} color={Palette.primary} />
                    </View>

                    <View style={styles.subServiceInfoCol}>
                      <View style={styles.subServiceTitleRow}>
                        <Text style={styles.subServiceNameText} numberOfLines={1}>
                          {item.name}
                        </Text>
                        {item.tag && (
                          <View style={styles.subServiceTagPill}>
                            <Text style={styles.subServiceTagText}>{item.tag}</Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.subServiceDescText}>
                        {item.description}
                      </Text>

                      <View style={styles.subServiceMetaRow}>
                        <View style={styles.subServiceDurationWrap}>
                          <Ionicons name="time-outline" size={12} color="#64748B" style={{ marginRight: 3 }} />
                          <Text style={styles.subServiceDurationText}>{item.duration}</Text>
                        </View>

                        <Text style={styles.subServicePriceText}>{item.price}</Text>

                        <TouchableOpacity
                          style={styles.subServiceBookBtn}
                          activeOpacity={0.85}
                          onPress={() => handleBookSubService(item, selectedCategoryModal)}
                        >
                          <Text style={styles.subServiceBookBtnText}>Book Now</Text>
                          <Ionicons name="arrow-forward" size={11} color="#FFFFFF" style={{ marginLeft: 3 }} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}

              <View style={styles.modalTrustBadgeBox}>
                <Ionicons name="shield-checkmark" size={18} color={Palette.primary} style={{ marginRight: 8 }} />
                <Text style={styles.modalTrustBadgeText}>
                  100% Sterile medical kits, background-verified clinicians & transparent doorstep billing.
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    marginBottom: 18,
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

  /* 4. 2x2 Services Grid (2 Columns, 2 Rows) */
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 18,
  },
  gridCard: {
    width: '48%',
    height: 224,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#0F5B43',
    position: 'relative',
    ...Shadows.card,
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
  gridCardScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(8, 38, 28, 0.62)',
  },
  gridCardContent: {
    position: 'relative',
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  gridCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  gridTagText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 9.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  gridRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  gridRatingText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  gridCardBottomInfo: {
    backgroundColor: 'rgba(6, 26, 19, 0.65)',
    borderRadius: 14,
    padding: 9,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  gridCardHeading: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  gridCardDesc: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 10,
    fontWeight: '400',
    color: '#D1E7DD',
    lineHeight: 13.5,
    marginBottom: 8,
  },
  gridCardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.18)',
  },
  gridPricePill: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  gridPriceLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 9.5,
    fontWeight: '400',
    color: '#A7F3D0',
    marginRight: 2,
  },
  gridPriceValue: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  gridExploreBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
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

  /* Modal Details Pop-up */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
    maxHeight: '84%',
    minHeight: '60%',
    ...Shadows.modal,
  },
  modalSheetHandle: {
    width: 40,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalHeaderTitleCol: {
    flex: 1,
    paddingRight: 10,
  },
  modalCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF5EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#D1EADE',
  },
  modalCategoryBadgeText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primary,
  },
  modalTitleText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },
  modalClinicianRoleText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11.5,
    fontWeight: '500',
    color: '#64748B',
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  modalSectionTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    fontWeight: '700',
    color: '#0F5B43',
  },
  modalRatingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalRatingText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalReviewCountText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '400',
    color: '#64748B',
    marginLeft: 3,
  },
  modalSubServicesList: {
    flex: 1,
  },
  subServiceCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 10,
  },
  subServiceTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  subServiceIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EAF5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#D4EADE',
  },
  subServiceInfoCol: {
    flex: 1,
  },
  subServiceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  subServiceNameText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 6,
  },
  subServiceTagPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  subServiceTagText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 9.5,
    fontWeight: '700',
    color: '#15803D',
  },
  subServiceDescText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11.5,
    fontWeight: '400',
    color: '#475569',
    lineHeight: 16,
    marginBottom: 8,
  },
  subServiceMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subServiceDurationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subServiceDurationText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  subServicePriceText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13.5,
    fontWeight: '700',
    color: Palette.primary,
  },
  subServiceBookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primary,
    paddingHorizontal: 11,
    paddingVertical: 5.5,
    borderRadius: 12,
  },
  subServiceBookBtnText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalTrustBadgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 11,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginTop: 6,
  },
  modalTrustBadgeText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '500',
    color: '#166534',
    flex: 1,
    lineHeight: 15,
  },
});
