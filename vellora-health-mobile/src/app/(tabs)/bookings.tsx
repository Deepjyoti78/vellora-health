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
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Shadows } from '../../constants/theme';
import { RECENT_BOOKINGS, REGIONAL_CONFIG } from '../../data/mockData';

const Palette = {
  primary: '#0F5B43',        // Primary forest green
  primaryLight: '#EAF5EE',   // Soft mint accent
  primaryDark: '#0A3F2E',    // Deep forest green
  bgWarm: '#FBFAF7',         // Warm ivory page background
  surface: '#FFFFFF',        // Card white
  textDark: '#1B2A24',       // Primary text
  textMuted: '#6B7E75',      // Secondary text
  border: '#DCE9E1',         // Clean border
  borderLight: '#EDF4F0',    // Soft border
  boxBg: '#F5FAF7',          // Mint container background
  confirmedBg: '#EAF6ED',    // Green status badge background
  confirmedText: '#059669',  // Green status badge text
  scheduledBg: '#FEF3C7',    // Amber status badge background
  scheduledText: '#D97706',  // Amber status badge text
  completedBg: '#E0F2FE',    // Blue status badge background
  completedText: '#0284C7',  // Blue status badge text
  cancelledBg: '#FEE2E2',    // Red status badge background
  cancelledText: '#DC2626',  // Red status badge text
};

type FilterTab = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

interface BookingItemDisplay {
  id: string;
  bookingRef: string;
  serviceCategory: string;
  serviceTitle: string;
  providerName: string;
  providerSpecialty: string;
  providerRating: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Scheduled' | 'Completed' | 'Cancelled';
  avatar: any;
  routeId?: string;
  address?: string;
  amount: string;
  paymentStatus: string;
  securityPin?: string;
  cancellationReason?: string;
}

const UPCOMING_BOOKINGS: BookingItemDisplay[] = [
  {
    id: 'bkg-1',
    bookingRef: '#VEL-2025-8492',
    serviceCategory: 'Home Doctor Visit',
    serviceTitle: 'Home Visit Consultation',
    providerName: 'Dr. Arjun Mehta',
    providerSpecialty: 'MD, General Physician • Vellora Care',
    providerRating: '4.9 (128 visits)',
    date: 'Wed, 14 May 2025',
    time: '11:00 AM – 11:30 AM',
    status: 'Confirmed',
    avatar: require('../../../assets/images/doctor-rohan.png'),
    routeId: 'bkg-8492',
    address: 'A-402, Green Valley Apartments, Bangalore - 560068',
    amount: '₹1,200',
    paymentStatus: 'Paid Online (UPI)',
    securityPin: '4829',
  },
  {
    id: 'bkg-2',
    bookingRef: '#VEL-2025-8890',
    serviceCategory: 'Home Nursing Care',
    serviceTitle: 'Home Nursing Care',
    providerName: 'Nurse Priya Sharma',
    providerSpecialty: 'B.Sc Nursing • Critical & Elderly Care',
    providerRating: '4.8 (94 visits)',
    date: 'Fri, 16 May 2025',
    time: '02:00 PM – 02:45 PM',
    status: 'Scheduled',
    avatar: require('../../../assets/images/doctor-maya-patel.jpg'),
    routeId: 'bkg-8890',
    address: 'B-104, Sunrise Heights, Koramangala, Bangalore - 560034',
    amount: '₹1,500',
    paymentStatus: 'Cash on Visit',
    securityPin: '7392',
  },
];

