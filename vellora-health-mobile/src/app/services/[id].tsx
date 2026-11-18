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
  Dimensions,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { Colors, Typography, Spacing, Shadows } from '../../constants/theme';
import { CORE_SERVICES, formatCurrency } from '../../data/mockData';

const Palette = {
  primary: '#0F5B43',        // Primary forest green
  primaryDark: '#083B2B',    // Dark forest green
  mint: '#EAF5EE',           // Soft mint accent
  bgWarm: '#FBFAF7',         // Warm ivory page background
  surface: '#FFFFFF',        // Card white
  textDark: '#1B2A24',       // Primary text
  textMuted: '#7A8B84',      // Secondary text
  border: '#DCE9E1',         // Clean border
  emerald: '#059669',        // Available today green
  emeraldLight: '#EAF6ED',
};

export interface ServiceCardItem {
  id: string;
  name: string;
  specialty: string;
  category: string;
  experience: string;
  rating: number;
  reviewsCount: number;
  qualifications: string;
  languages: string;
  price: number;
  about: string;
  image: any;
  tintColor: string;
  badgeTag?: string;
}

// 1. DOCTORS DATA
const DOCTORS_DATA: ServiceCardItem[] = [
  {
    id: 'doc-vivian',
    name: 'Dr. Vivian Green',
    specialty: 'General Dentist',
    category: 'General',
    experience: '12+ years of experience',
    rating: 4.9,
    reviewsCount: 1324,
    qualifications: 'BDS, MDS (Oral & Dental Surgery)',
    languages: 'English, Hindi, Kannada',
    price: 799,
    about: 'Dr. Vivian Green is a senior dental surgeon with over 12 years of clinical experience in home dental consultations, oral hygiene screening, denture fitting, and preventive oral health.',
    image: require('../../../assets/images/doctor-rohan.png'),
    tintColor: '#E2DFD8',
  },
  {
    id: 'doc-lisa',
    name: 'Dr. Lisa Tran',
    specialty: 'ENT Specialist',
    category: 'General',
    experience: '10+ years of experience',
    rating: 4.9,
    reviewsCount: 980,
    qualifications: 'MBBS, MS (Otolaryngology)',
    languages: 'English, Hindi, Gujarati',
    price: 849,
    about: 'Experienced ENT specialist providing at-home diagnosis for ear, nose, throat, sinusitis, vertigo, and allergic rhinitis management for children and adults.',
    image: require('../../../assets/images/avatar-indian-2.jpg'),
    tintColor: '#8CA2B1',
  },
  {
    id: 'doc-alice',
    name: 'Dr. Alice Huang',
    specialty: 'Cardiologist',
    category: 'Cardiology',
    experience: '14+ years of experience',
    rating: 4.8,
    reviewsCount: 850,
    qualifications: 'MBBS, MD, DM (Cardiology)',
    languages: 'English, Hindi',
    price: 999,
    about: 'Experienced clinical cardiologist focused on home blood pressure monitoring, post-cardiac rehabilitation, ECG analysis, cholesterol management, and preventive heart health.',
    image: require('../../../assets/images/doctor-ethan-park.jpg'),
    tintColor: '#7B8185',
  },
  {
    id: 'doc-omar',
    name: 'Dr. Omar Hassan',
    specialty: 'Pediatrician',
    category: 'Pediatrics',
    experience: '10+ years of experience',
    rating: 4.9,
    reviewsCount: 1120,
    qualifications: 'MBBS, DCH, MD (Pediatrics)',
    languages: 'English, Hindi, Arabic',
    price: 849,
    about: 'Compassionate consultant pediatrician specializing in newborn wellness, pediatric vaccinations, childhood asthma, growth milestones, and acute pediatric care at home.',
    image: require('../../../assets/images/avatar-indian-1.jpg'),
    tintColor: '#DCE5ED',
  },
  {
    id: 'doc-lena',
    name: 'Dr. Lena Petrova',
    specialty: 'Endocrinologist',
    category: 'General',
    experience: '15+ years of experience',
    rating: 4.9,
    reviewsCount: 740,
    qualifications: 'MBBS, MD, DM (Endocrinology)',
    languages: 'English, Hindi, Russian',
    price: 899,
    about: 'Consultant endocrinologist with deep expertise in thyroid disorders, hormone balancing, diabetes management, metabolic syndromes, and personalized lifestyle guidance.',
    image: require('../../../assets/images/doctor-daniel-reed.jpg'),
    tintColor: '#E2E5E8',
  },
  {
    id: 'doc-kenji',
    name: 'Dr. Kenji Tanaka',
    specialty: 'Neurologist',
    category: 'Neurology',
    experience: '11+ years of experience',
    rating: 4.9,
    reviewsCount: 640,
    qualifications: 'MBBS, MD, DM (Neurology)',
    languages: 'English, Hindi, Japanese',
    price: 949,
    about: 'Consultant neurologist with deep expertise in headache disorders, Parkinson’s and tremor management, post-stroke cognitive assessment, and geriatric neurology at home.',
    image: require('../../../assets/images/avatar-indian-10.jpg'),
    tintColor: '#E8ECEF',
  },
];

