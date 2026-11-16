import React, { useState } from 'react';
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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle, Rect, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { getActiveBooking, ACTIVE_IN_TRANSIT_BOOKING } from '../../data/mockData';

// Vellora Green Redesign Palette (Reference Image 2)
const Palette = {
  primary: '#0F5B43',        // Primary forest green
  primaryDark: '#174F3D',    // Dark forest green
  mint: '#EAF5EE',           // Soft mint accent
  mintDeep: '#DCEEE2',       // Deeper mint for card gradient
  mintCard: '#E4F3E8',       // Appointment card background
  bgWarm: '#FBFAF7',         // Warm ivory page background
  sageLight: '#F4FAF6',      // Light sage card surface
  surface: '#FFFFFF',        // Card white
  textDark: '#1B2A24',       // Primary text
  textMuted: '#7A8B84',      // Secondary text
  textLightMuted: '#9EAEA7', // Subtext / dates
  border: '#DCE9E1',         // Clean border
  badgeDot: '#E53E3E',       // Red notification dot
  pulseGreen: '#0F5B43',     // ECG test pulse
  pulseRed: '#E11D48',       // Blood pressure pulse
};

interface ScheduleDayItem {
  day: string;
  date: string;
  fullDate: string;
  isToday?: boolean;
  hasEvent?: boolean;
  eventType?: 'confirmed' | 'scheduled';
  booking?: {
    id: string;
    routeId: string;
    serviceTitle: string;
    providerName: string;
    providerRole: string;
    time: string;
    status: 'Confirmed' | 'Scheduled';
    avatar: any;
    pin?: string;
  };
}

const SCHEDULE_DAYS: ScheduleDayItem[] = [
  { day: 'Mon', date: '12', fullDate: '12 May 2025' },
  { day: 'Tue', date: '13', fullDate: '13 May 2025' },
  {
    day: 'Wed',
    date: '14',
    fullDate: '14 May 2025',
    isToday: true,
    hasEvent: true,
    eventType: 'confirmed',
    booking: {
      id: 'bkg-1',
      routeId: 'bkg-8492',
      serviceTitle: 'Home Visit Consultation',
      providerName: 'Dr. Arjun Mehta',
      providerRole: 'MD, General Physician',
      time: '11:00 AM – 11:30 AM',
      status: 'Confirmed',
      avatar: require('../../../assets/images/doctor-rohan.png'),
      pin: '4829',
    },
  },
  { day: 'Thu', date: '15', fullDate: '15 May 2025' },
  {
    day: 'Fri',
    date: '16',
    fullDate: '16 May 2025',
    hasEvent: true,
    eventType: 'scheduled',
    booking: {
      id: 'bkg-2',
      routeId: 'bkg-8890',
      serviceTitle: 'Home Nursing Care',
      providerName: 'Nurse Priya Sharma',
      providerRole: 'B.Sc Nursing • Critical & Elderly Care',
      time: '02:00 PM – 02:45 PM',
      status: 'Scheduled',
      avatar: require('../../../assets/images/doctor-maya-patel.jpg'),
      pin: '7392',
    },
  },
  { day: 'Sat', date: '17', fullDate: '17 May 2025' },
  { day: 'Sun', date: '18', fullDate: '18 May 2025' },
];

/**
 * Illustrated Doctor Character with Botanical Leaves
 * Recreated accurately from Reference Image 2 (Upcoming Appointment Card)
 */