const COMPLETED_BOOKINGS: BookingItemDisplay[] = [
  {
    id: 'bkg-3',
    bookingRef: '#VEL-2025-8104',
    serviceCategory: 'Lab Investigation',
    serviceTitle: 'Comprehensive Blood Panel',
    providerName: 'Rajesh Kumar',
    providerSpecialty: 'Senior Phlebotomist • Sterile Doorstep Draw',
    providerRating: '5.0 (210 tests)',
    date: '10 May 2025',
    time: '08:30 AM – 09:00 AM',
    status: 'Completed',
    avatar: require('../../../assets/images/avatar-indian-4.jpg'),
    routeId: 'bkg-8104',
    address: 'A-402, Green Valley Apartments, Bangalore - 560068',
    amount: '₹650',
    paymentStatus: 'Paid Online',
  },
  {
    id: 'bkg-4',
    bookingRef: '#VEL-2025-8105',
    serviceCategory: 'Physiotherapy',
    serviceTitle: 'Mobility & Ortho Rehabilitation',
    providerName: 'Dr. Ananya Roy',
    providerSpecialty: 'MPT, Orthopedic Physical Therapy',
    providerRating: '4.9 (82 visits)',
    date: '02 May 2025',
    time: '04:00 PM – 05:00 PM',
    status: 'Completed',
    avatar: require('../../../assets/images/avatar-indian-3.jpg'),
    routeId: 'bkg-8105',
    address: 'A-402, Green Valley Apartments, Bangalore - 560068',
    amount: '₹1,100',
    paymentStatus: 'Paid Online',
  },
];