// 2. NURSING CARE DATA
const NURSES_DATA: ServiceCardItem[] = [
  {
    id: 'nurse-priya',
    name: 'Nurse Priya Sharma',
    specialty: 'Critical Care & Vitals',
    category: 'Critical Care',
    experience: '8+ years of experience',
    rating: 4.9,
    reviewsCount: 620,
    qualifications: 'B.Sc Nursing, Critical Care Certified',
    languages: 'English, Hindi, Kannada',
    price: 549,
    about: 'Registered critical care nurse specializing in ICU step-down bedside care, tracheostomy care, IV infusions, wound dressing, and post-operative monitoring at home.',
    image: require('../../../assets/images/doctor-maya-patel.jpg'),
    tintColor: '#EAF3EE',
  },
  {
    id: 'nurse-deepa',
    name: 'Nurse Deepa Joseph',
    specialty: 'Post-Op Recovery',
    category: 'Post-Op',
    experience: '11+ years of experience',
    rating: 4.8,
    reviewsCount: 890,
    qualifications: 'GNM, Surgical Nursing Specialist',
    languages: 'English, Malayalam, Hindi',
    price: 499,
    about: 'Experienced surgical nurse dedicated to sterile post-surgical wound care, catheterization, pain management, mobility assistance, and bedside clinical charting.',
    image: require('../../../assets/images/avatar-indian-1.jpg'),
    tintColor: '#DDEAE2',
  },
  {
    id: 'nurse-sunita',
    name: 'Nurse Sunita Rao',
    specialty: 'Geriatric Nursing',
    category: 'Elderly Care',
    experience: '9+ years of experience',
    rating: 4.9,
    reviewsCount: 540,
    qualifications: 'B.Sc Nursing, Geriatric Care Dip.',
    languages: 'English, Hindi, Telugu',
    price: 499,
    about: 'Gentle, compassionate geriatric nurse skilled in medication administration, blood glucose curves, pressure sore prevention, and palliative support for senior patients.',
    image: require('../../../assets/images/avatar-indian-6.jpg'),
    tintColor: '#E7EFE9',
  },
  {
    id: 'nurse-rajesh',
    name: 'Nurse Rajesh Menon',
    specialty: 'IV Infusions & Injections',
    category: 'Vitals & IV',
    experience: '7+ years of experience',
    rating: 4.8,
    reviewsCount: 430,
    qualifications: 'B.Sc Nursing, ACLS Certified',
    languages: 'English, Hindi, Tamil',
    price: 450,
    about: 'Fast, precise vascular access specialist for antibiotic IV drips, cannula management, subcutaneous injections, and urgent bedside vitals stabilization.',
    image: require('../../../assets/images/avatar-indian-8.jpg'),
    tintColor: '#E2ECE5',
  },
];