function DoctorIllustration({ width = 105, height = 115 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 110 120" fill="none">
      {/* Background Decorative Botanical Leaves */}
      <Path
        d="M65 95C60 60 75 35 105 28C105 58 90 85 65 95Z"
        fill="#C3DFCF"
        opacity={0.8}
      />
      <Path
        d="M48 90C45 65 58 45 80 40C82 62 70 82 48 90Z"
        fill="#A6D3BA"
        opacity={0.65}
      />
      <Path
        d="M72 105C80 80 96 68 110 65C108 85 95 102 72 105Z"
        fill="#B8DCC7"
        opacity={0.7}
      />

      {/* Hair (Back Bun / Ponytail) */}
      <Circle cx="82" cy="46" r="14" fill="#4B3224" />
      <Path
        d="M80 50C85 58 87 68 83 75C80 72 78 62 78 54Z"
        fill="#3F2A1E"
      />

      {/* Body / Torso (White Lab Coat) */}
      <Path
        d="M32 120C32 98 42 90 55 90C68 90 78 98 78 120H32Z"
        fill="#FFFFFF"
      />
      {/* Inner Shirt (Teal Green) */}
      <Path
        d="M48 90H62L58 108H52L48 90Z"
        fill="#2A7A5E"
      />
      {/* Lab Coat Lapels */}
      <Path
        d="M38 92L52 108L48 120H33L38 92Z"
        fill="#F3F7F5"
      />
      <Path
        d="M72 92L58 108L62 120H77L72 92Z"
        fill="#EDF3F0"
      />

      {/* Neck */}
      <Rect x="50" y="78" width="10" height="15" rx="3" fill="#F4C6A4" />

      {/* Head & Face */}
      <Circle cx="55" cy="58" r="16" fill="#F8CFAF" />

      {/* Hair (Front & Bangs) */}
      <Path
        d="M39 56C39 44 46 36 56 36C66 36 72 43 72 52C68 47 62 45 55 45C47 45 42 50 39 56Z"
        fill="#4B3224"
      />
      <Path
        d="M40 52C42 58 44 65 44 70C42 66 41 60 40 52Z"
        fill="#3F2A1E"
      />
      <Path
        d="M70 52C68 58 66 65 66 70C68 66 69 60 70 52Z"
        fill="#3F2A1E"
      />

      {/* Facial Features */}
      {/* Left Eye */}
      <Circle cx="49" cy="58" r="1.6" fill="#2E1F16" />
      {/* Right Eye */}
      <Circle cx="61" cy="58" r="1.6" fill="#2E1F16" />
      {/* Eyebrows */}
      <Path d="M47 54C48.5 53 51 53 52 54" stroke="#3F2A1E" strokeWidth="1" strokeLinecap="round" />
      <Path d="M58 54C59.5 53 62 53 63 54" stroke="#3F2A1E" strokeWidth="1" strokeLinecap="round" />
      {/* Smiling Lips */}
      <Path d="M52 65C53.5 67 56.5 67 58 65" stroke="#C86A58" strokeWidth="1.4" strokeLinecap="round" />
      {/* Cheerful Blush */}
      <Circle cx="46" cy="62" r="2.2" fill="#F6A89B" opacity={0.5} />
      <Circle cx="64" cy="62" r="2.2" fill="#F6A89B" opacity={0.5} />

      {/* Stethoscope */}
      <Path
        d="M45 92C44 100 48 108 55 108C62 108 66 100 65 92"
        stroke="#314B42"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Chest Piece (Metallic Stethoscope Bell) */}
      <Circle cx="55" cy="110" r="3.2" fill="#99B8AC" stroke="#234036" strokeWidth="1" />
    </Svg>
  );
}