const CANCELLED_BOOKINGS: BookingItemDisplay[] = [
  {
    id: 'bkg-5',
    bookingRef: '#VEL-2025-8106',
    serviceCategory: 'General Consultation',
    serviceTitle: 'General Physician Checkup',
    providerName: 'Dr. Daniel Reed',
    providerSpecialty: 'MBBS • Internal Medicine',
    providerRating: '4.8 (115 visits)',
    date: '28 Apr 2025',
    time: '10:00 AM – 10:30 AM',
    status: 'Cancelled',
    avatar: require('../../../assets/images/doctor-daniel-reed.jpg'),
    routeId: 'bkg-8106',
    address: 'A-402, Green Valley Apartments, Bangalore - 560068',
    amount: '₹1,200',
    paymentStatus: 'Refunded to original payment method',
    cancellationReason: 'Cancelled by patient • 100% refund credited',
  },
];

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<FilterTab>('UPCOMING');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const upcomingList = useMemo(() => {
    const dynamicBookings: BookingItemDisplay[] = RECENT_BOOKINGS.filter(
      (b) => b.status === 'CONFIRMED' || b.status === 'REQUESTED' || b.status === 'DISPATCHED' || b.status === 'IN_TRANSIT'
    ).map((b) => ({
      id: b.id,
      bookingRef: `#VEL-2025-${b.id.slice(-4).toUpperCase()}`,
      serviceCategory: 'Home Visit Service',
      serviceTitle: b.serviceTitle,
      providerName: b.assignedClinician?.name || 'Dr. Arjun Mehta',
      providerSpecialty: b.assignedClinician?.title || 'MD, General Physician',
      providerRating: '4.9 (128 visits)',
      date: b.scheduledDate,
      time: b.scheduledTimeSlot,
      status: 'Confirmed',
      avatar: b.assignedClinician?.avatar || require('../../../assets/images/doctor-rohan.png'),
      routeId: b.id,
      address: b.address,
      amount: `₹${b.totalPrice.toLocaleString('en-IN')}`,
      paymentStatus: 'Paid Online',
      securityPin: b.securityPin || '4829',
    }));

    const existingIds = new Set(dynamicBookings.map((b) => b.id));
    const defaults = UPCOMING_BOOKINGS.filter(
      (b) => !existingIds.has(b.id) && !(b.routeId && existingIds.has(b.routeId))
    );
    return [...dynamicBookings, ...defaults];
  }, []);

  const getBookingsList = () => {
    let list: BookingItemDisplay[] = [];
    switch (activeTab) {
      case 'UPCOMING':
        list = upcomingList;
        break;
      case 'COMPLETED':
        list = COMPLETED_BOOKINGS;
        break;
      case 'CANCELLED':
        list = CANCELLED_BOOKINGS;
        break;
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.filter(
      (item) =>
        item.serviceTitle.toLowerCase().includes(q) ||
        item.providerName.toLowerCase().includes(q) ||
        item.bookingRef.toLowerCase().includes(q) ||
        item.serviceCategory.toLowerCase().includes(q)
    );
  };

  const handleBookingPress = (booking: BookingItemDisplay) => {
    router.push({
      pathname: `/booking/${booking.routeId || booking.id}`,
      params: {
        step: 'details_view',
        serviceTitle: booking.serviceTitle,
        providerName: booking.providerName,
        date: booking.date,
        time: booking.time,
        status: booking.status,
        address: booking.address || 'A-402, Green Valley Apartments, Bangalore - 560068',
      },
    } as any);
  };

  const handleCallSupport = () => {
    Alert.alert(
      'Vellora Care Desk',
      'Would you like to call our 24/7 Home Care Helpdesk (+91 80 4910 8800)?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', onPress: () => Linking.openURL(`tel:${REGIONAL_CONFIG.supportPhone}`) },
      ]
    );
  };

  const handleDownloadPrescription = (ref: string) => {
    Alert.alert('Prescription Ready', `Digital e-Prescription for booking ${ref} has been saved to your health records.`, [
      { text: 'View Records', onPress: () => router.push('/(tabs)/records') },
      { text: 'OK', style: 'default' },
    ]);
  };

  const bookings = getBookingsList();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ============================================================ */}
        {/* 1. TOP BRAND HEADER: LOGO + "MY BOOKINGS" TITLE              */}
        {/* ============================================================ */}
        <View style={styles.topHeaderBar}>
          <View style={styles.brandTitleContainer}>
            <Image
              source={require('../../../assets/images/logo-dark.png')}
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <View style={styles.brandTitleDivider} />
            <Text style={styles.pageHeadingInline}>My Bookings</Text>
          </View>

          <View style={styles.activeBadgeContainer}>
            <View style={styles.activeDot} />
            <Text style={styles.activeBadgeText}>{upcomingList.length} Active</Text>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 2. SEGMENTED FILTER TABS: Upcoming | Completed | Cancelled   */}
        {/* ============================================================ */}
        <View style={styles.segmentedContainer}>
          <TouchableOpacity
            style={[
              styles.segmentPill,
              activeTab === 'UPCOMING' && styles.segmentPillActive,
            ]}
            activeOpacity={0.8}
            onPress={() => setActiveTab('UPCOMING')}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === 'UPCOMING' && styles.segmentTextActive,
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentPill,
              activeTab === 'COMPLETED' && styles.segmentPillActive,
            ]}
            activeOpacity={0.8}
            onPress={() => setActiveTab('COMPLETED')}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === 'COMPLETED' && styles.segmentTextActive,
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentPill,
              activeTab === 'CANCELLED' && styles.segmentPillActive,
            ]}
            activeOpacity={0.8}
            onPress={() => setActiveTab('CANCELLED')}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === 'CANCELLED' && styles.segmentTextActive,
              ]}
            >
              Cancelled
            </Text>
          </TouchableOpacity>
        </View>

        {/* ============================================================ */}
        {/* 5. BOOKINGS LIST CARDS                                       */}
        {/* ============================================================ */}
        <View style={styles.bookingsList}>
          {bookings.length === 0 ? (
            <View style={styles.emptyStateCard}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="calendar-outline" size={32} color={Palette.primary} />
              </View>
              <Text style={styles.emptyTitle}>No bookings found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? `No visits found matching "${searchQuery}". Try a different keyword.`
                  : activeTab === 'UPCOMING'
                  ? 'You have no upcoming home care visits scheduled at this time.'
                  : `No ${activeTab.toLowerCase()} bookings found in your history.`}
              </Text>
              {searchQuery ? (
                <TouchableOpacity
                  style={styles.clearSearchBtn}
                  onPress={() => setSearchQuery('')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.clearSearchText}>Clear Search</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : (
            bookings.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.bookingCard}
                activeOpacity={0.92}
                onPress={() => handleBookingPress(item)}
              >
                {/* --- Top Card Header: Ref & Status Badge --- */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.categoryBadge}>
                    <Ionicons
                      name={
                        item.serviceCategory.includes('Doctor')
                          ? 'medkit-outline'
                          : item.serviceCategory.includes('Nursing')
                          ? 'heart-outline'
                          : 'flask-outline'
                      }
                      size={12.5}
                      color={Palette.primary}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.categoryBadgeText}>
                      {item.serviceCategory} • {item.bookingRef}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      item.status === 'Confirmed' && styles.statusBadgeConfirmed,
                      item.status === 'Scheduled' && styles.statusBadgeScheduled,
                      item.status === 'Completed' && styles.statusBadgeCompleted,
                      item.status === 'Cancelled' && styles.statusBadgeCancelled,
                    ]}
                  >
                    <Ionicons
                      name={
                        item.status === 'Confirmed'
                          ? 'checkmark-circle'
                          : item.status === 'Scheduled'
                          ? 'time'
                          : item.status === 'Completed'
                          ? 'checkmark-done-circle'
                          : 'close-circle'
                      }
                      size={12}
                      color={
                        item.status === 'Confirmed'
                          ? Palette.confirmedText
                          : item.status === 'Scheduled'
                          ? Palette.scheduledText
                          : item.status === 'Completed'
                          ? Palette.completedText
                          : Palette.cancelledText
                      }
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={[
                        styles.statusBadgeText,
                        item.status === 'Confirmed' && styles.statusTextConfirmed,
                        item.status === 'Scheduled' && styles.statusTextScheduled,
                        item.status === 'Completed' && styles.statusTextCompleted,
                        item.status === 'Cancelled' && styles.statusTextCancelled,
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>

                {/* --- Clinician / Service Profile Row --- */}
                <View style={styles.clinicianProfileRow}>
                  <View style={styles.avatarContainer}>
                    <Image
                      source={item.avatar}
                      style={styles.clinicianAvatar}
                      resizeMode="cover"
                    />
                    {item.status !== 'Cancelled' && (
                      <View style={styles.verifiedDot}>
                        <Ionicons name="shield-checkmark" size={10} color="#FFFFFF" />
                      </View>
                    )}
                  </View>

                  <View style={styles.cardDetailsCol}>
                    <Text style={styles.serviceTitleText}>{item.serviceTitle}</Text>
                    <Text style={styles.providerNameText}>{item.providerName}</Text>
                    <Text style={styles.providerSpecialtyText}>{item.providerSpecialty}</Text>
                  </View>

                  <Ionicons name="chevron-forward" size={18} color="#9DB0A7" style={{ marginLeft: 6 }} />
                </View>

                {/* --- Schedule & Location Info Box --- */}
                <View style={styles.infoBox}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconWrap}>
                      <Ionicons name="calendar-outline" size={14} color={Palette.primary} />
                    </View>
                    <Text style={styles.infoRowText}>
                      <Text style={styles.infoRowLabel}>Date: </Text>
                      {item.date}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.infoIconWrap}>
                      <Ionicons name="time-outline" size={14} color={Palette.primary} />
                    </View>
                    <Text style={styles.infoRowText}>
                      <Text style={styles.infoRowLabel}>Slot: </Text>
                      {item.time}
                    </Text>
                  </View>

                  {item.address ? (
                    <View style={styles.infoRow}>
                      <View style={styles.infoIconWrap}>
                        <Ionicons name="location-outline" size={14} color={Palette.primary} />
                      </View>
                      <Text style={styles.infoRowText} numberOfLines={1}>
                        <Text style={styles.infoRowLabel}>At: </Text>
                        {item.address}
                      </Text>
                    </View>
                  ) : null}

                  {/* Bedside verification PIN indicator for active/confirmed visits */}
                  {item.securityPin && item.status === 'Confirmed' && (
                    <View style={styles.securityPinRow}>
                      <View style={styles.pinTagWrap}>
                        <Ionicons name="key-outline" size={13} color={Palette.primary} style={{ marginRight: 5 }} />
                        <Text style={styles.pinTagLabel}>Doorstep Verification PIN:</Text>
                        <Text style={styles.pinTagCode}>{item.securityPin}</Text>
                      </View>
                      <Text style={styles.pinTagHint}>Share with clinician</Text>
                    </View>
                  )}

                  {/* Cancellation notice */}
                  {item.cancellationReason && (
                    <View style={styles.cancellationNoticeRow}>
                      <Ionicons name="information-circle" size={14} color={Palette.cancelledText} style={{ marginRight: 5 }} />
                      <Text style={styles.cancellationNoticeText}>{item.cancellationReason}</Text>
                    </View>
                  )}
                </View>

                {/* --- Bottom Card Action Bar --- */}
                <View style={styles.cardActionsRow}>
                  {activeTab === 'UPCOMING' ? (
                    <>
                      <TouchableOpacity
                        style={styles.actionBtnOutline}
                        activeOpacity={0.7}
                        onPress={() => handleBookingPress(item)}
                      >
                        <Ionicons name="calendar-outline" size={14} color={Palette.textDark} style={{ marginRight: 5 }} />
                        <Text style={styles.actionBtnOutlineText}>Reschedule</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionBtnPrimary}
                        activeOpacity={0.75}
                        onPress={() => handleBookingPress(item)}
                      >
                        <Text style={styles.actionBtnPrimaryText}>View Details</Text>
                        <Ionicons name="arrow-forward" size={14} color="#FFFFFF" style={{ marginLeft: 5 }} />
                      </TouchableOpacity>
                    </>
                  ) : activeTab === 'COMPLETED' ? (
                    <>
                      <TouchableOpacity
                        style={styles.actionBtnOutline}
                        activeOpacity={0.7}
                        onPress={() => handleDownloadPrescription(item.bookingRef)}
                      >
                        <Ionicons name="document-text-outline" size={14} color={Palette.textDark} style={{ marginRight: 5 }} />
                        <Text style={styles.actionBtnOutlineText}>Prescription</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionBtnPrimary}
                        activeOpacity={0.75}
                        onPress={() => router.push('/(tabs)/services')}
                      >
                        <Ionicons name="refresh-outline" size={14} color="#FFFFFF" style={{ marginRight: 5 }} />
                        <Text style={styles.actionBtnPrimaryText}>Book Again</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.actionBtnOutline}
                        activeOpacity={0.7}
                        onPress={handleCallSupport}
                      >
                        <Ionicons name="help-buoy-outline" size={14} color={Palette.textDark} style={{ marginRight: 5 }} />
                        <Text style={styles.actionBtnOutlineText}>Refund Support</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionBtnPrimary}
                        activeOpacity={0.75}
                        onPress={() => router.push('/(tabs)/services')}
                      >
                        <Text style={styles.actionBtnPrimaryText}>Rebook Service</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* ============================================================ */}
        {/* 6. "+ Book a New Service" PROMINENT CTA BUTTON               */}
        {/* ============================================================ */}
        <TouchableOpacity
          style={styles.bookNewServiceBtn}
          activeOpacity={0.88}
          onPress={() => router.push('/(tabs)/services')}
        >
          <View style={styles.btnIconCircle}>
            <Ionicons name="add" size={20} color={Palette.primary} />
          </View>
          <Text style={styles.bookNewServiceText}>Book a New Service</Text>
          <Ionicons name="chevron-forward" size={18} color="#FFFFFF" style={{ opacity: 0.8 }} />
        </TouchableOpacity>

        {/* ============================================================ */}
        {/* 7. 24/7 CARE CONCIERGE & SUPPORT ASSISTANCE CARD            */}
        {/* ============================================================ */}
        <View style={styles.supportCard}>
          <View style={styles.supportCardHeader}>
            <View style={styles.supportIconBadge}>
              <Ionicons name="headset" size={20} color={Palette.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.supportTitle}>24/7 Home Care Helpdesk</Text>
              <Text style={styles.supportSubtitle}>
                Need to modify visit timings or consult our medical coordinator?
              </Text>
            </View>
          </View>

          <View style={styles.supportActionsRow}>
            <TouchableOpacity
              style={styles.supportCallBtn}
              activeOpacity={0.8}
              onPress={handleCallSupport}
            >
              <Ionicons name="call" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.supportCallBtnText}>Call Care Desk</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.supportFaqBtn}
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/account')}
            >
              <Ionicons name="chatbubbles-outline" size={15} color={Palette.primary} style={{ marginRight: 6 }} />
              <Text style={styles.supportFaqBtnText}>Help Center</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 8. VISIT PREPARATION & SAFETY CHECKLIST                     */}
        {/* ============================================================ */}
        <View style={styles.guidelinesCard}>
          <View style={styles.guidelinesTitleRow}>
            <Ionicons name="shield-checkmark" size={18} color={Palette.primary} style={{ marginRight: 7 }} />
            <Text style={styles.guidelinesTitle}>What to expect during home visits</Text>
          </View>

          <View style={styles.checklistStep}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>Prior Call Notification</Text>
              <Text style={styles.stepDesc}>
                Your doctor or nurse will call 15 minutes before arrival to confirm the address and parking details.
              </Text>
            </View>
          </View>

          <View style={styles.checklistStep}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>Sterile & Safe Equipment</Text>
              <Text style={styles.stepDesc}>
                All medical kits, diagnostics, and sterile dressings are opened right at your bedside.
              </Text>
            </View>
          </View>

          <View style={[styles.checklistStep, { marginBottom: 0 }]}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>Doorstep PIN Authentication</Text>
              <Text style={styles.stepDesc}>
                Verify your clinician's badge and share your 4-digit Bedside PIN to initiate the clinical consultation.
              </Text>
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

  /* 1. Top Header Bar: Logo + "My Bookings" Title */
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 14,
    marginBottom: 4,
  },
  brandTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogo: {
    width: 114,
    height: 32,
  },
  brandTitleDivider: {
    width: 1.5,
    height: 18,
    backgroundColor: '#DCE9E1',
    marginHorizontal: 10,
    borderRadius: 1,
  },
  pageHeadingInline: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 17,
    fontWeight: '700',
    color: Palette.primary,
    letterSpacing: -0.2,
  },
  activeBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primaryLight,
    paddingHorizontal: 8.5,
    paddingVertical: 4.5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D2E6DA',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
    marginRight: 5,
  },
  activeBadgeText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '600',
    color: Palette.primary,
  },

  /* 3. Segmented Filter Tabs */
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: Palette.surface,
    borderRadius: 26,
    borderWidth: 1.2,
    borderColor: Palette.border,
    padding: 4,
    marginBottom: 20,
    ...Shadows.subtle,
  },
  segmentPill: {
    flex: 1,
    paddingVertical: 9.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  segmentPillActive: {
    backgroundColor: Palette.primary,
  },
  segmentText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    fontWeight: '500',
    color: Palette.textMuted,
  },
  segmentTextActive: {
    fontWeight: '600',
    color: '#FFFFFF',
  },

  /* 5. Bookings List */
  bookingsList: {
    gap: 16,
    marginBottom: 18,
  },
  bookingCard: {
    backgroundColor: Palette.surface,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: Palette.border,
    padding: 16,
    ...Shadows.subtle,
  },

  /* Card Top Row */
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderLight,
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primaryLight,
    paddingVertical: 3.5,
    paddingHorizontal: 8.5,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '600',
    color: Palette.primary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3.5,
    paddingHorizontal: 8.5,
    borderRadius: 12,
  },
  statusBadgeConfirmed: {
    backgroundColor: Palette.confirmedBg,
  },
  statusBadgeScheduled: {
    backgroundColor: Palette.scheduledBg,
  },
  statusBadgeCompleted: {
    backgroundColor: Palette.completedBg,
  },
  statusBadgeCancelled: {
    backgroundColor: Palette.cancelledBg,
  },
  statusBadgeText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '600',
  },
  statusTextConfirmed: {
    color: Palette.confirmedText,
  },
  statusTextScheduled: {
    color: Palette.scheduledText,
  },
  statusTextCompleted: {
    color: Palette.completedText,
  },
  statusTextCancelled: {
    color: Palette.cancelledText,
  },

  /* Clinician Profile Row */
  clinicianProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F3FAF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  clinicianAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  verifiedDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  cardDetailsCol: {
    flex: 1,
  },
  serviceTitleText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 15,
    fontWeight: '600',
    color: Palette.textDark,
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  providerNameText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    fontWeight: '500',
    color: Palette.primary,
    marginBottom: 2,
  },
  providerSpecialtyText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11.5,
    fontWeight: '400',
    color: Palette.textMuted,
  },

  /* Info Box */
  infoBox: {
    backgroundColor: Palette.boxBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3EFE8',
    padding: 10,
    marginBottom: 14,
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconWrap: {
    width: 22,
    alignItems: 'center',
    marginRight: 5,
  },
  infoRowLabel: {
    fontWeight: '500',
    color: Palette.textDark,
  },
  infoRowText: {
    flex: 1,
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    color: Palette.textDark,
    fontWeight: '400',
  },
  securityPinRow: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#DEEBE3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pinTagWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinTagLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11.5,
    fontWeight: '500',
    color: Palette.textDark,
    marginRight: 6,
  },
  pinTagCode: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    fontWeight: '600',
    color: Palette.primary,
    letterSpacing: 2,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C9E1D4',
  },
  pinTagHint: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 10.5,
    fontWeight: '400',
    color: Palette.textMuted,
  },
  cancellationNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F4D4D4',
  },
  cancellationNoticeText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '500',
    color: Palette.cancelledText,
  },

  /* Card Actions Row */
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionBtnOutline: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.2,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnOutlineText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    fontWeight: '600',
    color: Palette.textDark,
  },
  actionBtnPrimary: {
    flex: 1.2,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPrimaryText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  /* Empty State */
  emptyStateCard: {
    backgroundColor: Palette.surface,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: Palette.border,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 16,
    fontWeight: '600',
    color: Palette.textDark,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    fontWeight: '400',
    color: Palette.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  clearSearchBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Palette.primaryLight,
  },
  clearSearchText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    fontWeight: '600',
    color: Palette.primary,
  },

  /* 6. Book a New Service Button */
  bookNewServiceBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: Palette.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
    ...Shadows.subtle,
  },
  btnIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookNewServiceText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 14.5,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  /* 7. 24/7 Support Card */
  supportCard: {
    backgroundColor: Palette.surface,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: Palette.border,
    padding: 16,
    marginBottom: 18,
    ...Shadows.subtle,
  },
  supportCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  supportIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 14,
    fontWeight: '600',
    color: Palette.primary,
    marginBottom: 2,
  },
  supportSubtitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '400',
    color: Palette.textMuted,
    lineHeight: 16,
  },
  supportActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  supportCallBtn: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportCallBtnText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  supportFaqBtn: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.2,
    borderColor: Palette.border,
    backgroundColor: Palette.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportFaqBtnText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    fontWeight: '600',
    color: Palette.primary,
  },

  /* 8. Guidelines Checklist Card */
  guidelinesCard: {
    backgroundColor: Palette.surface,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: Palette.border,
    padding: 16,
    ...Shadows.subtle,
  },
  guidelinesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  guidelinesTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 14,
    fontWeight: '600',
    color: Palette.primary,
    letterSpacing: -0.2,
  },
  checklistStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumberBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  stepNumberText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '600',
    color: Palette.primary,
  },
  stepTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    fontWeight: '600',
    color: Palette.textDark,
    marginBottom: 2,
  },
  stepDesc: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11.5,
    fontWeight: '400',
    color: Palette.textMuted,
    lineHeight: 16,
  },
});
