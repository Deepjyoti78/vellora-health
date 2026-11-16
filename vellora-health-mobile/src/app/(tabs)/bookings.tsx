import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { Typography, Shadows } from '../../constants/theme';
import { RECENT_BOOKINGS } from '../../data/mockData';

const Palette = {
  primary: '#0F5B43',        // Primary forest green
  mint: '#EAF5EE',           // Soft mint accent
  bgWarm: '#FBFAF7',         // Warm ivory page background
  surface: '#FFFFFF',        // Card white
  textDark: '#1B2A24',       // Primary text
  textMuted: '#7A8B84',      // Secondary text
  border: '#DCE9E1',         // Clean border
  confirmedBg: '#EAF6ED',    // Green status badge background
  confirmedText: '#059669',  // Green status badge text
  scheduledBg: '#FEF3C7',    // Amber status badge background
  scheduledText: '#D97706',  // Amber status badge text
  cancelledBg: '#FEE2E2',    // Red status badge background
  cancelledText: '#DC2626',  // Red status badge text
};

type FilterTab = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

interface BookingItemDisplay {
  id: string;
  serviceTitle: string;
  providerName: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Scheduled' | 'Completed' | 'Cancelled';
  avatar: any;
  routeId?: string;
}

const UPCOMING_BOOKINGS: BookingItemDisplay[] = [
  {
    id: 'bkg-1',
    serviceTitle: 'Home Visit Consultation',
    providerName: 'Dr. Arjun Mehta',
    date: 'Wed, 14 May 2025',
    time: '11:00 AM',
    status: 'Confirmed',
    avatar: require('../../../assets/images/doctor-rohan.png'),
    routeId: 'bkg-8492',
  },
  {
    id: 'bkg-2',
    serviceTitle: 'Home Nursing Care',
    providerName: 'Nurse Priya Sharma',
    date: 'Fri, 16 May 2025',
    time: '02:00 PM',
    status: 'Scheduled',
    avatar: require('../../../assets/images/doctor-maya-patel.jpg'),
    routeId: 'bkg-8890',
  },
];

const COMPLETED_BOOKINGS: BookingItemDisplay[] = [
  {
    id: 'bkg-3',
    serviceTitle: 'Home Lab Investigation',
    providerName: 'Phlebotomist Rajesh Kumar',
    date: '10 May 2025',
    time: '08:30 AM',
    status: 'Completed',
    avatar: require('../../../assets/images/avatar-indian-4.jpg'),
    routeId: 'bkg-8104',
  },
  {
    id: 'bkg-4',
    serviceTitle: 'Physiotherapy & Mobility Care',
    providerName: 'Dr. Ananya Roy',
    date: '02 May 2025',
    time: '04:00 PM',
    status: 'Completed',
    avatar: require('../../../assets/images/avatar-indian-3.jpg'),
  },
];

