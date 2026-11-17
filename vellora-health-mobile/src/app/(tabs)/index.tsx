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

interface CalendarGridCell {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Scheduled care visits marked on calendar (year-monthIndex-day)
const CALENDAR_EVENTS: Record<string, 'confirmed' | 'scheduled'> = {
  '2025-4-14': 'confirmed',
  '2025-4-16': 'scheduled',
  '2025-4-22': 'confirmed',
  '2025-4-28': 'scheduled',
};

interface RecentVisitDoctor {
  id: string;
  name: string;
  specialty: string;
  rating: string;
  day: string;
  time: string;
  image: any;
}

const RECENT_VISIT_DOCTORS: RecentVisitDoctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Webster Carter',
    specialty: 'Dental Surgeon & Care',
    rating: '4.8',
    day: 'Monday',
    time: '7:00pm',
    image: require('../../../assets/images/doctor-daniel-reed.jpg'),
  },
  {
    id: 'doc-2',
    name: 'Dr. Alabert Cooper',
    specialty: 'Neurologist & Consultant',
    rating: '4.9',
    day: 'Monday',
    time: '4:30pm',
    image: require('../../../assets/images/doctor-ethan-park.jpg'),
  },
  {
    id: 'doc-3',
    name: 'Dr. Rohan Mehta',
    specialty: 'Consultant Physician, MD',
    rating: '4.9',
    day: 'Wednesday',
    time: '11:00am',
    image: require('../../../assets/images/doctor-rohan.png'),
  },
  {
    id: 'doc-4',
    name: 'Dr. Maya Patel',
    specialty: 'Geriatric & Family Medicine',
    rating: '4.8',
    day: 'Friday',
    time: '2:15pm',
    image: require('../../../assets/images/doctor-maya-patel.jpg'),
  },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [calendarMonth, setCalendarMonth] = useState<number>(4); // 4 = May (0-indexed)
  const [calendarYear, setCalendarYear] = useState<number>(2025);
  const [selectedDate, setSelectedDate] = useState<number>(14);

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  const calendarGrid = useMemo<CalendarGridCell[]>(() => {
    const daysInCurrentMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();
    // Monday as index 0: Sun (0) -> 6, Mon (1) -> 0, etc.
    const leadingDaysCount = (firstDayOfWeek + 6) % 7;

    const daysInPrevMonth = new Date(calendarYear, calendarMonth, 0).getDate();
    const prevMonth = calendarMonth === 0 ? 11 : calendarMonth - 1;
    const prevYear = calendarMonth === 0 ? calendarYear - 1 : calendarYear;

    const nextMonth = calendarMonth === 11 ? 0 : calendarMonth + 1;
    const nextYear = calendarMonth === 11 ? calendarYear + 1 : calendarYear;

    const cells: CalendarGridCell[] = [];

    // Leading days from previous month
    for (let i = leadingDaysCount - 1; i >= 0; i--) {
      cells.push({
        day: daysInPrevMonth - i,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      cells.push({
        day: d,
        month: calendarMonth,
        year: calendarYear,
        isCurrentMonth: true,
      });
    }

    // Trailing days to complete full grid rows (multiple of 7)
    const totalCellsNeeded = Math.ceil(cells.length / 7) * 7;
    const trailingDaysCount = totalCellsNeeded - cells.length;
    for (let t = 1; t <= trailingDaysCount; t++) {
      cells.push({
        day: t,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [calendarMonth, calendarYear]);

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
            <View style={styles.appointmentTitleRow}>
              <Text style={styles.sectionHeading}>Upcoming Appointment</Text>
              <View style={styles.liveIndicatorBadge}>
                <View style={styles.liveIndicatorDot} />
                <Text style={styles.liveIndicatorText}>Today</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/bookings')}
              hitSlop={{ top: 8, bottom: 8, left: 10, right: 10 }}
            >
              <Text style={styles.seeAllText}>See All →</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.appointmentHeroCard}
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
                  address: '#502, Orchid Residency, Koramangala, Bengaluru - 560034',
                },
              } as any)
            }
          >
            {/* Top Status & Verification Row */}
            <View style={styles.appointmentTopRow}>
              <View style={styles.statusPill}>
                <View style={styles.statusPulseDot} />
                <Text style={styles.statusPillText}>Confirmed Doorstep Visit</Text>
              </View>

              <View style={styles.doorstepPinPill}>
                <Ionicons name="key-outline" size={11.5} color="#A7F3D0" style={{ marginRight: 4 }} />
                <Text style={styles.doorstepPinLabel}>PIN: </Text>
                <Text style={styles.doorstepPinCode}>4829</Text>
              </View>
            </View>

            {/* Clinician Profile Row */}
            <View style={styles.clinicianProfileRow}>
              <View style={styles.clinicianAvatarWrap}>
                <Image
                  source={require('../../../assets/images/doctor-maya-patel.jpg')}
                  style={styles.clinicianAvatarImg}
                  resizeMode="cover"
                />
                <View style={styles.clinicianVerifiedBadge}>
                  <Ionicons name="checkmark" size={9} color="#FFFFFF" />
                </View>
              </View>

              <View style={styles.clinicianInfoCol}>
                <Text style={styles.appointmentServiceTitle}>Cardiology Consultation</Text>
                <Text style={styles.clinicianNameText}>Dr. Priya Nair</Text>
                <Text style={styles.clinicianRoleText}>MD, DM • Senior Consultant Cardiologist</Text>
              </View>
            </View>

            {/* Schedule Timing & Address Strip */}
            <View style={styles.appointmentScheduleBox}>
              <View style={styles.scheduleItemWrap}>
                <Ionicons name="calendar" size={13} color="#A7F3D0" style={{ marginRight: 5 }} />
                <Text style={styles.scheduleBoxText}>Wed, 14 May 2025</Text>
              </View>

              <View style={styles.scheduleBoxDivider} />

              <View style={styles.scheduleItemWrap}>
                <Ionicons name="time" size={13} color="#A7F3D0" style={{ marginRight: 5 }} />
                <Text style={styles.scheduleBoxText}>11:30 AM – 11:50 AM</Text>
              </View>
            </View>

            {/* Location & Action CTA Footer */}
            <View style={styles.appointmentFooterRow}>
              <View style={styles.locationSnippetWrap}>
                <Ionicons name="location-outline" size={12} color="#D1E7DD" style={{ marginRight: 4 }} />
                <Text style={styles.locationSnippetText} numberOfLines={1}>
                  Orchid Residency, Koramangala
                </Text>
              </View>

              <View style={styles.viewDetailsCtaBtn}>
                <Text style={styles.viewDetailsCtaText}>View Details</Text>
                <Ionicons name="arrow-forward" size={12} color={Palette.primary} style={{ marginLeft: 4 }} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* ============================================================ */}
        {/* 5. MY RECENT VISIT SECTION                                   */}
        {/* ============================================================ */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>My Recent Visit</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/bookings')}
              hitSlop={{ top: 8, bottom: 8, left: 10, right: 10 }}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentVisitsScrollContainer}
          >
            {RECENT_VISIT_DOCTORS.map((doc) => (
              <View key={doc.id} style={styles.recentVisitCard}>
                {/* Top Doctor Image */}
                <View style={styles.recentDocImageWrap}>
                  <Image source={doc.image} style={styles.recentDocImage} resizeMode="cover" />
                </View>

                {/* Doctor Name & Rating */}
                <View style={styles.recentDocNameRow}>
                  <Text style={styles.recentDocName} numberOfLines={1}>
                    {doc.name}
                  </Text>
                  <View style={styles.recentDocRatingWrap}>
                    <Ionicons name="star" size={13} color="#F59E0B" style={{ marginRight: 3 }} />
                    <Text style={styles.recentDocRating}>{doc.rating}</Text>
                  </View>
                </View>

                {/* Doctor Specialty */}
                <Text style={styles.recentDocSpecialty} numberOfLines={1}>
                  {doc.specialty}
                </Text>

                {/* Schedule Timing (Day & Time) */}
                <View style={styles.recentDocTimingRow}>
                  <View style={styles.timingItem}>
                    <Ionicons name="calendar-outline" size={13} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.timingText}>{doc.day}</Text>
                  </View>

                  <View style={styles.timingItem}>
                    <Ionicons name="time-outline" size={13} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.timingText}>{doc.time}</Text>
                  </View>
                </View>

                {/* Action Buttons: Message & Video Call */}
                <View style={styles.recentDocActionsRow}>
                  <TouchableOpacity
                    style={styles.recentMessageBtn}
                    activeOpacity={0.8}
                    onPress={() =>
                      Alert.alert(
                        `Message ${doc.name}`,
                        `Start a secure message consultation with ${doc.name}?`,
                        [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Start Message', onPress: () => router.push('/(tabs)/records') },
                        ]
                      )
                    }
                  >
                    <Text style={styles.recentMessageBtnText}>Message</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.recentVideoCallBtn}
                    activeOpacity={0.8}
                    onPress={() =>
                      Alert.alert(
                        `Video Call with ${doc.name}`,
                        `Connect to a secure HD telemedicine call with ${doc.name}?`,
                        [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Start Video Call', onPress: () => router.push('/services/doctor-visit' as any) },
                        ]
                      )
                    }
                  >
                    <Text style={styles.recentVideoCallBtnText}>Video Call</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ============================================================ */}
        {/* 7. SCHEDULE SECTION: FULL MONTHLY CALENDAR                   */}
        {/* ============================================================ */}
        <View style={styles.sectionBlock}>
          {/* Header Row */}
          <View style={styles.scheduleHeaderRow}>
            <View style={styles.scheduleTitleWrap}>
              <Text style={styles.scheduleHeading}>Schedule</Text>
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

          {/* Full Monthly Calendar Card */}
          <View style={styles.calendarCard}>
            {/* Calendar Month Navigation Header */}
            <View style={styles.calendarMonthNav}>
              <TouchableOpacity
                onPress={handlePrevMonth}
                style={styles.calendarNavArrow}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Previous month"
              >
                <Ionicons name="chevron-back" size={16} color={Palette.primary} />
              </TouchableOpacity>

              <View style={styles.calendarCurrentMonthWrap}>
                <Ionicons name="calendar" size={14} color={Palette.primary} style={{ marginRight: 6 }} />
                <Text style={styles.calendarCurrentMonthText}>
                  {MONTH_NAMES[calendarMonth]} {calendarYear}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleNextMonth}
                style={styles.calendarNavArrow}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Next month"
              >
                <Ionicons name="chevron-forward" size={16} color={Palette.primary} />
              </TouchableOpacity>
            </View>

            {/* Weekday Names Header Row (Mon, Tue, Wed, Thu, Fri, Sat, Sun) */}
            <View style={styles.calendarWeekdaysRow}>
              {WEEKDAY_NAMES.map((w) => (
                <View key={w} style={styles.calendarWeekdayCell}>
                  <Text style={styles.calendarWeekdayText}>{w}</Text>
                </View>
              ))}
            </View>

            {/* Calendar Days Grid */}
            <View style={styles.calendarGrid}>
              {calendarGrid.map((cell, idx) => {
                const isCurrentMonth = cell.isCurrentMonth;
                const isSelected = isCurrentMonth && selectedDate === cell.day;
                const eventKey = `${cell.year}-${cell.month}-${cell.day}`;
                const eventType = isCurrentMonth ? CALENDAR_EVENTS[eventKey] : undefined;

                return (
                  <TouchableOpacity
                    key={`cal-${idx}-${cell.day}`}
                    activeOpacity={isCurrentMonth ? 0.75 : 1}
                    disabled={!isCurrentMonth}
                    onPress={() => isCurrentMonth && setSelectedDate(cell.day)}
                    style={[
                      styles.calendarDayCell,
                      isSelected && styles.calendarDayCellSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.calendarDayNumber,
                        !isCurrentMonth && styles.calendarDayNumberMuted,
                        isSelected && styles.calendarDayNumberSelected,
                      ]}
                    >
                      {cell.day}
                    </Text>

                    {/* Event Dot */}
                    {eventType ? (
                      <View
                        style={[
                          styles.calendarEventDot,
                          isSelected
                            ? styles.calendarEventDotSelected
                            : eventType === 'confirmed'
                            ? styles.calendarEventDotConfirmed
                            : styles.calendarEventDotScheduled,
                        ]}
                      />
                    ) : (
                      <View style={styles.calendarEventDotPlaceholder} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Calendar Footer / Legend */}
            <View style={styles.calendarLegendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#059669' }]} />
                <Text style={styles.legendText}>Confirmed Visit</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#D97706' }]} />
                <Text style={styles.legendText}>Scheduled</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Palette.primary }]} />
                <Text style={styles.legendText}>Selected</Text>
              </View>
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

  /* 4. Upcoming Appointment Hero Card */
  appointmentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveIndicatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  liveIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
    marginRight: 4,
  },
  liveIndicatorText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 10.5,
    fontWeight: '700',
    color: '#15803D',
  },
  appointmentHeroCard: {
    borderRadius: 22,
    backgroundColor: Palette.primary,
    padding: 15,
    overflow: 'hidden',
    ...Shadows.card,
  },
  appointmentTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  statusPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
    marginRight: 5,
  },
  statusPillText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  doorstepPinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  doorstepPinLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 10.5,
    fontWeight: '400',
    color: '#D1E7DD',
  },
  doorstepPinCode: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  clinicianProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 13,
  },
  clinicianAvatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#A7F3D0',
    position: 'relative',
    backgroundColor: '#174F3D',
  },
  clinicianAvatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  clinicianVerifiedBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Palette.primary,
  },
  clinicianInfoCol: {
    flex: 1,
  },
  appointmentServiceTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 15.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
    lineHeight: 20,
    marginBottom: 2,
  },
  clinicianNameText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    fontWeight: '600',
    color: '#A7F3D0',
    marginBottom: 1,
  },
  clinicianRoleText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '400',
    color: '#D1E7DD',
  },
  appointmentScheduleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  scheduleItemWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleBoxText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scheduleBoxDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginHorizontal: 8,
  },
  appointmentFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  locationSnippetWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  locationSnippetText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '400',
    color: '#D1E7DD',
  },
  viewDetailsCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 14,
    ...Shadows.subtle,
  },
  viewDetailsCtaText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11.5,
    fontWeight: '700',
    color: Palette.primary,
  },

  /* 5. My Recent Visit (Horizontal Doctor Carousel) */
  recentVisitsScrollContainer: {
    paddingRight: 20,
    gap: 14,
    paddingVertical: 2,
  },
  recentVisitCard: {
    width: 250,
    backgroundColor: Palette.surface,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 13,
    ...Shadows.subtle,
  },
  recentDocImageWrap: {
    width: '100%',
    height: 146,
    borderRadius: 16,
    backgroundColor: '#EEF2F6',
    overflow: 'hidden',
    marginBottom: 10,
  },
  recentDocImage: {
    width: '100%',
    height: '100%',
  },
  recentDocNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  recentDocName: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 6,
  },
  recentDocRatingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentDocRating: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  recentDocSpecialty: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '400',
    color: '#64748B',
    marginBottom: 10,
  },
  recentDocTimingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  timingItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timingText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11.5,
    fontWeight: '500',
    color: '#64748B',
  },
  recentDocActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recentMessageBtn: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentMessageBtnText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
  recentVideoCallBtn: {
    flex: 1.25,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  recentVideoCallBtnText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#FFFFFF',
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
  /* Full Monthly Calendar Styles */
  calendarCard: {
    backgroundColor: Palette.surface,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: Palette.border,
    paddingHorizontal: 14,
    paddingVertical: 16,
    ...Shadows.subtle,
  },
  calendarMonthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  calendarNavArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.mint,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D4E7DC',
  },
  calendarCurrentMonthWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.mint,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D4E7DC',
  },
  calendarCurrentMonthText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13.5,
    fontWeight: '700',
    color: Palette.primary,
    letterSpacing: 0.2,
  },
  calendarWeekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F2',
    paddingBottom: 8,
  },
  calendarWeekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  calendarWeekdayText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '600',
    color: Palette.textMuted,
    textTransform: 'uppercase',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  calendarDayCell: {
    width: '14.28%',
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginVertical: 2,
  },
  calendarDayCellSelected: {
    backgroundColor: Palette.primary,
    ...Shadows.subtle,
  },
  calendarDayNumber: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13.5,
    fontWeight: '600',
    color: Palette.textDark,
  },
  calendarDayNumberMuted: {
    color: '#CBD5E1',
    fontWeight: '400',
  },
  calendarDayNumberSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  calendarEventDot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.25,
    marginTop: 2,
  },
  calendarEventDotPlaceholder: {
    width: 4.5,
    height: 4.5,
    marginTop: 2,
  },
  calendarEventDotSelected: {
    backgroundColor: '#FFFFFF',
  },
  calendarEventDotConfirmed: {
    backgroundColor: '#059669',
  },
  calendarEventDotScheduled: {
    backgroundColor: '#D97706',
  },
  calendarLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F4F2',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '500',
    color: Palette.textMuted,
  },
});