// 3. CAREGIVERS & ATTENDANTS DATA
const CAREGIVERS_DATA: ServiceCardItem[] = [
  {
    id: 'care-kavita',
    name: 'Caregiver Kavita Bai',
    specialty: 'Elderly Bedside Attendant',
    category: 'Elderly Care',
    experience: '6+ years of experience',
    rating: 4.9,
    reviewsCount: 480,
    qualifications: 'Certified Healthcare Assistant (HCA)',
    languages: 'Hindi, Kannada, Marathi',
    price: 399,
    about: 'Warm, dependable certified caregiver assisting seniors with daily mobility, bathing, grooming, timely meal feeding, and companion emotional support.',
    image: require('../../../assets/images/service-caretaker.png'),
    tintColor: '#F5ECE3',
  },
  {
    id: 'care-suresh',
    name: 'Caregiver Suresh Patil',
    specialty: 'Bedridden & Post-Stroke',
    category: 'Bedridden Care',
    experience: '8+ years of experience',
    rating: 4.8,
    reviewsCount: 560,
    qualifications: 'Certified Patient Attendant, First Aid',
    languages: 'Hindi, Kannada, English',
    price: 449,
    about: 'Physically strong and patient attendant specialized in turning bedridden patients, transfer techniques, wheelchair assistance, and sponge bathing.',
    image: require('../../../assets/images/avatar-indian-5.jpg'),
    tintColor: '#ECE5DE',
  },
  {
    id: 'care-lakshmi',
    name: 'Caregiver Lakshmi Devi',
    specialty: '12h Day Shift Attendant',
    category: '12h Day Shift',
    experience: '5+ years of experience',
    rating: 4.9,
    reviewsCount: 390,
    qualifications: 'Home Nursing Attendant Certified',
    languages: 'Telugu, Kannada, Hindi',
    price: 499,
    about: 'Attentive day-shift caregiver providing continuous observation, vital signs logging, walker support, cognitive engagement, and medication reminders.',
    image: require('../../../assets/images/avatar-indian-7.jpg'),
    tintColor: '#F3EAE0',
  },
  {
    id: 'care-meera',
    name: 'Caregiver Meera Ben',
    specialty: 'Dementia & Alzheimer Care',
    category: 'Dementia Support',
    experience: '9+ years of experience',
    rating: 4.9,
    reviewsCount: 610,
    qualifications: 'Specialized Dementia Care Attendant',
    languages: 'Gujarati, Hindi, English',
    price: 520,
    about: 'Calm, patient memory-care attendant experienced in managing sun-downing syndrome, redirection techniques, structured daily routines, and gentle physical safety.',
    image: require('../../../assets/images/avatar-indian-9.jpg'),
    tintColor: '#EBE2D7',
  },
];