const CANCELLED_BOOKINGS: BookingItemDisplay[] = [
  {
    id: 'bkg-5',
    serviceTitle: 'General Consultation',
    providerName: 'Dr. Daniel Reed',
    date: '28 Apr 2025',
    time: '10:00 AM',
    status: 'Cancelled',
    avatar: require('../../../assets/images/doctor-daniel-reed.jpg'),
  },
];

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<FilterTab>('UPCOMING');

  const getBookingsList = () => {
    switch (activeTab) {
      case 'UPCOMING':
        return UPCOMING_BOOKINGS;
      case 'COMPLETED':
        return COMPLETED_BOOKINGS;
      case 'CANCELLED':
        return CANCELLED_BOOKINGS;
    }
  };

  const handleBookingPress = (booking: BookingItemDisplay) => {
    router.push({
      pathname: '/booking/doctor-visit' as any,
      params: { step: 'details_view' },
    });
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
        {/* 1. TOP HEADER WITH BACK ARROW & CENTERED BRAND LOGO          */}
        {/* ============================================================ */}
        <View style={styles.topHeaderBar}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={Palette.textDark} />
          </TouchableOpacity>

          <View style={styles.brandCenterContainer}>
            <Image
              source={require('../../../assets/images/logo-dark.png')}
              style={styles.brandLogo}
              resizeMode="contain"
            />
          </View>

          {/* Balanced right spacer */}
          <View style={styles.headerRightSpacer} />
        </View>

        {/* ============================================================ */}
        {/* 2. PAGE HEADING: "My Bookings"                               */}
        {/* ============================================================ */}
        <Text style={styles.pageHeading}>My Bookings</Text>

        {/* ============================================================ */}
        {/* 3. SEGMENTED FILTER TABS: Upcoming | Completed | Cancelled   */}
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
        {/* 4. BOOKINGS LIST CARDS                                       */}
        {/* ============================================================ */}
        <View style={styles.bookingsList}>
          {bookings.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.bookingCard}
              activeOpacity={0.88}
              onPress={() => handleBookingPress(item)}
            >
              {/* Doctor / Clinician Avatar */}
              <View style={styles.avatarContainer}>
                <Image
                  source={item.avatar}
                  style={styles.clinicianAvatar}
                  resizeMode="cover"
                />
              </View>

              {/* Service Details */}
              <View style={styles.cardDetailsCol}>
                <Text style={styles.serviceTitleText}>{item.serviceTitle}</Text>
                <Text style={styles.providerNameText}>{item.providerName}</Text>

                <View style={styles.dateTimeRow}>
                  <Ionicons name="calendar-outline" size={13.5} color={Palette.textDark} style={{ marginRight: 5 }} />
                  <Text style={styles.dateTimeText}>{item.date} • {item.time}</Text>
                </View>
              </View>

              {/* Right: Status Badge & Chevron */}
              <View style={styles.cardRightCol}>
                <View
                  style={[
                    styles.statusBadge,
                    item.status === 'Confirmed' && styles.statusBadgeConfirmed,
                    item.status === 'Scheduled' && styles.statusBadgeScheduled,
                    item.status === 'Completed' && styles.statusBadgeConfirmed,
                    item.status === 'Cancelled' && styles.statusBadgeCancelled,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      item.status === 'Confirmed' && styles.statusTextConfirmed,
                      item.status === 'Scheduled' && styles.statusTextScheduled,
                      item.status === 'Completed' && styles.statusTextConfirmed,
                      item.status === 'Cancelled' && styles.statusTextCancelled,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={16} color={Palette.textDark} style={{ marginTop: 12 }} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ============================================================ */}
        {/* 5. "+ Book a New Service" PRIMARY CTA BUTTON                */}
        {/* ============================================================ */}
        <TouchableOpacity
          style={styles.bookNewServiceBtn}
          activeOpacity={0.88}
          onPress={() => router.push('/(tabs)/services')}
        >
          <Ionicons name="add" size={22} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.bookNewServiceText}>Book a New Service</Text>
        </TouchableOpacity>
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

  /* 1. Top Header Bar */
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    marginBottom: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  brandCenterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogo: {
    width: 124,
    height: 34,
  },
  headerRightSpacer: {
    width: 36,
  },

  /* 2. Page Heading */
  pageHeading: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 24,
    fontWeight: '800',
    color: Palette.primary,
    textAlign: 'center',
    marginVertical: 14,
    letterSpacing: -0.4,
  },

  /* 3. Segmented Filter Tabs */
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: Palette.surface,
    borderRadius: 25,
    borderWidth: 1.2,
    borderColor: Palette.border,
    padding: 3,
    marginBottom: 20,
    ...Shadows.subtle,
  },
  segmentPill: {
    flex: 1,
    paddingVertical: 9,
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
    color: Palette.textDark,
  },
  segmentTextActive: {
    fontWeight: '600',
    color: '#FFFFFF',
  },

  /* 4. Bookings List Cards */
  bookingsList: {
    gap: 14,
    marginBottom: 26,
  },
  bookingCard: {
    backgroundColor: Palette.surface,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: Palette.border,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.subtle,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F3FAF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  clinicianAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  cardDetailsCol: {
    flex: 1,
    justifyContent: 'center',
  },
  serviceTitleText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 14.5,
    fontWeight: '700',
    color: Palette.textDark,
    letterSpacing: -0.15,
    marginBottom: 2,
  },
  providerNameText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    fontWeight: '400',
    color: Palette.textMuted,
    marginBottom: 6,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11.5,
    fontWeight: '500',
    color: Palette.textDark,
  },
  cardRightCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 52,
  },
  statusBadge: {
    paddingVertical: 3.5,
    paddingHorizontal: 9,
    borderRadius: 12,
  },
  statusBadgeConfirmed: {
    backgroundColor: Palette.confirmedBg,
  },
  statusBadgeScheduled: {
    backgroundColor: Palette.scheduledBg,
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
  statusTextCancelled: {
    color: Palette.cancelledText,
  },

  /* 5. Book a New Service Button */
  bookNewServiceBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: Palette.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    ...Shadows.subtle,
  },
  bookNewServiceText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});