export default function HomeScreen() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState('14'); // Active: Wed 14

  const patientFirstName = user?.name ? user.name.split(' ')[0] : 'Emma';

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/services/doctor-visit' as any,
        params: { query: searchQuery.trim() },
      });
    } else {
      router.push('/services/doctor-visit' as any);
    }
  };

  const handleCallDoctor = (doctorName: string) => {
    Alert.alert(
      `Contact ${doctorName}`,
      `Would you like to initiate a secure teleconsultation or phone call with ${doctorName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Call', onPress: () => router.push('/services/doctor-visit' as any) },
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
        {/* 1. TOP BRAND HEADER: LEAF LOGO + "Velora Health" & ACTIONS   */}
        {/* ============================================================ */}
        <View style={styles.topBrandBar}>
          {/* Brand Logo */}
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

          {/* Action Buttons: Notification Bell + Plus Add */}
          <View style={styles.topActionButtons}>
            {/* Bell Notification with unread dot */}
            <TouchableOpacity
              style={styles.bellBtn}
              activeOpacity={0.75}
              onPress={() => router.push('/(tabs)/bookings')}
            >
              <Ionicons name="notifications-outline" size={20} color={Palette.textDark} />
              <View style={styles.bellBadgeDot} />
            </TouchableOpacity>

            {/* Plus Button */}
            <TouchableOpacity
              style={styles.plusBtn}
              activeOpacity={0.75}
              onPress={() => router.push('/services' as any)}
            >
              <Ionicons name="add" size={22} color={Palette.textDark} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 2. USER GREETING ROW: AVATAR + "Hello, Emma 👋"              */}
        {/* ============================================================ */}
        <View style={styles.greetingRow}>
          <Image
            source={require('../../../assets/images/avatar-indian-1.jpg')}
            style={styles.greetingAvatar}
            resizeMode="cover"
          />
          <View style={styles.greetingTextCol}>
            <View style={styles.greetingHeadingRow}>
              <Text style={styles.greetingName}>Hello, {patientFirstName}</Text>
              <Text style={styles.greetingEmoji}>👋</Text>
            </View>
            <Text style={styles.greetingSubtext}>How are you feeling today?</Text>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 3. SEARCH BAR WITH FILTER SLIDERS ICON                       */}
        {/* ============================================================ */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={19} color={Palette.textMuted} style={styles.searchIcon} />
          <TextInput
            placeholder="Search doctors, services, or specialties"
            placeholderTextColor={Palette.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            style={styles.searchInput}
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={Palette.textMuted} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/services/doctor-visit' as any)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="options-outline" size={20} color={Palette.textDark} />
            </TouchableOpacity>
          )}
        </View>

        {/* ============================================================ */}
        {/* 4. UPCOMING APPOINTMENT SECTION                              */}
        {/* ============================================================ */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Upcoming Appointment</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/bookings')}
              hitSlop={{ top: 8, bottom: 8, left: 10, right: 10 }}
            >
              <Text style={styles.seeAllText}>See All →</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.appointmentCard}
            activeOpacity={0.92}
            onPress={() =>
              router.push({
                pathname: '/booking/bkg-8492',
                params: {
                  step: 'details_view',
                  serviceTitle: 'Cardiology Consultation',
                  providerName: 'Dr. Priya Nair',
                  date: 'Wed, 14 May 2025',
                  time: '11:30 AM - 11:50 AM',
                  status: 'Confirmed',
                  address: 'A-402, Green Valley Apartments, Bangalore - 560068',
                },
              } as any)
            }
          >
            {/* Top row inside Card: Icon Box + Details + Doctor Illustration */}
            <View style={styles.appointmentCardContentRow}>
              {/* White rounded box for clinical heart-pulse icon */}
              <View style={styles.clinicalHeartBadge}>
                <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
                  {/* Heart Outline */}
                  <Path
                    d="M19.5 12.572L12 20L4.5 12.572A5 5 0 1 1 12 6.006A5 5 0 1 1 19.5 12.572Z"
                    stroke={Palette.primary}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* ECG Pulse Wave Inside Heart */}
                  <Path
                    d="M3.5 12.5H7.5L9.5 9.5L12 15.5L14.5 11L16.5 12.5H20.5"
                    stroke={Palette.primary}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>

              {/* Consultation Title & Doctor Details */}
              <View style={styles.appointmentTextCol}>
                <Text style={styles.consultationTitle} numberOfLines={1}>Cardiology Consultation</Text>
                <Text style={styles.appointmentDoctorName} numberOfLines={1}>Dr. Priya Nair</Text>
                <Text style={styles.appointmentDoctorRole} numberOfLines={1}>Consultant Cardiologist</Text>
              </View>

              {/* Right: Friendly Doctor Graphic */}
              <View style={styles.doctorIllustrationContainer}>
                <DoctorIllustration width={88} height={92} />
              </View>
            </View>

            {/* Bottom Row: White Info Pills (Date & Time) */}
            <View style={styles.appointmentPillsRow}>
              <View style={styles.whitePill}>
                <Ionicons name="calendar-outline" size={13.5} color={Palette.textDark} style={{ marginRight: 6 }} />
                <Text style={styles.whitePillText}>Wed, 14 May 2025</Text>
              </View>

              <View style={styles.whitePill}>
                <Ionicons name="time-outline" size={13.5} color={Palette.textDark} style={{ marginRight: 6 }} />
                <Text style={styles.whitePillText}>11:30 AM – 11:50 AM</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* ============================================================ */}
        {/* 5. MY RECENT RECORDS SECTION (2x2 Grid Matching Design)      */}
        {/* ============================================================ */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>My Recent Records</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/records')}
              hitSlop={{ top: 8, bottom: 8, left: 10, right: 10 }}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recentRecordsGrid}>
            {/* Top Row: Diagnostic Test Cards */}
            <View style={styles.recordsTwoColRow}>
              {/* Card 1: ECG Test (Green Pulse Wave) */}
              <TouchableOpacity
                style={styles.recordCard}
                activeOpacity={0.88}
                onPress={() => router.push('/(tabs)/records')}
              >
                <Text style={styles.recordCardTitle}>ECG Test</Text>
                <Text style={styles.recordCardStatusNormal}>Normal</Text>
                <Text style={styles.recordCardDate}>14 May 2026</Text>

                <View style={styles.cardBottomPulseRow}>
                  <View style={styles.recordIconCircleMint}>
                    <Ionicons name="heart-outline" size={15} color="#059669" />
                  </View>
                  <View style={styles.pulseWaveWrapper}>
                    <Svg width="100%" height={24} viewBox="0 0 76 24" fill="none">
                      <Path
                        d="M0 12 H8 L12 16 L16 3 L21 21 L24 8 L27 12 H38 L42 16 L46 3 L51 21 L54 8 L57 12 H76"
                        stroke="#059669"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Card 2: ECG Test (Red Pulse Wave) */}
              <TouchableOpacity
                style={styles.recordCard}
                activeOpacity={0.88}
                onPress={() => router.push('/(tabs)/records')}
              >
                <Text style={styles.recordCardTitle}>ECG Test</Text>
                <Text style={styles.recordCardStatusNormal}>Normal</Text>
                <Text style={styles.recordCardDate}>14 May 2026</Text>

                <View style={styles.cardBottomPulseRow}>
                  <View style={styles.recordIconCircleRed}>
                    <Ionicons name="time-outline" size={15} color="#DC2626" />
                  </View>
                  <View style={styles.pulseWaveWrapper}>
                    <Svg width="100%" height={24} viewBox="0 0 76 24" fill="none">
                      <Path
                        d="M0 12 H8 L12 16 L16 3 L21 21 L24 8 L27 12 H38 L42 16 L46 3 L51 21 L54 8 L57 12 H76"
                        stroke="#DC2626"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Bottom Row: Doctor Clinician Cards */}
            <View style={[styles.recordsTwoColRow, { marginTop: 12 }]}>
              {/* Card 3: Dr. Emily (Warm Cream Pastel) */}
              <TouchableOpacity
                style={[styles.recordDoctorCard, styles.doctorCardCream]}
                activeOpacity={0.88}
                onPress={() => router.push('/services/doctor-visit' as any)}
              >
                <View style={styles.doctorHeaderRow}>
                  <Image
                    source={require('../../../assets/images/doctor-maya-patel.jpg')}
                    style={styles.doctorAvatarRound}
                    resizeMode="cover"
                  />
                  <Text style={styles.doctorNameText} numberOfLines={1}>
                    Dr. Emily
                  </Text>
                </View>

                <View style={styles.doctorSpecialtyRow}>
                  <Ionicons name="briefcase-outline" size={13} color="#6B7E75" />
                  <Text style={styles.doctorSpecialtyText}>Orthopedist</Text>
                </View>

                <View style={styles.doctorFooterRow}>
                  <View style={styles.onlineBadgePillWhite}>
                    <View style={styles.statusDotBlue} />
                    <Text style={styles.onlinePillText}>Online</Text>
                  </View>

                  <View style={styles.doctorActionBtnGroup}>
                    <TouchableOpacity
                      style={styles.doctorCircleBtn}
                      activeOpacity={0.7}
                      onPress={() => router.push('/services/doctor-visit' as any)}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Ionicons name="information-circle-outline" size={15} color="#4B5E55" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.doctorCircleBtn}
                      activeOpacity={0.7}
                      onPress={() => handleCallDoctor('Dr. Emily')}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Ionicons name="ellipsis-horizontal" size={13} color="#4B5E55" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Card 4: Dr. Andrew (Soft Mint) */}
              <TouchableOpacity
                style={[styles.recordDoctorCard, styles.doctorCardMint]}
                activeOpacity={0.88}
                onPress={() => router.push('/services/doctor-visit' as any)}
              >
                <View style={styles.doctorHeaderRow}>
                  <Image
                    source={require('../../../assets/images/doctor-rohan.png')}
                    style={styles.doctorAvatarRound}
                    resizeMode="cover"
                  />
                  <Text style={styles.doctorNameText} numberOfLines={1}>
                    Dr. Andrew
                  </Text>
                </View>

                <View style={styles.doctorSpecialtyRow}>
                  <Ionicons name="briefcase-outline" size={13} color="#6B7E75" />
                  <Text style={styles.doctorSpecialtyText}>Neurology</Text>
                </View>

                <View style={styles.doctorFooterRow}>
                  <View style={styles.onlineBadgePillWhite}>
                    <View style={styles.statusDotBlue} />
                    <Text style={styles.onlinePillText}>Online</Text>
                  </View>

                  <View style={styles.doctorActionBtnGroup}>
                    <TouchableOpacity
                      style={styles.doctorCircleBtn}
                      activeOpacity={0.7}
                      onPress={() => router.push('/services/doctor-visit' as any)}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Ionicons name="information-circle-outline" size={15} color="#4B5E55" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.doctorCircleBtn}
                      activeOpacity={0.7}
                      onPress={() => handleCallDoctor('Dr. Andrew')}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Ionicons name="ellipsis-horizontal" size={13} color="#4B5E55" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 7. SCHEDULE SECTION: HORIZONTAL CALENDAR DATE STRIP          */}
        {/* ============================================================ */}
        <View style={styles.sectionBlock}>
          {/* Header Row */}
          <View style={styles.scheduleHeaderRow}>
            <View style={styles.scheduleTitleWrap}>
              <Text style={styles.scheduleHeading}>Schedule</Text>
              <View style={styles.scheduleMonthPill}>
                <Text style={styles.scheduleMonthText}>May 2025</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.scheduleMyVisitsBtn}
              activeOpacity={0.78}
              onPress={() => router.push('/(tabs)/bookings')}
              accessibilityLabel="View all bookings"
            >
              <Ionicons name="calendar-outline" size={14} color={Palette.primary} style={{ marginRight: 4 }} />
              <Text style={styles.scheduleMyVisitsText}>My Visits</Text>
              <Ionicons name="chevron-forward" size={12} color={Palette.primary} />
            </TouchableOpacity>
          </View>

          {/* 7-Day Horizontal Strip */}
          <View style={styles.scheduleRowContainer}>
            {SCHEDULE_DAYS.map((item) => {
              const isSelected = selectedDay === item.date;
              return (
                <TouchableOpacity
                  key={item.date}
                  activeOpacity={0.82}
                  onPress={() => setSelectedDay(item.date)}
                  style={[
                    styles.scheduleDayCard,
                    isSelected ? styles.scheduleDayActive : styles.scheduleDayInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.scheduleDayLabel,
                      isSelected ? styles.scheduleDayLabelActive : styles.scheduleDayLabelInactive,
                    ]}
                  >
                    {item.day}
                  </Text>
                  <Text
                    style={[
                      styles.scheduleDateNumber,
                      isSelected ? styles.scheduleDateNumberActive : styles.scheduleDateNumberInactive,
                    ]}
                  >
                    {item.date}
                  </Text>

                  {/* Event indicator dot */}
                  {item.hasEvent && (
                    <View
                      style={[
                        styles.scheduleEventDot,
                        isSelected
                          ? styles.scheduleEventDotActive
                          : item.eventType === 'scheduled'
                          ? styles.scheduleEventDotScheduled
                          : styles.scheduleEventDotConfirmed,
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Interactive Selected Day Agenda Card */}
          {(() => {
            const currentItem = SCHEDULE_DAYS.find((d) => d.date === selectedDay) || SCHEDULE_DAYS[2];
            if (currentItem.booking) {
              const b = currentItem.booking;
              return (
                <View style={styles.agendaCard}>
                  {/* Top Status & Timing Row */}
                  <View style={styles.agendaTopRow}>
                    <View
                      style={[
                        styles.agendaStatusBadge,
                        b.status === 'Confirmed' ? styles.agendaStatusConfirmed : styles.agendaStatusScheduled,
                      ]}
                    >
                      <View
                        style={[
                          styles.agendaStatusDot,
                          { backgroundColor: b.status === 'Confirmed' ? '#059669' : '#D97706' },
                        ]}
                      />
                      <Text
                        style={[
                          styles.agendaStatusText,
                          { color: b.status === 'Confirmed' ? '#059669' : '#D97706' },
                        ]}
                      >
                        {b.status} Visit
                      </Text>
                    </View>

                    <View style={styles.agendaTimeBadge}>
                      <Ionicons name="time-outline" size={12} color={Palette.primary} style={{ marginRight: 4 }} />
                      <Text style={styles.agendaTimeText}>{b.time}</Text>
                    </View>
                  </View>

                  {/* Clinician & Service Info */}
                  <View style={styles.agendaContentRow}>
                    <Image source={b.avatar} style={styles.agendaAvatar} resizeMode="cover" />
                    <View style={styles.agendaInfoCol}>
                      <Text style={styles.agendaServiceTitle}>{b.serviceTitle}</Text>
                      <Text style={styles.agendaDoctorName}>{b.providerName}</Text>
                      <Text style={styles.agendaDoctorRole}>{b.providerRole}</Text>
                    </View>
                  </View>

                  {/* Bedside PIN + Quick Action Row */}
                  <View style={styles.agendaFooterRow}>
                    {b.pin ? (
                      <View style={styles.agendaPinBadge}>
                        <Ionicons name="key-outline" size={11} color={Palette.primary} style={{ marginRight: 4 }} />
                        <Text style={styles.agendaPinLabel}>Doorstep PIN: </Text>
                        <Text style={styles.agendaPinCode}>{b.pin}</Text>
                      </View>
                    ) : (
                      <View />
                    )}

                    <TouchableOpacity
                      style={styles.agendaViewBtn}
                      activeOpacity={0.8}
                      onPress={() =>
                        router.push({
                          pathname: `/booking/${b.routeId}`,
                          params: { step: 'details_view' },
                        } as any)
                      }
                    >
                      <Text style={styles.agendaViewBtnText}>View Details</Text>
                      <Ionicons name="arrow-forward" size={12} color="#FFFFFF" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }

            return (
              <View style={styles.agendaEmptyCard}>
                <View style={styles.agendaEmptyIconWrap}>
                  <Ionicons name="calendar-outline" size={18} color={Palette.primary} />
                </View>
                <View style={styles.agendaEmptyTextCol}>
                  <Text style={styles.agendaEmptyTitle}>
                    {currentItem.day}, {currentItem.fullDate}
                  </Text>
                  <Text style={styles.agendaEmptySubtitle}>
                    No home visits booked. Clinicians are available for doorstep care.
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.agendaEmptyBookBtn}
                  activeOpacity={0.8}
                  onPress={() => router.push('/services/doctor-visit' as any)}
                >
                  <Text style={styles.agendaEmptyBookText}>Book Care</Text>
                  <Ionicons name="add" size={13} color={Palette.primary} />
                </TouchableOpacity>
              </View>
            );
          })()}
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
    paddingBottom: 110, // Leaves ample breathing room above the floating navbar
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

  /* 2. User Greeting Row */
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  greetingAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: Palette.border,
  },
  greetingTextCol: {
    justifyContent: 'center',
  },
  greetingHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  greetingName: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 22,
    fontWeight: '600',
    color: Palette.textDark,
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  greetingEmoji: {
    fontSize: 20,
  },
  greetingSubtext: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13.5,
    color: Palette.textMuted,
    marginTop: 2,
    fontWeight: '400',
    lineHeight: 18,
  },

  /* 3. Search Bar */
  searchBar: {
    height: 50,
    borderRadius: 25,
    backgroundColor: Palette.surface,
    borderWidth: 1.2,
    borderColor: Palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
    ...Shadows.subtle,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13.5,
    color: Palette.textDark,
    height: '100%',
    fontWeight: '400',
  },

  /* Section Common */
  sectionBlock: {
    marginBottom: 22,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeading: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 19,
    fontWeight: '600',
    color: Palette.textDark,
    letterSpacing: -0.3,
    lineHeight: 25,
  },
  seeAllText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    fontWeight: '500',
    color: Palette.primary,
  },

  /* 4. Upcoming Appointment Card */
  appointmentCard: {
    borderRadius: 24,
    backgroundColor: Palette.mintCard,
    borderWidth: 1.2,
    borderColor: '#D4E7DC',
    paddingHorizontal: 13,
    paddingTop: 13,
    paddingBottom: 13,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  appointmentCardContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  clinicalHeartBadge: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: Palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D2E6DA',
    marginRight: 10,
    ...Shadows.subtle,
  },
  appointmentTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  consultationTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13.5,
    fontWeight: '700',
    color: Palette.textDark,
    letterSpacing: -0.15,
    marginBottom: 2,
  },
  appointmentDoctorName: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '500',
    color: '#344C42',
    marginBottom: 1,
  },
  appointmentDoctorRole: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '400',
    color: Palette.textMuted,
  },
  doctorIllustrationContainer: {
    width: 82,
    height: 86,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  appointmentPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  whitePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFFEE',
    borderRadius: 18,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#D2E5DA',
  },
  whitePillText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '500',
    color: Palette.textDark,
  },

  /* 5. My Recent Records (2x2 Grid Matching Design) */
  recentRecordsGrid: {
    gap: 12,
  },
  recordsTwoColRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  recordCard: {
    flex: 1,
    backgroundColor: Palette.surface,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#E6EFEA',
    padding: 14,
    ...Shadows.subtle,
  },
  recordCardTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 14.5,
    fontWeight: '700',
    color: Palette.textDark,
    letterSpacing: -0.15,
    marginBottom: 2,
  },
  recordCardStatusNormal: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 2,
  },
  recordCardDate: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '400',
    color: Palette.textMuted,
    marginBottom: 10,
  },
  cardBottomPulseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recordIconCircleMint: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EAF5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordIconCircleRed: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FDE8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseWaveWrapper: {
    flex: 1,
    height: 24,
    marginLeft: 6,
    justifyContent: 'center',
  },

  /* Doctor Clinician Cards in Grid */
  recordDoctorCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1.2,
    padding: 13,
    ...Shadows.subtle,
  },
  doctorCardCream: {
    backgroundColor: '#FAF3E8',
    borderColor: '#EFE2CC',
  },
  doctorCardMint: {
    backgroundColor: '#EAF5EE',
    borderColor: '#CFE7DA',
  },
  doctorHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  doctorAvatarRound: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  doctorNameText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13.5,
    fontWeight: '700',
    color: Palette.textDark,
    marginLeft: 8,
    flex: 1,
  },
  doctorSpecialtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorSpecialtyText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11.5,
    fontWeight: '400',
    color: '#4B5E55',
    marginLeft: 5,
  },
  doctorFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  onlineBadgePillWhite: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 3.5,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2ECE6',
  },
  statusDotBlue: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0284C7',
    marginRight: 4,
  },
  onlinePillText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 10.5,
    fontWeight: '600',
    color: Palette.textDark,
  },
  doctorActionBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  doctorCircleBtn: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2ECE6',
  },

  /* 7. Schedule Section */
  scheduleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scheduleTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleHeading: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 19,
    fontWeight: '600',
    color: Palette.primary,
    letterSpacing: -0.3,
    lineHeight: 25,
  },
  scheduleMonthPill: {
    backgroundColor: Palette.mint,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4E7DC',
  },
  scheduleMonthText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '600',
    color: Palette.primary,
  },
  scheduleMyVisitsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.mint,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCE9E1',
  },
  scheduleMyVisitsText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11.5,
    fontWeight: '600',
    color: Palette.primary,
    marginRight: 2,
  },
  scheduleRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scheduleDayCard: {
    flex: 1,
    maxWidth: 44,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    position: 'relative',
    paddingVertical: 4,
  },
  scheduleDayActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
    ...Shadows.subtle,
  },
  scheduleDayInactive: {
    backgroundColor: Palette.surface,
    borderColor: Palette.border,
  },
  scheduleDayLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 10.5,
    fontWeight: '500',
    marginBottom: 2,
  },
  scheduleDayLabelActive: {
    color: '#DCEEE2',
  },
  scheduleDayLabelInactive: {
    color: Palette.textMuted,
  },
  scheduleDateNumber: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 14.5,
    fontWeight: '600',
  },
  scheduleDateNumberActive: {
    color: '#FFFFFF',
  },
  scheduleDateNumberInactive: {
    color: Palette.textDark,
  },
  scheduleEventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 3,
  },
  scheduleEventDotActive: {
    backgroundColor: '#FFFFFF',
  },
  scheduleEventDotConfirmed: {
    backgroundColor: '#059669',
  },
  scheduleEventDotScheduled: {
    backgroundColor: '#D97706',
  },

  /* Agenda Card */
  agendaCard: {
    backgroundColor: Palette.surface,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: Palette.border,
    padding: 13,
    ...Shadows.subtle,
  },
  agendaTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F2',
  },
  agendaStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  agendaStatusConfirmed: {
    backgroundColor: '#EAF6ED',
  },
  agendaStatusScheduled: {
    backgroundColor: '#FEF3C7',
  },
  agendaStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  agendaStatusText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '600',
  },
  agendaTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.mint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  agendaTimeText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '500',
    color: Palette.primary,
  },
  agendaContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  agendaAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.mint,
  },
  agendaInfoCol: {
    flex: 1,
  },
  agendaServiceTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13.5,
    fontWeight: '600',
    color: Palette.textDark,
    marginBottom: 1,
  },
  agendaDoctorName: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '500',
    color: Palette.primary,
  },
  agendaDoctorRole: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '400',
    color: Palette.textMuted,
  },
  agendaFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F0F4F2',
  },
  agendaPinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.mint,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  agendaPinLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 10.5,
    fontWeight: '400',
    color: Palette.textMuted,
  },
  agendaPinCode: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '600',
    color: Palette.primary,
    letterSpacing: 1,
  },
  agendaViewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primary,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 14,
  },
  agendaViewBtnText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  /* Empty Day Agenda Card */
  agendaEmptyCard: {
    backgroundColor: Palette.surface,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: Palette.border,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...Shadows.subtle,
  },
  agendaEmptyIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Palette.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agendaEmptyTextCol: {
    flex: 1,
  },
  agendaEmptyTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    fontWeight: '600',
    color: Palette.textDark,
  },
  agendaEmptySubtitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '400',
    color: Palette.textMuted,
    marginTop: 1,
    lineHeight: 14,
  },
  agendaEmptyBookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.mint,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4E7DC',
  },
  agendaEmptyBookText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '600',
    color: Palette.primary,
    marginRight: 2,
  },
});