// 4. LAB TESTS & DIAGNOSTIC PANELS DATA
const LAB_TESTS_DATA: ServiceCardItem[] = [
  {
    id: 'lab-full-body',
    name: 'Master Health Checkup',
    specialty: '84 Comprehensive Tests',
    category: 'Full Body Checkup',
    experience: '12h Digital e-Report',
    rating: 4.9,
    reviewsCount: 2150,
    qualifications: 'NABL & CAP Accredited Labs',
    languages: 'Vacuum-Sealed Sterile Barcode Tubes',
    price: 1199,
    about: 'Comprehensive master checkup covering complete hemogram (CBC), diabetic screen (HbA1c & Fasting), lipid profile, liver function (LFT), kidney function (KFT), and thyroid hormones.',
    image: require('../../../assets/images/doorstep-4.png'),
    tintColor: '#E1EDF3',
  },
  {
    id: 'lab-diabetes',
    name: 'Diabetic Health Profile',
    specialty: 'HbA1c + Glucose + Lipids',
    category: 'Diabetic Profile',
    experience: 'Same Day 8h Report',
    rating: 4.8,
    reviewsCount: 1420,
    qualifications: 'NABL Accredited Diagnostics',
    languages: 'Fast 10-Hour Overnight Fasting',
    price: 649,
    about: 'Essential metabolic panel to track 3-month glycemic control via high-performance liquid chromatography (HPLC) HbA1c, fasting blood sugar, and microalbuminuria.',
    image: require('../../../assets/images/service-lab.png'),
    tintColor: '#E6E8F2',
  },
  {
    id: 'lab-cardiac',
    name: 'Cardiac Lipid Panel',
    specialty: 'Heart & Cholesterol Screen',
    category: 'Heart Health',
    experience: '12h Digital e-Report',
    rating: 4.9,
    reviewsCount: 940,
    qualifications: 'Advanced Enzymatic Colorimetric Assay',
    languages: 'Overnight Fasting Required',
    price: 599,
    about: 'In-depth cardiovascular risk assessment measuring Total Cholesterol, HDL Good Cholesterol, LDL Bad Cholesterol, VLDL, Triglycerides, and Cardiac Risk Ratio.',
    image: require('../../../assets/images/avatar-indian-4.jpg'),
    tintColor: '#F2E8E8',
  },
  {
    id: 'lab-cbc',
    name: 'Complete Blood Count (CBC)',
    specialty: 'Hemogram & Platelets (24 Tests)',
    category: 'CBC & Blood',
    experience: '6h Rapid Turnaround',
    rating: 4.9,
    reviewsCount: 1850,
    qualifications: 'Fully Automated 5-Part Cell Counter',
    languages: 'No Fasting Required',
    price: 349,
    about: 'Quick, fundamental evaluation of overall health measuring Hemoglobin, White Blood Cells (WBC count & differential), Red Blood Cells, Platelets, MCV, MCH, and ESR.',
    image: require('../../../assets/images/avatar-indian-11.jpg'),
    tintColor: '#EBF2EA',
  },
];

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Determine which service section is active
  const serviceKey = id || 'doctor-visit';

  const config = useMemo(() => {
    switch (serviceKey) {
      case 'nursing-care':
        return {
          title: 'Nurses List',
          subtitle: 'Verified registered nurses available for at-home care',
          categories: ['All', 'General Nursing', 'Critical Care', 'Post-Op', 'Elderly Care', 'Vitals & IV'],
          data: NURSES_DATA,
          bookLabel: 'Book Nursing Visit →',
          serviceId: 'nursing-care',
        };
      case 'caretakers':
        return {
          title: 'Caregivers List',
          subtitle: 'Trained & verified attendants for daily bedside assistance',
          categories: ['All', 'Elderly Care', 'Bedridden Care', '12h Day Shift', '24/7 Live-In', 'Dementia Support'],
          data: CAREGIVERS_DATA,
          bookLabel: 'Book Caregiver →',
          serviceId: 'caretakers',
        };
      case 'home-lab':
      case 'lab-tests':
        return {
          title: 'Diagnostic Tests',
          subtitle: 'Certified doorstep sample collection with 12h digital reports',
          categories: ['All', 'Full Body Checkup', 'Diabetic Profile', 'Heart Health', 'CBC & Blood'],
          data: LAB_TESTS_DATA,
          bookLabel: 'Book Home Sample Draw →',
          serviceId: 'lab-tests',
        };
      case 'doctor-visit':
      default:
        return {
          title: 'Doctors List',
          subtitle: 'Verified specialist doctors available for home visits',
          categories: ['All', 'General', 'Pediatrics', 'Cardiology', 'Orthopedics', 'Neurology'],
          data: DOCTORS_DATA,
          bookLabel: 'Book Home Doctor Visit →',
          serviceId: 'doctor-visit',
        };
    }
  }, [serviceKey]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<ServiceCardItem | null>(null);

  // Filter items by search query and category
  const filteredItems = useMemo(() => {
    return config.data.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.specialty.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [config.data, searchQuery, selectedCategory]);

  const handleBookItem = (item: ServiceCardItem) => {
    setSelectedItem(null);
    router.push({
      pathname: `/booking/${config.serviceId}` as any,
      params: {
        doctorId: item.id,
        price: String(item.price),
        selectedTitle: config.serviceId === 'lab-tests' ? item.name : undefined,
        doctorName: config.serviceId === 'lab-tests' ? undefined : item.name,
        specialty: item.specialty,
      },
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/services');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      {/* Top Header Bar with Clean Centered Logo & Right Support Action */}
      <View style={styles.header}>
        <TouchableOpacity accessibilityRole="button"
          accessibilityLabel="Go back" onPress={handleBack}
          activeOpacity={0.7}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color={Palette.textDark} />
        </TouchableOpacity>

        {/* Clean Centered Brand Logo */}
        <View style={styles.headerBrandCenter}>
          <Image
            source={require('../../../assets/images/logo-dark.png')}
            style={styles.brandLogo}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity accessibilityRole="button"
          style={styles.headerHelpBtn}
          activeOpacity={0.7}
          onPress={() => {
            Alert.alert(
              'Vellora Care Support',
              'Need assistance selecting the right specialist or tests? Call our 24/7 care desk (+91 80 4910 8800).',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Call Now', onPress: () => Linking.openURL('tel:+918049108800') },
              ]
            );
          }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="help-circle-outline" size={24} color={Palette.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Header Title */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>{config.title}</Text>
          {config.subtitle && serviceKey !== 'doctor-visit' ? (
            <Text style={styles.mainSubtitle}>{config.subtitle}</Text>
          ) : null}
        </View>

        {/* Search Bar with Filter Icon */}
        <View style={styles.searchBarWrapper}>
          <View style={styles.searchBarContainer}>
            <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              placeholder="Search here...."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="Clear service search" onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity accessibilityRole="button"
            accessibilityLabel="Filter categories"
            style={styles.filterButton}
            activeOpacity={0.75}
            onPress={() => {
              const nextIndex = (config.categories.indexOf(selectedCategory) + 1) % config.categories.length;
              setSelectedCategory(config.categories[nextIndex]);
            }}
          >
            <Ionicons name="options-outline" size={20} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Category Filter Pills (Shown if filtered away from All or non-doctor-visit) */}
        {selectedCategory !== 'All' && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {config.categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity accessibilityRole="button"
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.8}
                  style={[
                    styles.categoryPill,
                    isSelected ? styles.categoryPillActive : styles.categoryPillInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      isSelected ? styles.categoryPillTextActive : styles.categoryPillTextInactive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* 2-Column Cards Grid - Exact Modern Portrait Design */}
        <View style={styles.itemsGrid}>
          {filteredItems.map((item) => (
            <TouchableOpacity accessibilityRole="button"
              accessibilityLabel={`View ${item.name} profile`}
              key={item.id}
              activeOpacity={0.88}
              onPress={() => setSelectedItem(item)}
              style={[styles.itemCard, { backgroundColor: item.tintColor }]}
            >
              {/* Specialist / Test Portrait Image */}
              <Image source={item.image} style={styles.itemCardImage} resizeMode="cover" />

              {/* Floating Bottom Card Overlay */}
              <View style={styles.itemBadgeOverlay}>
                <View style={styles.itemBadgeTextCol}>
                  <Text style={styles.itemBadgeName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemBadgeSpecialty} numberOfLines={1}>
                    {item.specialty}
                  </Text>
                </View>

                {/* Up-Right Circle Arrow Button */}
                <View style={styles.circleArrowBtn}>
                  <Ionicons
                    name="arrow-up"
                    size={13}
                    color="#1F2937"
                    style={{ transform: [{ rotate: '45deg' }] }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Direct Booking Primary CTA Button */}
        <TouchableOpacity accessibilityRole="button"
          style={styles.directBookBtn}
          activeOpacity={0.88}
          onPress={() => {
            router.push(`/booking/${config.serviceId}` as any);
          }}
        >
          <Ionicons name="calendar-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.directBookBtnText}>{config.bookLabel}</Text>
        </TouchableOpacity>

        {/* Quality & Safety Trust Card */}
        <View style={styles.trustCard}>
          <View style={styles.trustHeader}>
            <Ionicons name="shield-checkmark" size={18} color={Palette.primary} style={{ marginRight: 6 }} />
            <Text style={styles.trustTitle}>Vellora Clinical Standards</Text>
          </View>
          <Text style={styles.trustSubtitle}>
            All clinicians undergo rigorous background verification, license validation, and carry hospital-grade sterile kits.
          </Text>
        </View>

        {filteredItems.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={36} color={Palette.textMuted} />
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptySubtitle}>Try searching with different keywords or clear filters</Text>
            <TouchableOpacity accessibilityRole="button"
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              style={styles.resetFilterBtn}
            >
              <Text style={styles.resetFilterText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* ============================================================ */}
      {/* BOTTOM SHEET DETAIL MODAL (Item / Doctor / Nurse Profile)    */}
      {/* ============================================================ */}
      <Modal
        visible={!!selectedItem}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setSelectedItem(null)}
          />
          <View style={styles.modalSheet} onStartShouldSetResponder={() => true}>
            {/* Modal Drag Handle */}
            <View style={styles.modalDragHandle} />

            {selectedItem && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScrollContent}>
                {/* Doctor / Specialist Header Card */}
                <View style={styles.modalHeaderCard}>
                  <Image
                    source={selectedItem.image}
                    style={styles.modalDoctorAvatar}
                    resizeMode="cover"
                  />
                  <View style={styles.modalDoctorInfo}>
                    <Text style={styles.modalDoctorName}>{selectedItem.name}</Text>
                    <Text style={styles.modalDoctorSpecialty}>{selectedItem.specialty}</Text>
                    <Text style={styles.modalDoctorExp}>{selectedItem.experience}</Text>

                    <View style={styles.modalRatingRow}>
                      <Ionicons name="star" size={14} color="#F59E0B" />
                      <Text style={styles.modalRatingScore}>{selectedItem.rating.toFixed(1)}</Text>
                      <Text style={styles.modalReviewsCount}>({selectedItem.reviewsCount.toLocaleString()} reviews)</Text>
                    </View>

                    <View style={styles.modalAvailableBadge}>
                      <Ionicons name="calendar-outline" size={12} color={Palette.emerald} style={{ marginRight: 4 }} />
                      <Text style={styles.modalAvailableText}>Available Today</Text>
                    </View>
                  </View>
                </View>

                {/* About Section */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>About</Text>
                  <Text style={styles.modalAboutText}>{selectedItem.about}</Text>
                </View>

                {/* Credentials & Details Row */}
                <View style={styles.modalTwoColRow}>
                  <View style={styles.modalColBox}>
                    <Ionicons name="school-outline" size={18} color={Palette.primary} style={{ marginBottom: 4 }} />
                    <Text style={styles.modalBoxTitle}>Qualifications</Text>
                    <Text style={styles.modalBoxValue}>{selectedItem.qualifications}</Text>
                  </View>

                  <View style={styles.modalColBox}>
                    <Ionicons name="language-outline" size={18} color={Palette.primary} style={{ marginBottom: 4 }} />
                    <Text style={styles.modalBoxTitle}>Languages</Text>
                    <Text style={styles.modalBoxValue}>{selectedItem.languages}</Text>
                  </View>
                </View>

                {/* Itemized Pricing */}
                <View style={styles.modalPricingCard}>
                  <View>
                    <Text style={styles.modalPricingLabel}>Visit Consultation Fee</Text>
                    <Text style={styles.modalPricingSubtext}>Inclusive of travel, PPE & clinical triage</Text>
                  </View>
                  <Text style={styles.modalPriceText}>{formatCurrency(selectedItem.price)}</Text>
                </View>

                {/* Action Buttons */}
                <TouchableOpacity accessibilityRole="button"
                  style={styles.modalBookBtn}
                  activeOpacity={0.88}
                  onPress={() => handleBookItem(selectedItem)}
                >
                  <Text style={styles.modalBookBtnText}>{config.bookLabel}</Text>
                </TouchableOpacity>

                <TouchableOpacity accessibilityRole="button"
                  style={styles.modalCloseBtn}
                  activeOpacity={0.7}
                  onPress={() => setSelectedItem(null)}
                >
                  <Text style={styles.modalCloseBtnText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.bgWarm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Palette.bgWarm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.subtle,
  },
  headerBrandCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogo: {
    width: 124,
    height: 34,
  },
  headerHelpBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.mint,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CDE5D7',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  /* Title Section */
  titleSection: {
    marginTop: 4,
    marginBottom: 16,
  },
  mainTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  mainSubtitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 18,
  },

  /* Search Bar with Filter Button */
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  searchBarContainer: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.fontFamily.sans,
    fontSize: 14,
    color: '#111827',
    height: '100%',
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none', borderWidth: 0 } as any) : {}),
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  /* Category Filter Pills */
  categoriesScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
    marginBottom: 16,
  },
  categoryPill: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  categoryPillActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  categoryPillInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  categoryPillText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  categoryPillTextInactive: {
    color: '#4B5563',
    fontWeight: '500',
  },

  /* 2-Column Cards Grid - Exact Design from Reference */
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
    marginBottom: 20,
  },
  itemCard: {
    width: '48.2%',
    height: 224,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  itemCardImage: {
    width: '100%',
    height: '100%',
  },
  itemBadgeOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 9,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  itemBadgeTextCol: {
    flex: 1,
    paddingRight: 6,
    justifyContent: 'center',
  },
  itemBadgeName: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  itemBadgeSpecialty: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 14,
  },
  circleArrowBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  directBookBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: Palette.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    ...Shadows.subtle,
  },
  directBookBtnText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 14.5,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  trustCard: {
    backgroundColor: Palette.surface,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: Palette.border,
    padding: 14,
    marginBottom: 20,
    ...Shadows.subtle,
  },
  trustHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  trustTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    fontWeight: '600',
    color: Palette.primary,
  },
  trustSubtitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11.5,
    fontWeight: '400',
    color: Palette.textMuted,
    lineHeight: 16,
  },

  /* Empty State */
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 16,
    fontWeight: '600',
    color: Palette.textDark,
  },
  emptySubtitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    color: Palette.textMuted,
  },
  resetFilterBtn: {
    marginTop: 8,
    backgroundColor: Palette.mint,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  resetFilterText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    fontWeight: '600',
    color: Palette.primary,
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Palette.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    ...Shadows.card,
  },
  modalDragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  modalHeaderCard: {
    flexDirection: 'row',
    backgroundColor: Palette.bgWarm,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.2,
    borderColor: Palette.border,
    marginBottom: 16,
    gap: 14,
  },
  modalDoctorAvatar: {
    width: 70,
    height: 70,
    borderRadius: 20,
  },
  modalDoctorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  modalDoctorName: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 16,
    fontWeight: '600',
    color: Palette.textDark,
  },
  modalDoctorSpecialty: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    color: Palette.primary,
    fontWeight: '500',
    marginTop: 1,
  },
  modalDoctorExp: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    color: Palette.textMuted,
    marginTop: 2,
  },
  modalRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  modalRatingScore: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textDark,
  },
  modalReviewsCount: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    color: Palette.textMuted,
  },
  modalAvailableBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.emeraldLight,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginTop: 6,
  },
  modalAvailableText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 10.5,
    fontWeight: '600',
    color: Palette.emerald,
  },
  modalSection: {
    marginBottom: 14,
  },
  modalSectionTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textDark,
    marginBottom: 6,
  },
  modalAboutText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    color: '#4A5B53',
    lineHeight: 18,
  },
  modalTwoColRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  modalColBox: {
    flex: 1,
    backgroundColor: Palette.bgWarm,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: Palette.border,
    padding: 12,
  },
  modalBoxTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    color: Palette.textMuted,
    marginBottom: 2,
  },
  modalBoxValue: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '500',
    color: Palette.textDark,
    lineHeight: 16,
  },
  modalPricingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Palette.mint,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#D4E7DC',
    padding: 14,
    marginBottom: 18,
  },
  modalPricingLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textDark,
  },
  modalPricingSubtext: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    color: Palette.textMuted,
    marginTop: 2,
  },
  modalPriceText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 18,
    fontWeight: '600',
    color: Palette.primary,
  },
  modalBookBtn: {
    height: 50,
    borderRadius: 25,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    ...Shadows.subtle,
  },
  modalBookBtnText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 14.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalCloseBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    fontWeight: '500',
    color: Palette.textMuted,
  },
});
