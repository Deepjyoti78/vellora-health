import React, { useState, useMemo, useRef, useSyncExternalStore } from 'react';
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
  Modal,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Shadows } from '../../constants/theme';
import { RECENT_BOOKINGS, REGIONAL_CONFIG, subscribeBookings, getBookingRevision, rescheduleBooking } from '../../data/mockData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  badgeDot: '#E53E3E',       // Red notification dot
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
    providerRating: 'Demo rating',
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
    paymentStatus: 'Demo history — payment unverified',
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
  const revision = useSyncExternalStore(subscribeBookings, getBookingRevision, getBookingRevision);
  const [activeTab, setActiveTab] = useState<FilterTab>('UPCOMING');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Details Modal Popup State
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingItemDisplay | null>(null);
  const sheetAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  // Dedicated Reschedule Modal State
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [reschedulingBooking, setReschedulingBooking] = useState<BookingItemDisplay | null>(null);
  const [selectedRescheduleDate, setSelectedRescheduleDate] = useState<string>('Tomorrow, 19 Nov');
  const [selectedRescheduleSlot, setSelectedRescheduleSlot] = useState<string>('11:00 AM – 11:30 AM');
  const [rescheduleReason, setRescheduleReason] = useState<string>('Time Conflict');

  const handleOpenReschedule = (booking: BookingItemDisplay | null) => {
    if (!booking) return;
    setReschedulingBooking(booking);
    setSelectedRescheduleDate('Tomorrow, 19 Nov');
    setSelectedRescheduleSlot('11:00 AM – 11:30 AM');
    setRescheduleReason('Time Conflict');
    closeDetailsModal();
    setRescheduleModalVisible(true);
  };

  const handleConfirmReschedule = () => {
    if (!reschedulingBooking) return;
    const ok = rescheduleBooking(reschedulingBooking.id, selectedRescheduleDate, selectedRescheduleSlot);
    if (!ok && reschedulingBooking.routeId) {
      rescheduleBooking(reschedulingBooking.routeId, selectedRescheduleDate, selectedRescheduleSlot);
    }
    setRescheduleModalVisible(false);
    Alert.alert(
      'Visit Rescheduled Successfully!',
      `Your doorstep visit for "${reschedulingBooking.serviceTitle}" is now scheduled for ${selectedRescheduleDate} at ${selectedRescheduleSlot}. Your assigned clinician has received the update.`,
      [{ text: 'OK' }]
    );
  };

  const openDetailsModal = (booking: BookingItemDisplay) => {
    setSelectedBooking(booking);
    setDetailsModalVisible(true);
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(sheetAnim, {
        toValue: 0,
        friction: 8,
        tension: 65,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDetailsModal = () => {
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(sheetAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDetailsModalVisible(false);
      setSelectedBooking(null);
    });
  };

  const bookingItems = useMemo(() => {
    const dynamicBookings: BookingItemDisplay[] = RECENT_BOOKINGS.map((b) => ({
      id: b.id,
      bookingRef: b.id,
      serviceCategory: 'Home Visit Service',
      serviceTitle: b.serviceTitle,
      providerName: b.assignedClinician?.name || 'Assignment pending',
      providerSpecialty: b.assignedClinician?.title || 'Demo service request',
      providerRating: b.assignedClinician ? String(b.assignedClinician.rating) : 'Not assigned',
      date: b.scheduledDate,
      time: b.scheduledTimeSlot,
      status: b.status === 'CANCELLED' ? 'Cancelled' : b.status === 'COMPLETED' ? 'Completed' : b.status === 'REQUESTED' ? 'Scheduled' : 'Confirmed',
      avatar: b.assignedClinician?.avatar || require('../../../assets/images/doctor-rohan.png'),
      routeId: b.id,
      address: b.address,
      amount: `₹${b.totalPrice.toLocaleString('en-IN')}`,
      paymentStatus: b.paymentMethod || 'Demo — payment unverified',
      securityPin: b.securityPin || '4829',
    }));

    return dynamicBookings;
  }, [revision]);

  const getBookingsList = () => {
    let list: BookingItemDisplay[] = [];
    switch (activeTab) {
      case 'UPCOMING':
        list = bookingItems.filter(b => b.status !== 'Cancelled' && b.status !== 'Completed');
        break;
      case 'COMPLETED':
        list = [...bookingItems.filter(b => b.status === 'Completed')];
        break;
      case 'CANCELLED':
        list = [...bookingItems.filter(b => b.status === 'Cancelled')];
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
    Alert.alert('Prescription Ready', `Demo record for ${ref}. Prescription export requires a live document service.`, [
      { text: 'View Records', onPress: () => router.push('/(tabs)/records') },
      { text: 'OK', style: 'default' },
    ]);
  };

  const bookings = getBookingsList();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      {/* Ambient Background Glow Orbs */}
      <View style={styles.ambientGlowTopRight} pointerEvents="none" />
      <View style={styles.ambientGlowMidLeft} pointerEvents="none" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ============================================================ */}
        {/* 1. TOP BRAND BAR (Logo + Notifications + Add Visit)          */}
        {/* ============================================================ */}
        <View style={styles.topBrandBar}>
          <TouchableOpacity accessibilityRole="button"
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
            <TouchableOpacity accessibilityRole="button"
              style={styles.bellBtn}
              activeOpacity={0.75}
              onPress={() => Alert.alert('Notifications', 'All your upcoming home visit reminders are active.')}
              accessibilityLabel="View notifications"
            >
              <Ionicons name="notifications-outline" size={20} color={Palette.textDark} />
              <View style={styles.bellBadgeDot} />
            </TouchableOpacity>

            <TouchableOpacity accessibilityRole="button"
              style={styles.plusBtn}
              activeOpacity={0.75}
              onPress={() => router.push('/(tabs)/services')}
              accessibilityLabel="Book new visit"
            >
              <Ionicons name="add" size={22} color={Palette.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 2. HERO SECTION: "My Bookings" + HOUSE/GARDEN ILLUSTRATION   */}
        {/* ============================================================ */}
        <View style={styles.heroSection}>
          <View style={styles.heroTextCol}>
            <Text style={styles.heroTitle}>My Bookings</Text>
            <Text style={styles.heroSubtitle}>
              Track your doctor visits, nursing,{'\n'}and bedside clinical care.
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
        {/* 3. SEGMENTED FILTER TABS: Upcoming | Completed | Cancelled   */}
        {/* ============================================================ */}
        <View style={styles.segmentedContainer}>
          <TouchableOpacity accessibilityRole="button"
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

          <TouchableOpacity accessibilityRole="button"
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

          <TouchableOpacity accessibilityRole="button"
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
                <TouchableOpacity accessibilityRole="button"
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
              <View
                key={item.id}
                style={styles.bookingCard}
              >
                {/* --- Top Card Header: Ref & Status Badge --- */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.categoryBadge}>
                    <Ionicons
                      name="receipt-outline"
                      size={12.5}
                      color={Palette.primary}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.categoryBadgeText} numberOfLines={1}>
                      {item.bookingRef.startsWith('#') ? item.bookingRef : `#${item.bookingRef}`}
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
                <TouchableOpacity
                  style={styles.clinicianProfileRow}
                  activeOpacity={0.8}
                  onPress={() => openDetailsModal(item)}
                >
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
                </TouchableOpacity>

                {/* --- Essential Schedule Pill (Compact & Clean) --- */}
                <View style={styles.compactScheduleRow}>
                  <View style={styles.compactScheduleItem}>
                    <Ionicons name="calendar-outline" size={13.5} color={Palette.primary} style={{ marginRight: 5 }} />
                    <Text style={styles.compactScheduleText}>{item.date}</Text>
                  </View>
                  <View style={styles.compactScheduleDot} />
                  <View style={styles.compactScheduleItem}>
                    <Ionicons name="time-outline" size={13.5} color={Palette.primary} style={{ marginRight: 5 }} />
                    <Text style={styles.compactScheduleText}>{item.time}</Text>
                  </View>
                </View>

                {/* --- Bottom Card Action: Single "View Details →" --- */}
                <View style={styles.cardActionsRow}>
                  <TouchableOpacity
                    style={styles.actionBtnPrimary}
                    activeOpacity={0.75}
                    onPress={() => openDetailsModal(item)}
                  >
                    <Text style={styles.actionBtnPrimaryText}>View Details</Text>
                    <Ionicons name="arrow-forward" size={14} color={Palette.primary} style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* ============================================================ */}
        {/* 6. "+ Book a New Service" PROMINENT CTA BUTTON               */}
        {/* ============================================================ */}
        <TouchableOpacity accessibilityRole="button"
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
            <TouchableOpacity accessibilityRole="button"
              style={styles.supportCallBtn}
              activeOpacity={0.8}
              onPress={handleCallSupport}
            >
              <Ionicons name="call" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.supportCallBtnText}>Call Care Desk</Text>
            </TouchableOpacity>

            <TouchableOpacity accessibilityRole="button"
              style={styles.supportFaqBtn}
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/account')}
            >
              <Ionicons name="chatbubbles-outline" size={15} color={Palette.primary} style={{ marginRight: 6 }} />
              <Text style={styles.supportFaqBtnText}>Help Center</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ============================================================ */}
      {/* 9. BOOKING DETAILS BOTTOM SHEET / POPUP MODAL               */}
      {/* ============================================================ */}
      <Modal
        visible={detailsModalVisible}
        transparent
        animationType="none"
        onRequestClose={closeDetailsModal}
      >
        <View style={styles.modalBackdropContainer}>
          {/* Dimmed backdrop */}
          <Pressable style={StyleSheet.absoluteFill} onPress={closeDetailsModal}>
            <Animated.View
              style={[
                styles.modalDimmedBackdrop,
                {
                  opacity: backdropAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.6],
                  }),
                },
              ]}
            />
          </Pressable>

          {/* Slide-Up Bottom Sheet Card */}
          <Animated.View
            style={[
              styles.modalSheetCard,
              {
                transform: [{ translateY: sheetAnim }],
              },
            ]}
          >
            {/* Drag handle */}
            <View style={styles.modalHandleWrap}>
              <View style={styles.modalHandleBar} />
            </View>

            {/* Modal Header */}
            <View style={styles.modalHeaderRow}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={styles.modalHeaderTitle}>Booking Details</Text>
                <Text style={styles.modalHeaderSubtitle} numberOfLines={1}>
                  {selectedBooking?.bookingRef.startsWith('#')
                    ? selectedBooking?.bookingRef
                    : `#${selectedBooking?.bookingRef}`}
                </Text>
              </View>

              <TouchableOpacity accessibilityRole="button"
                onPress={closeDetailsModal}
                style={styles.modalCloseCircle}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color={Palette.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScrollArea}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {selectedBooking && (
                <>
                  {/* Status & Service Banner */}
                  <View style={styles.modalStatusBanner}>
                    <View style={styles.modalStatusLeft}>
                      <View
                        style={[
                          styles.statusBadge,
                          selectedBooking.status === 'Confirmed' && styles.statusBadgeConfirmed,
                          selectedBooking.status === 'Scheduled' && styles.statusBadgeScheduled,
                          selectedBooking.status === 'Completed' && styles.statusBadgeCompleted,
                          selectedBooking.status === 'Cancelled' && styles.statusBadgeCancelled,
                        ]}
                      >
                        <Ionicons
                          name={
                            selectedBooking.status === 'Confirmed'
                              ? 'checkmark-circle'
                              : selectedBooking.status === 'Scheduled'
                              ? 'time'
                              : selectedBooking.status === 'Completed'
                              ? 'checkmark-done-circle'
                              : 'close-circle'
                          }
                          size={13}
                          color={
                            selectedBooking.status === 'Confirmed'
                              ? Palette.confirmedText
                              : selectedBooking.status === 'Scheduled'
                              ? Palette.scheduledText
                              : selectedBooking.status === 'Completed'
                              ? Palette.completedText
                              : Palette.cancelledText
                          }
                          style={{ marginRight: 4 }}
                        />
                        <Text
                          style={[
                            styles.statusBadgeText,
                            selectedBooking.status === 'Confirmed' && styles.statusTextConfirmed,
                            selectedBooking.status === 'Scheduled' && styles.statusTextScheduled,
                            selectedBooking.status === 'Completed' && styles.statusTextCompleted,
                            selectedBooking.status === 'Cancelled' && styles.statusTextCancelled,
                          ]}
                        >
                          {selectedBooking.status}
                        </Text>
                      </View>
                      <Text style={styles.modalRefText}>Ref: {selectedBooking.bookingRef}</Text>
                    </View>
                    <Text style={styles.modalAmountText}>{selectedBooking.amount}</Text>
                  </View>

                  {/* Clinician Card */}
                  <View style={styles.modalClinicianCard}>
                    <Image
                      source={selectedBooking.avatar}
                      style={styles.modalClinicianAvatar}
                      resizeMode="cover"
                    />
                    <View style={styles.modalClinicianInfo}>
                      <Text style={styles.modalServiceTitle}>{selectedBooking.serviceTitle}</Text>
                      <Text style={styles.modalDoctorName}>{selectedBooking.providerName}</Text>
                      <Text style={styles.modalDoctorSpecialty}>{selectedBooking.providerSpecialty}</Text>
                      <View style={styles.modalRatingRow}>
                        <Ionicons name="star" size={13} color="#F59E0B" style={{ marginRight: 4 }} />
                        <Text style={styles.modalRatingText}>{selectedBooking.providerRating}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Doorstep Verification PIN Box (for confirmed active visits) */}
                  {selectedBooking.securityPin && selectedBooking.status === 'Confirmed' && (
                    <View style={styles.modalPinCard}>
                      <View style={styles.modalPinTopRow}>
                        <View style={styles.modalPinIconCircle}>
                          <Ionicons name="key" size={16} color={Palette.primary} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text style={styles.modalPinTitle}>Doorstep Verification PIN</Text>
                          <Text style={styles.modalPinSubtitle}>Share with visiting clinician to start visit</Text>
                        </View>
                      </View>

                      <View style={styles.modalPinDigitsRow}>
                        {selectedBooking.securityPin.split('').map((digit, i) => (
                          <View key={i} style={styles.modalPinBox}>
                            <Text style={styles.modalPinDigit}>{digit}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* ======================================================== */}
                  {/* SCHEDULE & TIMING HERO CARD (EMPHASIZED DATE & TIME)     */}
                  {/* ======================================================== */}
                  <View style={styles.scheduleHeroCard}>
                    <View style={styles.scheduleCardHeader}>
                      <View style={styles.scheduleHeaderLeft}>
                        <View style={styles.scheduleIconBadge}>
                          <Ionicons name="calendar-clear" size={15} color={Palette.primary} />
                        </View>
                        <Text style={styles.scheduleHeaderTitle}>SCHEDULE & TIMING</Text>
                      </View>
                      <View style={styles.confirmedSlotPill}>
                        <Ionicons name="checkmark-circle" size={12} color="#059669" style={{ marginRight: 3 }} />
                        <Text style={styles.confirmedSlotText}>Confirmed Slot</Text>
                      </View>
                    </View>

                    <View style={styles.scheduleHighlightGrid}>
                      {/* Emphasized Date Tile */}
                      <View style={styles.scheduleTile}>
                        <View style={styles.tileHeaderRow}>
                          <Ionicons name="calendar-outline" size={13} color={Palette.primary} style={{ marginRight: 5 }} />
                          <Text style={styles.tileCategoryLabel}>SCHEDULED DATE</Text>
                        </View>
                        <Text style={styles.tileDateEmphasized}>{selectedBooking.date}</Text>
                        <View style={styles.tilePillTag}>
                          <Ionicons name="shield-checkmark" size={11} color="#059669" style={{ marginRight: 3 }} />
                          <Text style={styles.tilePillTagText}>Doctor arriving at doorstep</Text>
                        </View>
                      </View>

                      {/* Emphasized Time Slot Tile */}
                      <View style={styles.scheduleTile}>
                        <View style={styles.tileHeaderRow}>
                          <Ionicons name="time-outline" size={13} color={Palette.primary} style={{ marginRight: 5 }} />
                          <Text style={styles.tileCategoryLabel}>VISIT TIME SLOT</Text>
                        </View>
                        <Text style={styles.tileTimeEmphasized}>{selectedBooking.time}</Text>
                        <View style={styles.tilePillTag}>
                          <Ionicons name="hourglass-outline" size={11} color={Palette.primary} style={{ marginRight: 3 }} />
                          <Text style={styles.tilePillTagText}>30-minute consultation</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* ======================================================== */}
                  {/* PATIENT LOCATION CARD (UPGRADED UI/UX)                  */}
                  {/* ======================================================== */}
                  {selectedBooking.address && (
                    <View style={styles.locationHeroCard}>
                      <View style={styles.locationHeaderRow}>
                        <View style={styles.locationIconWrap}>
                          <Ionicons name="location" size={16} color={Palette.primary} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text style={styles.locationHeaderTitle}>PATIENT LOCATION</Text>
                          <Text style={styles.locationSubheading}>Confirmed Doorstep Address</Text>
                        </View>
                        <View style={styles.homeVisitBadge}>
                          <Ionicons name="home" size={11} color={Palette.primary} style={{ marginRight: 4 }} />
                          <Text style={styles.homeVisitBadgeText}>Home Visit</Text>
                        </View>
                      </View>

                      {/* Prominent Address Block */}
                      <View style={styles.addressDisplayBox}>
                        <View style={styles.addressPinIndicator}>
                          <View style={styles.addressPinDot} />
                          <View style={styles.addressPinLine} />
                        </View>
                        <View style={styles.addressTextContent}>
                          <Text style={styles.addressPrimaryLine}>
                            {selectedBooking.address.split(',').slice(0, 2).join(',').trim()}
                          </Text>
                          <Text style={styles.addressSecondaryLine}>
                            {selectedBooking.address.split(',').slice(2).join(',').trim() || selectedBooking.address}
                          </Text>
                        </View>
                      </View>

                      {/* Route & GPS Note */}
                      <View style={styles.locationFooterNote}>
                        <Ionicons name="navigate-circle-outline" size={16} color={Palette.primary} style={{ marginRight: 6 }} />
                        <Text style={styles.locationFooterNoteText}>
                          Clinician routes directly via GPS • Pre-arrival call 15 mins prior
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Payment & Invoice Summary */}
                  <View style={styles.modalSectionCard}>
                    <Text style={styles.modalSectionHeading}>Payment Details</Text>
                    <View style={styles.modalPaymentRow}>
                      <Text style={styles.modalPaymentLabel}>Consultation & Kit Fee</Text>
                      <Text style={styles.modalPaymentValue}>{selectedBooking.amount}</Text>
                    </View>
                    <View style={styles.modalPaymentRow}>
                      <Text style={styles.modalPaymentLabel}>Doorstep Convenience</Text>
                      <Text style={[styles.modalPaymentValue, { color: '#059669' }]}>FREE</Text>
                    </View>
                    <View style={[styles.modalPaymentRow, styles.modalPaymentTotalRow]}>
                      <Text style={styles.modalPaymentTotalLabel}>Total Paid</Text>
                      <Text style={styles.modalPaymentTotalValue}>{selectedBooking.amount}</Text>
                    </View>
                    <View style={styles.modalPaymentStatusTag}>
                      <Ionicons name="checkmark-circle" size={13} color="#059669" style={{ marginRight: 5 }} />
                      <Text style={styles.modalPaymentStatusText}>{selectedBooking.paymentStatus}</Text>
                    </View>
                  </View>

                  {/* Cancellation Reason if cancelled */}
                  {selectedBooking.cancellationReason && (
                    <View style={styles.modalCancellationCard}>
                      <Ionicons name="information-circle" size={18} color={Palette.cancelledText} style={{ marginRight: 8 }} />
                      <Text style={styles.modalCancellationText}>{selectedBooking.cancellationReason}</Text>
                    </View>
                  )}

                  {/* Action Buttons inside the Popup */}
                  <View style={styles.modalActionsContainer}>
                    {activeTab === 'UPCOMING' ? (
                      <>
                        <TouchableOpacity accessibilityRole="button"
                          style={styles.modalRescheduleBtn}
                          activeOpacity={0.8}
                          onPress={() => handleOpenReschedule(selectedBooking)}
                        >
                          <Ionicons name="calendar-outline" size={16} color={Palette.primary} style={{ marginRight: 6 }} />
                          <Text style={styles.modalRescheduleBtnText}>Reschedule Visit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity accessibilityRole="button"
                          style={styles.modalSupportBtn}
                          activeOpacity={0.8}
                          onPress={handleCallSupport}
                        >
                          <Ionicons name="call" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                          <Text style={styles.modalSupportBtnText}>Call Care Coordinator</Text>
                        </TouchableOpacity>
                      </>
                    ) : activeTab === 'COMPLETED' ? (
                      <>
                        <TouchableOpacity accessibilityRole="button"
                          style={styles.modalRescheduleBtn}
                          activeOpacity={0.8}
                          onPress={() => {
                            closeDetailsModal();
                            handleDownloadPrescription(selectedBooking.bookingRef);
                          }}
                        >
                          <Ionicons name="document-text-outline" size={16} color={Palette.primary} style={{ marginRight: 6 }} />
                          <Text style={styles.modalRescheduleBtnText}>Download Prescription</Text>
                        </TouchableOpacity>

                        <TouchableOpacity accessibilityRole="button"
                          style={styles.modalSupportBtn}
                          activeOpacity={0.8}
                          onPress={() => {
                            closeDetailsModal();
                            router.push('/(tabs)/services');
                          }}
                        >
                          <Ionicons name="refresh" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                          <Text style={styles.modalSupportBtnText}>Book Again</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <TouchableOpacity accessibilityRole="button"
                          style={styles.modalRescheduleBtn}
                          activeOpacity={0.8}
                          onPress={handleCallSupport}
                        >
                          <Ionicons name="help-buoy-outline" size={16} color={Palette.primary} style={{ marginRight: 6 }} />
                          <Text style={styles.modalRescheduleBtnText}>Refund Support</Text>
                        </TouchableOpacity>

                        <TouchableOpacity accessibilityRole="button"
                          style={styles.modalSupportBtn}
                          activeOpacity={0.8}
                          onPress={() => {
                            closeDetailsModal();
                            router.push('/(tabs)/services');
                          }}
                        >
                          <Ionicons name="refresh" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                          <Text style={styles.modalSupportBtnText}>Rebook Service</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </>
              )}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

      {/* ============================================================ */}
      {/* RESCHEDULE VISIT POP-UP MODAL                                */}
      {/* ============================================================ */}
      <Modal
        visible={rescheduleModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setRescheduleModalVisible(false)}
      >
        <View style={styles.rescheduleBackdrop}>
          <View style={styles.rescheduleSheetContainer}>
            <View style={styles.rescheduleSheetHandle} />

            {/* Header */}
            <View style={styles.rescheduleHeaderRow}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.rescheduleSheetTitle}>Reschedule Visit</Text>
                <Text style={styles.rescheduleSheetSubtitle}>
                  {reschedulingBooking?.serviceTitle} • {reschedulingBooking?.bookingRef}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseCircle}
                onPress={() => setRescheduleModalVisible(false)}
              >
                <Ionicons name="close" size={20} color={Palette.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
              {/* Current Scheduled Timing Card */}
              <View style={styles.currentScheduleCard}>
                <Ionicons name="calendar" size={18} color="#0F5B43" style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.currentScheduleLabel}>Currently Scheduled Timing</Text>
                  <Text style={styles.currentScheduleValue}>
                    {reschedulingBooking?.date} • {reschedulingBooking?.time}
                  </Text>
                </View>
              </View>

              {/* 1. Date Selector */}
              <Text style={styles.rescheduleSectionTitle}>1. Choose New Visit Date</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScroll}>
                {[
                  { label: 'Today', date: 'Today, 18 Nov' },
                  { label: 'Tomorrow', date: 'Tomorrow, 19 Nov' },
                  { label: 'Thursday', date: 'Thu, 20 Nov' },
                  { label: 'Friday', date: 'Fri, 21 Nov' },
                  { label: 'Saturday', date: 'Sat, 22 Nov' },
                  { label: 'Sunday', date: 'Sun, 23 Nov' },
                  { label: 'Monday', date: 'Mon, 24 Nov' },
                ].map((d) => {
                  const isSel = selectedRescheduleDate === d.date;
                  return (
                    <TouchableOpacity
                      key={d.date}
                      style={[styles.rescheduleDatePill, isSel && styles.rescheduleDatePillActive]}
                      onPress={() => setSelectedRescheduleDate(d.date)}
                    >
                      <Text style={[styles.rescheduleDateLabel, isSel && styles.rescheduleDateLabelActive]}>
                        {d.label}
                      </Text>
                      <Text style={[styles.rescheduleDateText, isSel && styles.rescheduleDateTextActive]}>
                        {d.date.includes(',') ? d.date.split(', ')[1] : d.date}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* 2. Time Slot Selector */}
              <Text style={styles.rescheduleSectionTitle}>2. Choose Doorstep Time Slot</Text>
              <View style={styles.slotsGrid}>
                {[
                  '09:00 AM – 09:30 AM',
                  '10:30 AM – 11:00 AM',
                  '11:00 AM – 11:30 AM',
                  '02:00 PM – 02:30 PM',
                  '03:30 PM – 04:00 PM',
                  '04:30 PM – 05:00 PM',
                  '06:00 PM – 06:30 PM',
                  '07:00 PM – 07:30 PM',
                ].map((slot) => {
                  const isSel = selectedRescheduleSlot === slot;
                  return (
                    <TouchableOpacity
                      key={slot}
                      style={[styles.rescheduleSlotPill, isSel && styles.rescheduleSlotPillActive]}
                      onPress={() => setSelectedRescheduleSlot(slot)}
                    >
                      <Ionicons
                        name="time-outline"
                        size={12}
                        color={isSel ? '#FFFFFF' : Palette.primary}
                        style={{ marginRight: 4 }}
                      />
                      <Text style={[styles.rescheduleSlotText, isSel && styles.rescheduleSlotTextActive]}>
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* 3. Reason for Reschedule */}
              <Text style={styles.rescheduleSectionTitle}>3. Reason for Rescheduling</Text>
              <View style={styles.reasonsRow}>
                {['Time Conflict', 'Doctor Unavailable', 'Personal Emergency', 'Delaying Visit'].map((r) => {
                  const isSel = rescheduleReason === r;
                  return (
                    <TouchableOpacity
                      key={r}
                      style={[styles.reasonChip, isSel && styles.reasonChipActive]}
                      onPress={() => setRescheduleReason(r)}
                    >
                      <Text style={[styles.reasonChipText, isSel && styles.reasonChipTextActive]}>{r}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Action Buttons */}
              <TouchableOpacity
                style={styles.confirmRescheduleBtn}
                activeOpacity={0.85}
                onPress={handleConfirmReschedule}
              >
                <Ionicons name="calendar-outline" size={17} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.confirmRescheduleBtnText}>Confirm New Visit Timing</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ambientGlowTopRight: {
    position: 'absolute',
    top: -40,
    right: -50,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(15, 91, 67, 0.08)',
  },
  ambientGlowMidLeft: {
    position: 'absolute',
    top: 360,
    left: -70,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
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

  /* 1. Top Brand Header (Matching Services Page) */
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
    backgroundColor: Palette.primaryLight,
    borderWidth: 1.2,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },

  /* 2. Hero Section: "My Bookings" + Home & Garden Illustration (Matching Services Page) */
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
    width: 135,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroHouseImage: {
    width: 130,
    height: 92,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: '#D8ECE0',
    padding: 16,
    shadowColor: '#0F5B43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
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
    flexShrink: 1,
    marginRight: 8,
    maxWidth: '65%',
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
    flexShrink: 0,
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
    backgroundColor: '#F3F9F6',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D8ECE0',
    padding: 11,
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
    marginTop: 4,
  },
  compactScheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.boxBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3EFE8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  compactScheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactScheduleText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '500',
    color: Palette.textDark,
  },
  compactScheduleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#9DB0A7',
    marginHorizontal: 10,
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
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.primaryLight,
    borderWidth: 1.2,
    borderColor: '#C4E2D2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPrimaryText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    fontWeight: '600',
    color: Palette.primary,
    letterSpacing: 0.1,
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

  /* ========================================================
     BOOKING DETAILS POPUP MODAL STYLES
     ======================================================== */
  modalBackdropContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  modalDimmedBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#040F0A',
  },
  modalSheetCard: {
    width: '100%',
    maxHeight: '88%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    ...Shadows.modal,
  },
  modalHandleWrap: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  modalHandleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1DDD6',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderLight,
  },
  modalHeaderTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 18,
    fontWeight: '700',
    color: Palette.textDark,
  },
  modalHeaderSubtitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '500',
    color: Palette.textMuted,
    marginTop: 2,
  },
  modalCloseCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F4F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScrollArea: {
    maxHeight: 520,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 14,
  },
  modalStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Palette.boxBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3EFE8',
    padding: 12,
  },
  modalStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalRefText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '500',
    color: Palette.textMuted,
  },
  modalAmountText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 16,
    fontWeight: '700',
    color: Palette.primary,
  },
  modalClinicianCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: Palette.border,
    padding: 14,
    ...Shadows.subtle,
  },
  modalClinicianAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginRight: 14,
  },
  modalClinicianInfo: {
    flex: 1,
  },
  modalServiceTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textDark,
    marginBottom: 2,
  },
  modalDoctorName: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13.5,
    fontWeight: '600',
    color: Palette.primary,
    marginBottom: 2,
  },
  modalDoctorSpecialty: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11.5,
    color: Palette.textMuted,
    marginBottom: 4,
  },
  modalRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalRatingText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11.5,
    fontWeight: '600',
    color: Palette.textDark,
  },
  modalPinCard: {
    backgroundColor: '#F3FAF6',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#BFE3D1',
    padding: 14,
    alignItems: 'center',
  },
  modalPinTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  modalPinIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D9EFE4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPinTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13.5,
    fontWeight: '700',
    color: Palette.primaryDark,
  },
  modalPinSubtitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    color: Palette.textMuted,
    marginTop: 1,
  },
  modalPinDigitsRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  modalPinBox: {
    width: 44,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  modalPinDigit: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 22,
    fontWeight: '700',
    color: Palette.primaryDark,
  },
  modalSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: Palette.border,
    padding: 14,
    gap: 10,
    ...Shadows.subtle,
  },
  modalSectionHeading: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    fontWeight: '700',
    color: Palette.textDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  /* Schedule Hero Card: Emphasized Date & Time */
  scheduleHeroCard: {
    backgroundColor: '#F3FAF6',
    borderRadius: 18,
    borderWidth: 1.4,
    borderColor: '#C3E4D4',
    padding: 15,
    ...Shadows.subtle,
  },
  scheduleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scheduleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D7EFE2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  scheduleHeaderTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primaryDark,
    letterSpacing: 0.6,
  },
  confirmedSlotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7EE',
    paddingVertical: 3.5,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BDE3CE',
  },
  confirmedSlotText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  scheduleHighlightGrid: {
    gap: 10,
  },
  scheduleTile: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.2,
    borderColor: '#DBECE2',
    ...Shadows.subtle,
  },
  tileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  tileCategoryLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 10.5,
    fontWeight: '700',
    color: '#557566',
    letterSpacing: 0.5,
  },
  tileDateEmphasized: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 18,
    fontWeight: '700',
    color: Palette.primaryDark,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  tileTimeEmphasized: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 18,
    fontWeight: '700',
    color: Palette.primary,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  tilePillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3FAF6',
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 6,
  },
  tilePillTagText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '500',
    color: '#2A634C',
  },

  /* Patient Location Hero Card */
  locationHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.4,
    borderColor: Palette.border,
    padding: 15,
    ...Shadows.subtle,
  },
  locationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationHeaderTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textDark,
    letterSpacing: 0.5,
  },
  locationSubheading: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    color: Palette.textMuted,
    marginTop: 1,
  },
  homeVisitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primaryLight,
    paddingVertical: 3.5,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  homeVisitBadgeText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '600',
    color: Palette.primary,
  },
  addressDisplayBox: {
    flexDirection: 'row',
    backgroundColor: '#F7FAF8',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E1EFE7',
    marginBottom: 10,
  },
  addressPinIndicator: {
    alignItems: 'center',
    marginRight: 10,
    paddingTop: 3,
  },
  addressPinDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.primary,
  },
  addressPinLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#C5DFD1',
    marginTop: 3,
    minHeight: 20,
  },
  addressTextContent: {
    flex: 1,
  },
  addressPrimaryLine: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 15.5,
    fontWeight: '700',
    color: Palette.textDark,
    lineHeight: 21,
    marginBottom: 3,
  },
  addressSecondaryLine: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    fontWeight: '500',
    color: '#4B6156',
    lineHeight: 18,
  },
  locationFooterNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3FAF6',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  locationFooterNoteText: {
    flex: 1,
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '500',
    color: '#2A634C',
    lineHeight: 15,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  modalInfoIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  modalInfoTextCol: {
    flex: 1,
  },
  modalInfoLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    color: Palette.textMuted,
  },
  modalInfoValue: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textDark,
    marginTop: 1,
  },
  modalPaymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalPaymentLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    color: Palette.textMuted,
  },
  modalPaymentValue: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    fontWeight: '500',
    color: Palette.textDark,
  },
  modalPaymentTotalRow: {
    borderTopWidth: 1,
    borderTopColor: Palette.borderLight,
    paddingTop: 8,
    marginTop: 4,
  },
  modalPaymentTotalLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13.5,
    fontWeight: '700',
    color: Palette.textDark,
  },
  modalPaymentTotalValue: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 15,
    fontWeight: '700',
    color: Palette.primary,
  },
  modalPaymentStatusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF6ED',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  modalPaymentStatusText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11.5,
    fontWeight: '600',
    color: '#059669',
  },
  modalCancellationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.cancelledBg,
    borderRadius: 12,
    padding: 12,
  },
  modalCancellationText: {
    flex: 1,
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '500',
    color: Palette.cancelledText,
  },
  modalActionsContainer: {
    gap: 10,
    marginTop: 4,
  },
  modalRescheduleBtn: {
    height: 44,
    borderRadius: 22,
    borderWidth: 1.4,
    borderColor: Palette.primary,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalRescheduleBtnText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13.5,
    fontWeight: '600',
    color: Palette.primary,
  },
  modalSupportBtn: {
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSupportBtnText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  /* Reschedule Modal Styles */
  rescheduleBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  rescheduleSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
    maxHeight: '88%',
    ...Shadows.modal,
  },
  rescheduleSheetHandle: {
    width: 40,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 12,
  },
  rescheduleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 14,
  },
  rescheduleSheetTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  rescheduleSheetSubtitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748B',
  },
  currentScheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF5EE',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D4EADE',
    padding: 12,
    marginBottom: 16,
  },
  currentScheduleLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '500',
    color: '#4B6B5C',
    marginBottom: 2,
  },
  currentScheduleValue: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    fontWeight: '700',
    color: '#0F5B43',
  },
  rescheduleSectionTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
    marginTop: 4,
  },
  dateScroll: {
    gap: 8,
    paddingBottom: 16,
  },
  rescheduleDatePill: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    minWidth: 78,
    marginRight: 8,
  },
  rescheduleDatePillActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  rescheduleDateLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 2,
  },
  rescheduleDateLabelActive: {
    color: '#A7F3D0',
    fontWeight: '600',
  },
  rescheduleDateText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  rescheduleDateTextActive: {
    color: '#FFFFFF',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  rescheduleSlotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  rescheduleSlotPillActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  rescheduleSlotText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11.5,
    fontWeight: '600',
    color: '#334155',
  },
  rescheduleSlotTextActive: {
    color: '#FFFFFF',
  },
  reasonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  reasonChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reasonChipActive: {
    backgroundColor: '#EAF5EE',
    borderColor: '#0F5B43',
  },
  reasonChipText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11.5,
    fontWeight: '500',
    color: '#475569',
  },
  reasonChipTextActive: {
    color: '#0F5B43',
    fontWeight: '700',
  },
  confirmRescheduleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.primary,
    height: 48,
    borderRadius: 24,
    ...Shadows.subtle,
  },
  confirmRescheduleBtnText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
