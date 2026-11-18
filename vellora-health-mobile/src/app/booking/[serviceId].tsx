import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Dimensions,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../constants/theme';
import { CORE_SERVICES, addBooking, getBookingById, cancelBooking, rescheduleBooking, generateSecurePin } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { PatientBooking } from '../../types';

const SCREEN_WIDTH = Dimensions.get('window').width;

export type BookingStep =
  | 'details'      // Image 1: Enter Booking Details (Step 1)
  | 'schedule'     // Image 6: Choose Date & Time (Step 2)
  | 'review'       // Image 5: Review & Confirm (Step 3)
  | 'payment'      // Image 8: Payment (₹1,200)
  | 'confirmed'    // Image 7: Booking Confirmed!
  | 'details_view' // Image 4: Booking Details
  | 'reschedule'   // Image 3: Reschedule Booking
  | 'cancel';      // Image 2: Cancel Booking


const SCHEDULE_TIMES = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
];

const RESCHEDULE_TIMES = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CANCELLATION_REASONS = [
  'Change of plans',
  'Doctor not available at preferred time',
  'Patient feeling better / recovered',
  'Booked appointment by mistake',
  'Found alternative medical care',
  'Other personal reason',
];

export default function BookingScreen() {
  const { user } = useAuth();
  const savingBooking = useRef(false);
  const params = useLocalSearchParams<{
    serviceId?: string;
    price?: string;
    selectedTitle?: string;
    doctorId?: string;
    doctorName?: string;
    specialty?: string;
    serviceTitle?: string;
    providerName?: string;
    date?: string;
    time?: string;
    status?: string;
    address?: string;
    step?: BookingStep;
  }>();

  const existingBooking = getBookingById(params.serviceId || '');
  const service = CORE_SERVICES.find(item => item.id === (existingBooking?.serviceId || params.serviceId));
  const quotedPrice = Number(params.price);
  const totalPrice = existingBooking?.totalPrice ?? (Number.isFinite(quotedPrice) && quotedPrice > 0 ? quotedPrice : service?.priceStartingAt ?? 0);
  const priceLabel = '₹' + totalPrice.toLocaleString('en-IN');
  const [savedBookingId, setSavedBookingId] = useState(existingBooking?.id || '');
  const bookingReference = savedBookingId || existingBooking?.id || params.serviceId || '';
  const today = new Date();
  const formatDate = (date: Date) => date.toLocaleDateString('en-GB', {weekday:'short', day:'numeric', month:'short', year:'numeric'});
  // Determine if this is viewing an existing booking from My Bookings or Dashboard
  const isExistingBooking = Boolean(
    params.step === 'details_view' ||
    params.serviceId?.startsWith('bkg-') ||
    params.providerName ||
    params.serviceTitle
  );

  // Active step in the workflow
  const [currentStep, setCurrentStep] = useState<BookingStep>(
    params.step || (isExistingBooking ? 'details_view' : 'details')
  );

  // Booking display state
  const [serviceTitle, setServiceTitle] = useState(
    existingBooking?.serviceTitle || params.selectedTitle || params.serviceTitle || service?.title || 'Unknown service'
  );
  const [providerName, setProviderName] = useState(
    existingBooking?.assignedClinician?.name || params.providerName || params.doctorName || 'Care team selection (demo)'
  );
  const [bookingStatus, setBookingStatus] = useState(
    existingBooking ? existingBooking.status.toLowerCase().replace(/(^|_)([a-z])/g, (_, space, letter) => (space ? ' ' : '') + letter.toUpperCase()) : params.status || 'Requested'
  );

  // Step 1: Details (Image 1)
  const [fullName, setFullName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [emailAddress, setEmailAddress] = useState(user?.email || '');
  const [serviceAddress, setServiceAddress] = useState(
    params.address || 'A-402, Green Valley Apartments,\nBangalore - 560068'
  );
  const [patientType, setPatientType] = useState<'myself' | 'family' | 'senior'>('myself');
  const [selectedReason, setSelectedReason] = useState('General Consultation');

  // Step 2: Schedule & Calendar
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [selectedDayNumber, setSelectedDayNumber] = useState(today.getDate());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('02:00 PM'); // 02:00 PM

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayRaw = new Date(calendarYear, calendarMonth, 1).getDay();
  const firstDayOffset = (firstDayRaw + 6) % 7; // Monday = 0, Sunday = 6

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

  const handleSelectDay = (d: number) => {
    setSelectedDayNumber(d);
    const dateObj = new Date(calendarYear, calendarMonth, d);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayNames[dateObj.getDay()];
    const monthShort = MONTH_NAMES[calendarMonth].slice(0, 3);
    const dateString = `${dayName}, ${d} ${monthShort} ${calendarYear}`;
    setBookingConfirmedDate(dateString);
  };

  // Step 4: Payment (Image 8)
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'WALLET'>('UPI');

  // Step 7: Reschedule (Image 3)
  const [rescheduleDay, setRescheduleDay] = useState(today.getDate());
  const [rescheduleTime, setRescheduleTime] = useState('03:00 PM'); // 03:00 PM (Image 3)

  // Step 8: Cancel (Image 2)
  const [cancelReason, setCancelReason] = useState('Select a reason');
  const [showCancelReasonModal, setShowCancelReasonModal] = useState(false);

  // Dynamic booking state
  const [bookingConfirmedDate, setBookingConfirmedDate] = useState(
    existingBooking?.scheduledDate || params.date || formatDate(today)
  );
  const [bookingConfirmedTime, setBookingConfirmedTime] = useState(
    params.time || '02:00 PM'
  );

  // Keep state synchronized when navigating between bookings
  React.useEffect(() => {
    if (params.step) {
      setCurrentStep(params.step);
    } else if (params.serviceId?.startsWith('bkg-')) {
      setCurrentStep('details_view');
    }
    if (params.serviceTitle) setServiceTitle(params.serviceTitle);
    if (params.providerName || params.doctorName) setProviderName(params.providerName || params.doctorName || 'Assignment pending');
    if (existingBooking) setBookingStatus(existingBooking.status.toLowerCase().replace(/(^|_)([a-z])/g, (_, space, letter) => (space ? ' ' : '') + letter.toUpperCase()));
    else if (params.status) setBookingStatus(params.status);
    if (params.date) setBookingConfirmedDate(params.date);
    if (params.time) setBookingConfirmedTime(params.time);
    if (params.address) setServiceAddress(params.address);
  }, [
    params.serviceId,
    params.step,
    params.serviceTitle,
    params.providerName,
    params.doctorName,
    params.status,
    params.date,
    params.time,
    params.address,
  ]);

  const getProviderAvatar = () => {
    if (providerName.includes('Priya') || serviceTitle.includes('Nursing')) {
      return require('../../../assets/images/doctor-maya-patel.jpg');
    }
    if (providerName.includes('Rajesh') || serviceTitle.includes('Lab')) {
      return require('../../../assets/images/avatar-indian-4.jpg');
    }
    if (providerName.includes('Ananya') || serviceTitle.includes('Physio')) {
      return require('../../../assets/images/avatar-indian-3.jpg');
    }
    if (providerName.includes('Daniel')) {
      return require('../../../assets/images/doctor-daniel-reed.jpg');
    }
    return require('../../../assets/images/doctor-rohan.png');
  };

  const getStatusBadgeStyle = () => {
    switch (bookingStatus) {
      case 'Scheduled':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'Completed':
        return { bg: '#EAF6ED', text: '#059669' };
      case 'Cancelled':
        return { bg: '#FEE2E2', text: '#DC2626' };
      case 'Confirmed':
      default:
        return { bg: '#EAF6ED', text: '#059669' };
    }
  };

  const dateObj = new Date(calendarYear, calendarMonth, selectedDayNumber);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayName = dayNames[dateObj.getDay()];
  const monthShort = MONTH_NAMES[calendarMonth].slice(0, 3);
  const selectedDateStr = `${dayName}, ${selectedDayNumber} ${monthShort} ${calendarYear}`;

  // Navigation handlers
  const handleBack = () => {
    switch (currentStep) {
      case 'details':
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/(tabs)/services');
        }
        break;
      case 'schedule':
        setCurrentStep('details');
        break;
      case 'review':
        setCurrentStep('schedule');
        break;
      case 'payment':
        setCurrentStep('review');
        break;
      case 'confirmed':
        router.replace('/(tabs)/services');
        break;
      case 'details_view':
        router.replace('/(tabs)/bookings');
        break;
      case 'reschedule':
        setCurrentStep('details_view');
        break;
      case 'cancel':
        setCurrentStep('details_view');
        break;
      default:
        router.replace('/(tabs)/services');
    }
  };

  const handleStep1Continue = () => {
    if (!service || !fullName.trim() || phoneNumber.replace(/\D/g, '').length < 7 || !serviceAddress.trim()) {
      Alert.alert('Required Fields', 'Please ensure Full Name and Phone Number are entered.');
      return;
    }
    setCurrentStep('schedule');
  };

  const handleStep2Continue = () => {
    const dateObj = new Date(calendarYear, calendarMonth, selectedDayNumber);
    const midnight = new Date(); midnight.setHours(0, 0, 0, 0);
    if (dateObj < midnight || dateObj.getMonth() !== calendarMonth) { Alert.alert('Invalid date', 'Choose today or a future date.'); return; }
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayNames[dateObj.getDay()];
    const monthShort = MONTH_NAMES[calendarMonth].slice(0, 3);
    const dateString = `${dayName}, ${selectedDayNumber} ${monthShort} ${calendarYear}`;
    setBookingConfirmedDate(dateString);
    setBookingConfirmedTime(selectedTimeSlot);
    setCurrentStep('review');
  };

  const handleStep3ProceedToPayment = () => {
    setCurrentStep('payment');
  };

  const handleStep4Pay = () => {
    if (!service || savedBookingId || savingBooking.current) return;
    const chosenDate = new Date(calendarYear, calendarMonth, selectedDayNumber);
    const midnight = new Date(); midnight.setHours(0, 0, 0, 0);
    if (chosenDate < midnight || chosenDate.getMonth() !== calendarMonth) { setCurrentStep('schedule'); return; }
    savingBooking.current = true;
    // Save a local demo request without charging a payment method
    const newBooking: PatientBooking = {
      id: `VEL-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      serviceId: service.id,
      serviceTitle,
      patientName: fullName,
      patientRelationship: patientType === 'myself' ? 'Self' : patientType === 'family' ? 'Family' : 'Senior',

      status: 'REQUESTED',
      scheduledDate: bookingConfirmedDate,
      scheduledTimeSlot: bookingConfirmedTime,
      urgency: 'STANDARD',
      totalPrice,
      securityPin: generateSecurePin(),
      address: serviceAddress.replace('\n', ' '),
      symptoms: selectedReason,
      paymentMethod: 'Demo request — no charge',
      createdAt: new Date().toISOString(),
    };
    addBooking(newBooking);
    setSavedBookingId(newBooking.id);
    setBookingStatus('Requested');

    // Show Confirmation screen (Image 7)
    setCurrentStep('confirmed');
  };

  const handleViewMyBookings = () => {
    // Navigate directly to My Bookings tab page
    router.replace('/(tabs)/bookings');
  };

  const handleBookAnotherService = () => {
    router.replace('/(tabs)/services');
  };

  const handleOpenReschedule = () => {
    setCurrentStep('reschedule');
  };

  const handleOpenCancel = () => {
    setCurrentStep('cancel');
  };

  const handleUpdateBooking = () => {
    const date = new Date(calendarYear, calendarMonth, rescheduleDay);
    const midnight = new Date(); midnight.setHours(0, 0, 0, 0);
    if (date < midnight || date.getMonth() !== calendarMonth) { Alert.alert('Invalid date', 'Choose today or a future date.'); return; }
    const updatedDate = formatDate(date);
    if (!rescheduleBooking(bookingReference, updatedDate, rescheduleTime)) { Alert.alert('Booking unavailable', 'This booking is not in the local demo session.'); return; }
    setBookingConfirmedDate(updatedDate);
    setBookingConfirmedTime(rescheduleTime);
    Alert.alert('Booking Rescheduled', `Your consultation has been updated to ${updatedDate} at ${rescheduleTime}.`);
    setCurrentStep('details_view');
  };

  const handleConfirmCancel = () => {
    if (cancelReason === 'Select a reason') { Alert.alert('Reason required', 'Select a cancellation reason.'); return; }
    if (!cancelBooking(bookingReference, cancelReason)) { Alert.alert('Booking unavailable', 'This booking is not in the local demo session.'); return; }
    setBookingStatus('Cancelled');
    Alert.alert('Appointment Cancelled', 'Your home visit doctor appointment has been cancelled successfully.');
    router.replace('/(tabs)/services');
  };

  // -------------------------------------------------------------
  // Top Header Component (Centered Official Logo, No Back Button)
  // -------------------------------------------------------------
  const renderHeader = (_showCloseIcon = false) => (
    <View style={styles.topHeader}>
      <View style={styles.headerLogoContainer}>
        <Image
          source={require('../../../assets/images/logo-dark.png')}
          style={styles.headerBrandLogo}
          resizeMode="contain"
        />
      </View>
    </View>
  );

  // -------------------------------------------------------------
  // 3-Step Stepper Header (Used in Step 1, 2, and 3)
  // -------------------------------------------------------------
  const renderProgressStepper = (activeStepNumber: 1 | 2 | 3) => {
    return (
      <View style={styles.stepperContainer}>
        {/* Step 1: Details */}
        <View style={styles.stepColumn}>
          <View
            style={[
              styles.stepBadge,
              activeStepNumber >= 1 ? styles.stepBadgeGreen : styles.stepBadgeInactive,
            ]}
          >
            {activeStepNumber > 1 ? (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            ) : (
              <Text style={styles.stepBadgeTextActive}>1</Text>
            )}
          </View>
          <Text
            style={[
              styles.stepLabel,
              activeStepNumber === 1 ? styles.stepLabelActive : styles.stepLabelInactive,
            ]}
          >
            Details
          </Text>
        </View>

        {/* Connector 1 -> 2 */}
        <View
          style={[
            styles.stepConnector,
            activeStepNumber >= 2 ? styles.stepConnectorGreen : styles.stepConnectorInactive,
          ]}
        />

        {/* Step 2: Schedule */}
        <View style={styles.stepColumn}>
          <View
            style={[
              styles.stepBadge,
              activeStepNumber >= 2 ? styles.stepBadgeGreen : styles.stepBadgeInactive,
            ]}
          >
            {activeStepNumber > 2 ? (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            ) : (
              <Text
                style={
                  activeStepNumber >= 2
                    ? styles.stepBadgeTextActive
                    : styles.stepBadgeTextInactive
                }
              >
                2
              </Text>
            )}
          </View>
          <Text
            style={[
              styles.stepLabel,
              activeStepNumber === 2 ? styles.stepLabelActive : styles.stepLabelInactive,
            ]}
          >
            Schedule
          </Text>
        </View>

        {/* Connector 2 -> 3 */}
        <View
          style={[
            styles.stepConnector,
            activeStepNumber >= 3 ? styles.stepConnectorGreen : styles.stepConnectorInactive,
          ]}
        />

        {/* Step 3: Review */}
        <View style={styles.stepColumn}>
          <View
            style={[
              styles.stepBadge,
              activeStepNumber === 3 ? styles.stepBadgeGreen : styles.stepBadgeInactive,
            ]}
          >
            <Text
              style={
                activeStepNumber === 3
                  ? styles.stepBadgeTextActive
                  : styles.stepBadgeTextInactive
              }
            >
              3
            </Text>
          </View>
          <Text
            style={[
              styles.stepLabel,
              activeStepNumber === 3 ? styles.stepLabelActive : styles.stepLabelInactive,
            ]}
          >
            Review
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      {/* ========================================================================= */}
      {/* 1. STEP 1: ENTER BOOKING DETAILS (Image 1)                                */}
      {/* ========================================================================= */}
      {currentStep === 'details' && (
        <View style={styles.screenContainer}>
          {renderHeader(false)}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderProgressStepper(1)}

            <Text style={styles.pageTitle}>Enter Booking Details</Text>
            <Text style={styles.pageSubtitle}>
              Please confirm patient information and doorstep service location
            </Text>

            {/* Contextual Service Header Summary Card */}
            <View style={styles.step1ServiceCard}>
              <Image
                source={getProviderAvatar()}
                style={styles.step1ServiceAvatar}
                resizeMode="cover"
              />
              <View style={styles.step1ServiceInfo}>
                <View style={styles.step1ServiceBadgeRow}>
                  <View style={styles.step1ServiceCategoryBadge}>
                    <Ionicons name="sparkles" size={11} color="#0F5B43" style={{ marginRight: 3 }} />
                    <Text style={styles.step1ServiceCategoryText}>Doorstep Care</Text>
                  </View>
                  <Text style={styles.step1ServicePriceText}>{priceLabel}</Text>
                </View>
                <Text style={styles.step1ServiceTitle} numberOfLines={1}>
                  {serviceTitle}
                </Text>
                <Text style={styles.step1ServiceProvider} numberOfLines={1}>
                  {providerName} • {service?.category || 'Demo service'}
                </Text>
              </View>
            </View>

            {/* "Booking For" Patient Segment Switcher */}
            <View style={styles.patientSelectorCard}>
              <Text style={styles.patientSelectorTitle}>Who is this appointment for?</Text>
              <View style={styles.patientTabsRow}>
                <TouchableOpacity accessibilityRole="button"
                  style={[
                    styles.patientTabPill,
                    patientType === 'myself' && styles.patientTabPillActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => {
                    setPatientType('myself');
                    setFullName(user?.name || '');
                    setPhoneNumber('+91 98765 43210');
                  }}
                >
                  <Ionicons
                    name="person"
                    size={13}
                    color={patientType === 'myself' ? '#FFFFFF' : '#0F5B43'}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[
                      styles.patientTabText,
                      patientType === 'myself' && styles.patientTabTextActive,
                    ]}
                  >
                    Myself
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity accessibilityRole="button"
                  style={[
                    styles.patientTabPill,
                    patientType === 'family' && styles.patientTabPillActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => {
                    setPatientType('family');
                    setFullName('Sneha Mehta');
                  }}
                >
                  <Ionicons
                    name="people"
                    size={13}
                    color={patientType === 'family' ? '#FFFFFF' : '#0F5B43'}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[
                      styles.patientTabText,
                      patientType === 'family' && styles.patientTabTextActive,
                    ]}
                  >
                    Family
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity accessibilityRole="button"
                  style={[
                    styles.patientTabPill,
                    patientType === 'senior' && styles.patientTabPillActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => {
                    setPatientType('senior');
                    setFullName('Ramesh Mehta (Senior)');
                  }}
                >
                  <Ionicons
                    name="heart"
                    size={13}
                    color={patientType === 'senior' ? '#FFFFFF' : '#0F5B43'}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[
                      styles.patientTabText,
                      patientType === 'senior' && styles.patientTabTextActive,
                    ]}
                  >
                    Senior Care
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Input Form Fields Container */}
            <View style={styles.formSectionContainer}>
              <Text style={styles.formSectionHeading}>Patient & Contact Details</Text>

              {/* Unified Single Card for Patient & Contact Details */}
              <View style={styles.unifiedFormCard}>
                {/* Row 1: Full Name */}
                <View style={styles.formRowItem}>
                  <View style={styles.inputIconCircle}>
                    <Ionicons name="person-outline" size={18} color="#0F5B43" />
                  </View>
                  <View style={styles.inputCol}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                      value={fullName}
                      onChangeText={setFullName}
                      style={styles.inputTextValue}
                      placeholder="Enter full name"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>

                <View style={styles.formRowDivider} />

                {/* Row 2: Phone Number */}
                <View style={styles.formRowItem}>
                  <View style={styles.inputIconCircle}>
                    <Ionicons name="call-outline" size={18} color="#0F5B43" />
                  </View>
                  <View style={styles.inputCol}>
                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <TextInput
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                      style={styles.inputTextValue}
                      placeholder="+91 00000 00000"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                  <View style={styles.inputVerifiedPill}>
                    <Ionicons name="checkmark-circle" size={13} color="#059669" style={{ marginRight: 3 }} />
                    <Text style={styles.inputVerifiedText}>Demo</Text>
                  </View>
                </View>

                <View style={styles.formRowDivider} />

                {/* Row 3: Email Address */}
                <View style={styles.formRowItem}>
                  <View style={styles.inputIconCircle}>
                    <Ionicons name="mail-outline" size={18} color="#0F5B43" />
                  </View>
                  <View style={styles.inputCol}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput
                      value={emailAddress}
                      onChangeText={setEmailAddress}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={styles.inputTextValue}
                      placeholder="name@example.com"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                  <View style={styles.inputVerifiedPill}>
                    <Ionicons name="checkmark-circle" size={13} color="#059669" style={{ marginRight: 3 }} />
                    <Text style={styles.inputVerifiedText}>Demo</Text>
                  </View>
                </View>

                <View style={styles.formRowDivider} />

                {/* Row 4: Service Address */}
                <View style={styles.formRowItem}>
                  <View style={styles.inputIconCircle}>
                    <Ionicons name="location-outline" size={18} color="#0F5B43" />
                  </View>
                  <View style={styles.inputCol}>
                    <View style={styles.addressLabelRow}>
                      <Text style={styles.inputLabel}>Service Address</Text>
                      <View style={styles.defaultAddressTag}>
                        <Text style={styles.defaultAddressTagText}>Home</Text>
                      </View>
                    </View>
                    <TextInput
                      value={serviceAddress}
                      onChangeText={setServiceAddress}
                      multiline
                      style={styles.inputTextValue}
                      placeholder="Enter street, apartment, city, pincode"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#6B7E75" />
                </View>
              </View>
            </View>

            {/* Visit Reason / Symptoms (Optional) */}
            <View style={styles.visitReasonCard}>
              <View style={styles.visitReasonHeader}>
                <Ionicons name="medkit-outline" size={15} color="#0F5B43" style={{ marginRight: 6 }} />
                <Text style={styles.visitReasonTitle}>Reason for Visit (Optional)</Text>
              </View>
              <View style={styles.reasonChipsRow}>
                {['General Checkup', 'Fever / Cold', 'Blood Pressure', 'Bedside Care'].map((tag) => (
                  <TouchableOpacity accessibilityRole="button"
                    key={tag}
                    style={[
                      styles.reasonChip,
                      selectedReason === tag && styles.reasonChipActive,
                    ]}
                    activeOpacity={0.75}
                    onPress={() => setSelectedReason(selectedReason === tag ? '' : tag)}
                  >
                    <Text
                      style={[
                        styles.reasonChipText,
                        selectedReason === tag && styles.reasonChipTextActive,
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Trust & Safety Assurance Banner */}
            <View style={styles.step1TrustBanner}>
              <Ionicons name="shield-checkmark" size={16} color="#0F5B43" style={{ marginRight: 8 }} />
              <Text style={styles.step1TrustText}>
                Demo service request • No payment collected
              </Text>
            </View>
          </ScrollView>

          {/* Sticky Bottom Action Button */}
          <View style={styles.bottomActionBar}>
            <TouchableOpacity accessibilityRole="button"
              style={styles.primaryActionButton}
              onPress={handleStep1Continue}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryActionButtonText}>Continue to Schedule →</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ========================================================================= */}
      {/* 2. STEP 2: CHOOSE DATE & TIME (Image 6)                                  */}
      {/* ========================================================================= */}
      {currentStep === 'schedule' && (
        <View style={styles.screenContainer}>
          {renderHeader(false)}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderProgressStepper(2)}

            <Text style={styles.pageTitle}>Choose Date & Time</Text>

            {/* Select Date Section with Full Interactive Calendar */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeadingText}>Select Date</Text>
              <Ionicons name="calendar-outline" size={20} color="#102820" />
            </View>

            <View style={styles.calendarCard}>
              {/* Calendar Month Header with Prev/Next Controls */}
              <View style={styles.calendarHeaderRow}>
                <TouchableOpacity accessibilityRole="button"
                  onPress={handlePrevMonth}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.7}
                  accessibilityLabel="Previous month"
                >
                  <Ionicons name="chevron-back" size={20} color="#102820" />
                </TouchableOpacity>
                <Text style={styles.calendarMonthText}>
                  {MONTH_NAMES[calendarMonth]} {calendarYear}
                </Text>
                <TouchableOpacity accessibilityRole="button"
                  onPress={handleNextMonth}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.7}
                  accessibilityLabel="Next month"
                >
                  <Ionicons name="chevron-forward" size={20} color="#102820" />
                </TouchableOpacity>
              </View>

              {/* Weekday Labels (Mon - Sun) */}
              <View style={styles.calendarWeekdaysRow}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((w) => (
                  <Text key={w} style={styles.calendarWeekdayLabel}>
                    {w}
                  </Text>
                ))}
              </View>

              {/* Full Month Calendar Grid */}
              <View style={styles.calendarDaysGrid}>
                {/* Empty cells before 1st of month */}
                {Array.from({ length: firstDayOffset }).map((_, i) => (
                  <View key={`empty-${i}`} style={styles.calendarDayCell} />
                ))}

                {/* Day cells for the month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const d = i + 1;
                  const isSelected = selectedDayNumber === d;
                  return (
                    <TouchableOpacity accessibilityRole="button"
                      key={d}
                      onPress={() => handleSelectDay(d)}
                      activeOpacity={0.75}
                      style={[
                        styles.calendarDayCell,
                        isSelected && styles.calendarDayCellActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.calendarDayText,
                          isSelected && styles.calendarDayTextActive,
                        ]}
                      >
                        {d}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Select Time Section */}
            <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
              <Text style={styles.sectionHeadingText}>Select Time</Text>
            </View>

            {/* Time Slot Grid (3 columns matching Image 6) */}
            <View style={styles.timeSlotGrid}>
              {SCHEDULE_TIMES.map((time) => {
                const isSelected = selectedTimeSlot === time;
                return (
                  <TouchableOpacity accessibilityRole="button"
                    key={time}
                    onPress={() => setSelectedTimeSlot(time)}
                    activeOpacity={0.85}
                    style={[
                      styles.timeSlotPill,
                      isSelected ? styles.timeSlotPillActive : styles.timeSlotPillInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.timeSlotPillText,
                        isSelected
                          ? styles.timeSlotTextActive
                          : styles.timeSlotTextInactive,
                      ]}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Sticky Bottom Action Button */}
          <View style={styles.bottomActionBar}>
            <TouchableOpacity accessibilityRole="button"
              style={styles.primaryActionButton}
              onPress={handleStep2Continue}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryActionButtonText}>Continue →</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ========================================================================= */}
      {/* 3. STEP 3: REVIEW & CONFIRM (Enhanced UI/UX)                               */}
      {/* ========================================================================= */}
      {currentStep === 'review' && (
        <View style={styles.screenContainer}>
          {renderHeader(false)}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderProgressStepper(3)}

            <Text style={styles.pageTitle}>Review & Confirm</Text>
            <Text style={styles.pageSubtitle}>
              Please verify your appointment and patient details before proceeding.
            </Text>

            {/* 1. Doctor & Service Hero Card */}
            <View style={styles.reviewDoctorCard}>
              <Image
                source={getProviderAvatar()}
                style={styles.reviewDoctorAvatar}
                resizeMode="cover"
              />
              <View style={styles.reviewDoctorInfo}>
                <View style={styles.reviewVerifiedBadge}>
                  <Ionicons name="shield-checkmark" size={13} color="#059669" />
                  <Text style={styles.reviewVerifiedText}>Verified Care Provider</Text>
                </View>
                <Text style={styles.reviewServiceName}>{serviceTitle}</Text>
                <Text style={styles.reviewDoctorName}>{providerName}</Text>
                <Text style={styles.reviewDoctorMeta}>{params.specialty || service?.category || 'Specialist Consultation'}</Text>
              </View>
            </View>

            {/* 2. Emphasized Schedule & Location Card */}
            <View style={styles.reviewScheduleCard}>
              <View style={styles.reviewScheduleHeader}>
                <View style={styles.reviewScheduleIconBadge}>
                  <Ionicons name="calendar-outline" size={18} color="#0F5B43" />
                </View>
                <View>
                  <Text style={styles.reviewScheduleHeaderText}>Appointment Schedule</Text>
                  <Text style={styles.reviewScheduleSubheader}>Confirmed home consultation visit</Text>
                </View>
              </View>

              <View style={styles.reviewScheduleRow}>
                <View style={styles.reviewScheduleIconBox}>
                  <Ionicons name="calendar" size={18} color="#0F5B43" />
                </View>
                <View style={styles.reviewScheduleTextCol}>
                  <Text style={styles.reviewScheduleLabel}>APPOINTMENT DATE</Text>
                  <Text style={styles.reviewScheduleValue}>{bookingConfirmedDate}</Text>
                </View>
              </View>

              <View style={styles.reviewScheduleDivider} />

              <View style={styles.reviewScheduleRow}>
                <View style={styles.reviewScheduleIconBox}>
                  <Ionicons name="time" size={18} color="#0F5B43" />
                </View>
                <View style={styles.reviewScheduleTextCol}>
                  <Text style={styles.reviewScheduleLabel}>TIME SLOT</Text>
                  <View style={styles.reviewTimeBadgeRow}>
                    <Text style={styles.reviewScheduleValue}>{bookingConfirmedTime}</Text>
                    <View style={styles.reviewDurationTag}>
                      <Text style={styles.reviewDurationTagText}>30 mins visit</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.reviewScheduleDivider} />

              <View style={styles.reviewScheduleRow}>
                <View style={styles.reviewScheduleIconBox}>
                  <Ionicons name="location" size={18} color="#0F5B43" />
                </View>
                <View style={styles.reviewScheduleTextCol}>
                  <View style={styles.reviewAddressLabelRow}>
                    <Text style={styles.reviewScheduleLabel}>SERVICE ADDRESS</Text>
                    <View style={styles.homePill}>
                      <Text style={styles.homePillText}>Home</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewAddressValue}>{serviceAddress}</Text>
                </View>
              </View>
            </View>

            {/* 3. Patient Information Card */}
            <View style={styles.reviewSectionCard}>
              <View style={styles.reviewCardHeader}>
                <Ionicons name="person-outline" size={18} color="#0F5B43" />
                <Text style={styles.reviewCardHeaderText}>Patient Information</Text>
              </View>

              <View style={styles.reviewItemRow}>
                <View style={styles.reviewItemIconWrap}>
                  <Ionicons name="person" size={16} color="#102820" />
                </View>
                <View style={styles.reviewItemTextCol}>
                  <Text style={styles.reviewItemLabel}>Patient Name</Text>
                  <Text style={styles.reviewItemValue}>{fullName} ({patientType === 'myself' ? 'Self' : patientType === 'family' ? 'Family' : 'Senior'})</Text>
                </View>
              </View>

              <View style={styles.reviewInnerDivider} />

              <View style={styles.reviewItemRow}>
                <View style={styles.reviewItemIconWrap}>
                  <Ionicons name="call" size={16} color="#102820" />
                </View>
                <View style={styles.reviewItemTextCol}>
                  <Text style={styles.reviewItemLabel}>Contact Number</Text>
                  <Text style={styles.reviewItemValue}>{phoneNumber}</Text>
                </View>
              </View>
            </View>

            {/* 4. Bill Details / Pricing Summary Card */}
            <View style={styles.reviewSectionCard}>
              <View style={styles.reviewCardHeader}>
                <Ionicons name="receipt-outline" size={18} color="#0F5B43" />
                <Text style={styles.reviewCardHeaderText}>Bill Summary</Text>
              </View>

              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Service Fee</Text>
                <Text style={styles.billValue}>{priceLabel}</Text>
              </View>

              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Home Visit Convenience</Text>
                <View style={styles.freeBadgeRow}>
                  <Text style={styles.billStrikeValue}>₹200</Text>
                  <Text style={styles.freeBadgeText}>FREE</Text>
                </View>
              </View>

              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Medical Sanitization Kit</Text>
                <Text style={styles.freeBadgeText}>FREE</Text>
              </View>

              <View style={styles.reviewInnerDivider} />

              <View style={[styles.billRow, { marginTop: 4 }]}>
                <Text style={styles.billTotalLabel}>Total Amount</Text>
                <Text style={styles.billTotalValue}>{priceLabel}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Sticky Bottom Action Bar with Total on Left */}
          <View style={styles.reviewBottomBar}>
            <View style={styles.reviewBottomPriceCol}>
              <Text style={styles.reviewBottomPriceLabel}>Total Amount</Text>
              <Text style={styles.reviewBottomPriceValue}>{priceLabel}</Text>
            </View>

            <TouchableOpacity accessibilityRole="button"
              style={styles.reviewBottomButton}
              onPress={handleStep3ProceedToPayment}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryActionButtonText}>Proceed to Payment →</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* ========================================================================= */}
      {/* 4. PAYMENT SCREEN (Enhanced UI/UX)                                        */}
      {/* ========================================================================= */}
      {currentStep === 'payment' && (
        <View style={styles.screenContainer}>
          {renderHeader(false)}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.pageTitle}>Payment</Text>
            <Text style={styles.pageSubtitle}>
              Preview your payment preference. No payment is collected in this demo.
            </Text>

            {/* 1. Enhanced Booking Amount Card with Breakdown Pill */}
            <View style={styles.bookingAmountCard}>
              <View style={styles.bookingAmountTopRow}>
                <View>
                  <Text style={styles.bookingAmountLabel}>Estimated Demo Amount</Text>
                  <Text style={styles.bookingAmountValue}>{priceLabel}</Text>
                </View>
                <View style={styles.instantRefundBadge}>
                  <Ionicons name="shield-checkmark" size={14} color="#0F5B43" />
                  <Text style={styles.instantRefundText}>Demo Checkout</Text>
                </View>
              </View>

              <View style={styles.amountBreakdownPill}>
                <Text style={styles.amountBreakdownPillText}>
                  {serviceTitle} • {providerName} • {bookingConfirmedDate}
                </Text>
              </View>
            </View>

            {/* 2. Interactive Payment Methods List */}
            <View style={styles.paymentOptionsContainer}>
              {/* Option 1: UPI */}
              <TouchableOpacity accessibilityRole="button"
                onPress={() => setPaymentMethod('UPI')}
                activeOpacity={0.85}
                style={[
                  styles.paymentOptionItem,
                  paymentMethod === 'UPI' && styles.paymentOptionItemActive,
                ]}
              >
                <View style={styles.paymentOptionLeft}>
                  <View style={styles.upiIconBox}>
                    <Ionicons name="flash-outline" size={18} color="#0F5B43" />
                  </View>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.paymentOptionTitle}>UPI</Text>
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularBadgeText}>FASTEST</Text>
                      </View>
                    </View>
                    <Text style={styles.paymentOptionSub}>Google Pay, PhonePe, Paytm & UPI ID</Text>
                  </View>
                </View>

                <View style={styles.radioOuter}>
                  {paymentMethod === 'UPI' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>

              {/* UPI Sub-option when active */}
              {paymentMethod === 'UPI' && (
                <View style={styles.upiExpandedContent}>
                  <Text style={styles.upiExpandedLabel}>Select your preferred app:</Text>
                  <View style={styles.upiAppsGrid}>
                    <View style={styles.upiAppPill}>
                      <Text style={[styles.upiAppPillText, { color: '#4285F4' }]}>Google Pay</Text>
                    </View>
                    <View style={styles.upiAppPill}>
                      <Text style={[styles.upiAppPillText, { color: '#5F259F' }]}>PhonePe</Text>
                    </View>
                    <View style={styles.upiAppPill}>
                      <Text style={[styles.upiAppPillText, { color: '#00BAF2' }]}>Paytm</Text>
                    </View>
                  </View>
                </View>
              )}

              <View style={styles.paymentDivider} />

              {/* Option 2: Debit / Credit Card */}
              <TouchableOpacity accessibilityRole="button"
                onPress={() => setPaymentMethod('CARD')}
                activeOpacity={0.85}
                style={[
                  styles.paymentOptionItem,
                  paymentMethod === 'CARD' && styles.paymentOptionItemActive,
                ]}
              >
                <View style={styles.paymentOptionLeft}>
                  <View style={styles.upiIconBox}>
                    <Ionicons name="card-outline" size={18} color="#0F5B43" />
                  </View>
                  <View>
                    <Text style={styles.paymentOptionTitle}>Debit / Credit Card</Text>
                    <Text style={styles.paymentOptionSub}>Visa, Mastercard, RuPay & Amex</Text>
                  </View>
                </View>
                <View style={styles.radioOuter}>
                  {paymentMethod === 'CARD' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>

              <View style={styles.paymentDivider} />

              {/* Option 3: Net Banking */}
              <TouchableOpacity accessibilityRole="button"
                onPress={() => setPaymentMethod('NETBANKING')}
                activeOpacity={0.85}
                style={[
                  styles.paymentOptionItem,
                  paymentMethod === 'NETBANKING' && styles.paymentOptionItemActive,
                ]}
              >
                <View style={styles.paymentOptionLeft}>
                  <View style={styles.upiIconBox}>
                    <Ionicons name="business-outline" size={18} color="#0F5B43" />
                  </View>
                  <View>
                    <Text style={styles.paymentOptionTitle}>Net Banking</Text>
                    <Text style={styles.paymentOptionSub}>All Indian Major Banks Supported</Text>
                  </View>
                </View>
                <View style={styles.radioOuter}>
                  {paymentMethod === 'NETBANKING' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>

              <View style={styles.paymentDivider} />

              {/* Option 4: Wallets */}
              <TouchableOpacity accessibilityRole="button"
                onPress={() => setPaymentMethod('WALLET')}
                activeOpacity={0.85}
                style={[
                  styles.paymentOptionItem,
                  paymentMethod === 'WALLET' && styles.paymentOptionItemActive,
                ]}
              >
                <View style={styles.paymentOptionLeft}>
                  <View style={styles.upiIconBox}>
                    <Ionicons name="wallet-outline" size={18} color="#0F5B43" />
                  </View>
                  <View>
                    <Text style={styles.paymentOptionTitle}>Wallets</Text>
                    <Text style={styles.paymentOptionSub}>Amazon Pay, Paytm Wallet & Mobikwik</Text>
                  </View>
                </View>
                <View style={styles.radioOuter}>
                  {paymentMethod === 'WALLET' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            </View>

            {/* 3. Security Trust Badges */}
            <View style={styles.paymentTrustRow}>
              <View style={styles.paymentTrustItem}>
                <Ionicons name="lock-closed" size={15} color="#0F5B43" />
                <Text style={styles.paymentTrustText}>No charge in this demo</Text>
              </View>
              <View style={styles.paymentTrustItem}>
                <Ionicons name="shield-checkmark" size={15} color="#0F5B43" />
                <Text style={styles.paymentTrustText}>Payment service unavailable</Text>
              </View>
            </View>
          </ScrollView>

          {/* Sticky Bottom Action Button */}
          <View style={styles.bottomActionBar}>
            <TouchableOpacity accessibilityRole="button"
              style={styles.primaryActionButton}
              onPress={handleStep4Pay}
              activeOpacity={0.88}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="lock-closed" size={16} color="#FFFFFF" />
                <Text style={styles.primaryActionButtonText}>Save Demo Request →</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ========================================================================= */}
      {/* 5. BOOKING CONFIRMED! SCREEN (Enhanced UI/UX)                             */}
      {/* ========================================================================= */}
      {currentStep === 'confirmed' && (
        <View style={styles.screenContainer}>
          <ScrollView
            contentContainerStyle={[styles.scrollContent, { alignItems: 'center', paddingTop: 24, paddingBottom: 40 }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Celebration Icon with Confetti particles */}
            <View style={styles.celebrationContainer}>
              <View style={[styles.confettiDash, { top: 4, left: 16, backgroundColor: '#34D399', transform: [{ rotate: '-30deg' }] }]} />
              <View style={[styles.confettiDash, { top: 0, right: 26, backgroundColor: '#FBBF24', transform: [{ rotate: '45deg' }] }]} />
              <View style={[styles.confettiDash, { top: 22, right: 10, backgroundColor: '#F59E0B', transform: [{ rotate: '15deg' }] }]} />
              <View style={[styles.confettiDash, { bottom: 18, left: 14, backgroundColor: '#FBBF24', transform: [{ rotate: '30deg' }] }]} />
              <View style={[styles.confettiDash, { bottom: 16, right: 18, backgroundColor: '#34D399', transform: [{ rotate: '-45deg' }] }]} />

              <View style={styles.celebrationOuterGlow}>
                <View style={styles.confirmedCheckCircle}>
                  <Ionicons name="checkmark" size={38} color="#FFFFFF" />
                </View>
              </View>
            </View>

            <Text style={styles.confirmedTitle}>Demo Request Saved</Text>
            <Text style={styles.confirmedSubtitle}>
              Your demo request has been saved for this session. No payment was taken.
            </Text>

            {/* Booking Reference Pill */}
            <TouchableOpacity accessibilityRole="button"
              style={styles.bookingRefPill}
              activeOpacity={0.85}
              onPress={handleViewMyBookings}
            >
              <Text style={styles.bookingRefLabel}>Booking Reference:</Text>
              <Text style={styles.bookingRefCode}>{bookingReference}</Text>
              <Ionicons name="copy-outline" size={15} color="#0F5B43" />
            </TouchableOpacity>

            {/* 1. Bedside Verification PIN Card (Crucial Healthcare Feature) */}
            <View style={styles.bedsidePinCard}>
              <View style={styles.bedsidePinHeader}>
                <Ionicons name="key" size={18} color="#0F5B43" />
                <Text style={styles.bedsidePinTitle}>Bedside Verification PIN</Text>
              </View>
              <View style={styles.pinDigitsRow}>
                {['4', '8', '2', '9'].map((digit, idx) => (
                  <View key={idx} style={styles.pinDigitBox}>
                    <Text style={styles.pinDigitText}>{digit}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.bedsidePinHelp}>
                Share this 4-digit code with {providerName} when they arrive at your home to verify identity.
              </Text>
            </View>

            {/* 2. Confirmed Summary Card with Doctor Info */}
            <TouchableOpacity accessibilityRole="button"
              style={styles.confirmedSummaryCard}
              activeOpacity={0.9}
              onPress={handleViewMyBookings}
            >
              {/* Doctor Row */}
              <View style={styles.confirmedDoctorRow}>
                <Image
                  source={getProviderAvatar()}
                  style={styles.confirmedDoctorAvatar}
                  resizeMode="cover"
                />
                <View style={styles.confirmedDoctorCol}>
                  <Text style={styles.confirmedDoctorName}>{providerName}</Text>
                  <Text style={styles.confirmedDoctorRole}>{serviceTitle}</Text>
                  <View style={styles.confirmedBadgeSmall}>
                    <Text style={styles.confirmedBadgeSmallText}>Assignment pending</Text>
                  </View>
                </View>
              </View>

              <View style={styles.confirmedDivider} />

              <View style={styles.confirmedInfoRow}>
                <Ionicons name="calendar-outline" size={19} color="#102820" style={{ marginRight: 12 }} />
                <View>
                  <Text style={styles.confirmedRowLabel}>Date</Text>
                  <Text style={styles.confirmedInfoValue}>{bookingConfirmedDate}</Text>
                </View>
              </View>

              <View style={styles.confirmedDivider} />

              <View style={styles.confirmedInfoRow}>
                <Ionicons name="time-outline" size={19} color="#102820" style={{ marginRight: 12 }} />
                <View>
                  <Text style={styles.confirmedRowLabel}>Time Slot</Text>
                  <Text style={styles.confirmedInfoValue}>{bookingConfirmedTime}</Text>
                </View>
              </View>

              <View style={styles.confirmedDivider} />

              <View style={styles.confirmedInfoRow}>
                <Ionicons name="location-outline" size={19} color="#102820" style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.confirmedRowLabel}>Visit Address</Text>
                  <Text style={[styles.confirmedInfoValue, { flex: 1 }]}>{serviceAddress}</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* 3. Next Steps Timeline */}
            <View style={styles.nextStepsCard}>
              <Text style={styles.nextStepsHeading}>What happens next?</Text>

              <View style={styles.timelineItem}>
                <View style={styles.timelineDotActive} />
                <View style={styles.timelineTextCol}>
                  <Text style={styles.timelineTitle}>1. Confirmation SMS & Email</Text>
                  <Text style={styles.timelineSub}>Demo request saved locally for this session.</Text>
                </View>
              </View>

              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineTextCol}>
                  <Text style={styles.timelineTitle}>2. Doctor Pre-Visit Call</Text>
                  <Text style={styles.timelineSub}>Clinician contact requires a live service.</Text>
                </View>
              </View>

              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineTextCol}>
                  <Text style={styles.timelineTitle}>3. Home Consultation</Text>
                  <Text style={styles.timelineSub}>Comprehensive checkup, prescription & guidance.</Text>
                </View>
              </View>
            </View>

            {/* 4. Action Buttons */}
            <View style={styles.confirmedActionsWrap}>
              <TouchableOpacity accessibilityRole="button"
                style={styles.primaryActionButton}
                onPress={handleViewMyBookings}
                activeOpacity={0.88}
              >
                <Text style={styles.primaryActionButtonText}>View My Bookings</Text>
              </TouchableOpacity>

              <TouchableOpacity accessibilityRole="button"
                style={styles.secondaryLinkButton}
                onPress={handleBookAnotherService}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryLinkButtonText}>Book Another Service</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
      {/* ========================================================================= */}
      {/* 6. BOOKING DETAILS SCREEN (Image 4 Improved UI/UX)                        */}
      {/* ========================================================================= */}
      {currentStep === 'details_view' && (
        <View style={styles.screenContainer}>
          {/* Top Bar with Back, Logo & Helpdesk */}
          <View style={styles.detailsHeaderBar}>
            <TouchableOpacity accessibilityRole="button"
              style={styles.detailsHeaderBtn}
              activeOpacity={0.7}
              onPress={handleBack}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="arrow-back" size={24} color="#102820" />
            </TouchableOpacity>

            <Image
              source={require('../../../assets/images/logo-dark.png')}
              style={styles.detailsHeaderLogo}
              resizeMode="contain"
            />

            <TouchableOpacity accessibilityRole="button"
              style={styles.detailsHeaderBtn}
              activeOpacity={0.7}
              onPress={() => {
                Alert.alert(
                  'Vellora Care Desk',
                  'Need assistance with this booking? Our 24/7 care team is available.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Call Helpline', onPress: () => Linking.openURL('tel:+918049108800') },
                  ]
                );
              }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="help-circle-outline" size={24} color="#0F5B43" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Title & Reference Info */}
            <View style={styles.detailsHeadingWrap}>
              <Text style={styles.pageTitle}>Booking Details</Text>
              <View style={styles.detailsRefBadgeRow}>
                <Text style={styles.detailsRefCode}>
                  {bookingReference}
                </Text>
                <View style={styles.detailsRefDot} />
                <Text style={styles.detailsRefType}>Doorstep Clinical Care</Text>
              </View>
            </View>



            {/* 2. Top Doctor / Specialist Card */}
            <View style={styles.bookingDetailsDoctorCard}>
              <View style={styles.detailsAvatarWrap}>
                <Image
                  source={getProviderAvatar()}
                  style={styles.detailsDoctorAvatar}
                  resizeMode="cover"
                />
                {bookingStatus !== 'Cancelled' && (
                  <View style={styles.detailsVerifiedBadge}>
                    <Ionicons name="shield-checkmark" size={11} color="#FFFFFF" />
                  </View>
                )}
              </View>

              <View style={styles.detailsHeaderInfo}>
                <View style={styles.doctorHeaderNameRow}>
                  <Text style={styles.detailsDoctorName}>{providerName}</Text>
                  <View style={styles.doctorRatingTag}>
                    <Ionicons name="star" size={11} color="#D97706" style={{ marginRight: 2 }} />
                    <Text style={styles.doctorRatingTagText}>4.9</Text>
                  </View>
                </View>

                <Text style={styles.detailsServiceTitle}>{serviceTitle}</Text>
                <Text style={styles.detailsDoctorSubtext}>
                  {serviceTitle.includes('Nursing')
                    ? 'Registered Senior Nurse • Critical Care'
                    : serviceTitle.includes('Lab')
                    ? 'Certified Phlebotomist • Sterile Draw'
                    : serviceTitle.includes('Physio')
                    ? 'Lead Physiotherapist • BPT, MPT'
                    : 'Consultant Physician, MBBS, MD'}
                </Text>

                <View style={styles.doctorBadgeTagsRow}>
                  <View style={styles.doctorPillTag}>
                    <Ionicons name="ribbon-outline" size={11} color="#0F5B43" style={{ marginRight: 3 }} />
                    <Text style={styles.doctorPillTagText}>12+ Yrs Exp</Text>
                  </View>
                  <View style={styles.doctorPillTag}>
                    <Ionicons name="shield-checkmark-outline" size={11} color="#0F5B43" style={{ marginRight: 3 }} />
                    <Text style={styles.doctorPillTagText}>Demo clinician selection</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 3. Doorstep Bedside Verification PIN */}
            {bookingStatus !== 'Cancelled' && (
              <View style={styles.detailsBedsidePinCard}>
                <View style={styles.bedsidePinLeftCol}>
                  <View style={styles.bedsidePinIconWrap}>
                    <Ionicons name="key-outline" size={20} color="#0F5B43" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.bedsidePinHeading}>Doorstep Verification PIN</Text>
                    <Text style={styles.bedsidePinSubheading}>
                      Share this 4-digit code with the clinician upon arrival
                    </Text>
                  </View>
                </View>
                <View style={styles.bedsidePinBadge}>
                  <Text style={styles.bedsidePinBadgeText}>4 8 2 9</Text>
                </View>
              </View>
            )}

            {/* 4. Appointment & Location Schedule Card */}
            <View style={styles.bookingDetailsListCard}>
              <Text style={styles.cardHeaderTitleText}>Schedule & Location</Text>

              {/* Row 1: Date */}
              <View style={styles.detailsDataRow}>
                <View style={styles.detailsIconCircle}>
                  <Ionicons name="calendar-outline" size={18} color="#0F5B43" />
                </View>
                <View style={styles.detailsDataCol}>
                  <Text style={styles.detailsDataLabel}>Scheduled Date</Text>
                  <Text style={styles.detailsDataValue}>{bookingConfirmedDate}</Text>
                </View>
              </View>

              <View style={styles.detailsCardDivider} />

              {/* Row 2: Time */}
              <View style={styles.detailsDataRow}>
                <View style={styles.detailsIconCircle}>
                  <Ionicons name="time-outline" size={18} color="#0F5B43" />
                </View>
                <View style={styles.detailsDataCol}>
                  <Text style={styles.detailsDataLabel}>Time Slot</Text>
                  <Text style={styles.detailsDataValue}>
                    {bookingConfirmedTime} (30 mins bedside consultation)
                  </Text>
                </View>
              </View>

              <View style={styles.detailsCardDivider} />

              {/* Row 3: Address */}
              <View style={styles.detailsDataRow}>
                <View style={styles.detailsIconCircle}>
                  <Ionicons name="location-outline" size={18} color="#0F5B43" />
                </View>
                <View style={styles.detailsDataCol}>
                  <Text style={styles.detailsDataLabel}>Service Address</Text>
                  <Text style={styles.detailsDataValue}>{serviceAddress}</Text>
                </View>
              </View>

              <View style={styles.detailsCardDivider} />

              {/* Row 4: Patient Info */}
              <View style={styles.detailsDataRow}>
                <View style={styles.detailsIconCircle}>
                  <Ionicons name="person-outline" size={18} color="#0F5B43" />
                </View>
                <View style={styles.detailsDataCol}>
                  <Text style={styles.detailsDataLabel}>Patient Details</Text>
                  <Text style={styles.detailsDataValue}>
                    {fullName || existingBooking?.patientName || 'Demo patient'} ({existingBooking?.patientRelationship || (patientType === 'myself' ? 'Self' : 'Family')}) • {phoneNumber || '+91 98765 43210'}
                  </Text>
                </View>
              </View>
            </View>

            {/* 5. Payment & Invoice Breakdown Card */}
            <View style={styles.detailsBillingCard}>
              <View style={styles.billingHeaderRow}>
                <Text style={styles.cardHeaderTitleText}>Payment & Receipt</Text>
                <View style={styles.billingPaidBadge}>
                  <Ionicons name="checkmark-circle" size={13} color="#059669" style={{ marginRight: 4 }} />
                  <Text style={styles.billingPaidBadgeText}>Demo — payment pending</Text>
                </View>
              </View>

              <View style={styles.billRowItem}>
                <Text style={styles.billRowLabel}>Bedside Consultation</Text>
                <Text style={styles.billRowValue}>₹1,000</Text>
              </View>

              <View style={styles.billRowItem}>
                <Text style={styles.billRowLabel}>Doorstep Transit & Sterile Kit</Text>
                <Text style={styles.billRowValue}>₹200</Text>
              </View>

              <View style={styles.billRowItem}>
                <Text style={styles.billRowLabel}>Healthcare GST (5%)</Text>
                <Text style={styles.billRowValue}>Included</Text>
              </View>

              <View style={styles.billRowDivider} />

              <View style={styles.billTotalRow}>
                <Text style={styles.detailsBillTotalLabel}>Estimated Amount</Text>
                <Text style={styles.detailsBillTotalValue}>{priceLabel}</Text>
              </View>

              <TouchableOpacity accessibilityRole="button"
                style={styles.downloadInvoiceBtn}
                activeOpacity={0.7}
                onPress={() => {
                  Alert.alert('Invoice unavailable', 'No tax invoice is issued for a demo request.');
                }}
              >
                <Ionicons name="document-text-outline" size={15} color="#0F5B43" style={{ marginRight: 6 }} />
                <Text style={styles.downloadInvoiceBtnText}>Download Tax Invoice</Text>
              </TouchableOpacity>
            </View>

            {/* 6. Home Visit Preparation & Clinical Checklist */}
            <View style={styles.detailsPreparationCard}>
              <View style={styles.prepHeaderRow}>
                <Ionicons name="shield-checkmark" size={18} color="#0F5B43" style={{ marginRight: 8 }} />
                <Text style={styles.cardHeaderTitleText}>What to expect during your visit</Text>
              </View>

              <View style={styles.prepStepRow}>
                <View style={styles.prepNumberCircle}><Text style={styles.prepNumberText}>1</Text></View>
                <Text style={styles.prepStepText}>
                  The clinician will call 15 minutes prior to arrival to confirm entry and gate access.
                </Text>
              </View>

              <View style={styles.prepStepRow}>
                <View style={styles.prepNumberCircle}><Text style={styles.prepNumberText}>2</Text></View>
                <Text style={styles.prepStepText}>
                  Please keep your previous medical records, prescriptions, and allergy notes handy.
                </Text>
              </View>

              <View style={styles.prepStepRow}>
                <View style={styles.prepNumberCircle}><Text style={styles.prepNumberText}>3</Text></View>
                <Text style={styles.prepStepText}>
                  Your official digital e-Prescription (e-Rx) will be synced to your app immediately after the visit.
                </Text>
              </View>
            </View>

            {/* 7. Action Buttons: Reschedule & Cancel */}
            <View style={styles.detailsActionButtonsCol}>
              {bookingStatus !== 'Cancelled' ? (
                <>
                  <TouchableOpacity accessibilityRole="button"
                    style={styles.rescheduleButton}
                    onPress={handleOpenReschedule}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="calendar-outline" size={19} color="#0F5B43" />
                    <Text style={styles.rescheduleButtonText}>Reschedule Appointment</Text>
                  </TouchableOpacity>

                  <TouchableOpacity accessibilityRole="button"
                    style={styles.cancelBookingButton}
                    onPress={handleOpenCancel}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="close-circle-outline" size={19} color="#DC2626" />
                    <Text style={styles.cancelBookingButtonText}>Cancel Booking</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.cancelledNoticeCard}>
                  <Ionicons name="information-circle" size={20} color="#DC2626" />
                  <Text style={styles.cancelledNoticeText}>
                    This appointment has been cancelled. No payment or refund is processed in this demo.
                  </Text>
                </View>
              )}

              {/* 24/7 Helpline Link */}
              <TouchableOpacity accessibilityRole="button"
                style={styles.helplineLinkRow}
                activeOpacity={0.7}
                onPress={() => Linking.openURL('tel:+918049108800')}
              >
                <Ionicons name="call-outline" size={15} color="#64748B" style={{ marginRight: 6 }} />
                <Text style={styles.helplineLinkText}>
                  Need immediate help? Call Care Desk (+91 80 4910 8800)
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}

      {/* ========================================================================= */}
      {/* 7. RESCHEDULE BOOKING SCREEN (Image 3)                                    */}
      {/* ========================================================================= */}
      {currentStep === 'reschedule' && (
        <View style={styles.screenContainer}>
          {renderHeader(false)}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.pageTitle}>Reschedule Booking</Text>
            <Text style={styles.pageSubtitle}>
              Choose a new date and time for your appointment.
            </Text>

            {/* Month Calendar Picker Card */}
            <View style={styles.calendarCard}>
              <View style={styles.calendarHeaderRow}>
                <TouchableOpacity onPress={handlePrevMonth} accessibilityRole="button" accessibilityLabel="Previous month" hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} activeOpacity={0.7}>
                  <Ionicons name="chevron-back" size={20} color="#102820" />
                </TouchableOpacity>
                <Text style={styles.calendarMonthText}>{MONTH_NAMES[calendarMonth]} {calendarYear}</Text>
                <TouchableOpacity accessibilityRole="button" hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} activeOpacity={0.7}>
                  <Ionicons name="chevron-forward" size={20} color="#102820" />
                </TouchableOpacity>
              </View>

              {/* Weekday Labels (Mon - Sun) */}
              <View style={styles.calendarWeekdaysRow}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((w) => (
                  <Text key={w} style={styles.calendarWeekdayLabel}>
                    {w}
                  </Text>
                ))}
              </View>

              {/* Calendar Grid (Days 12 to 25 matching Image 3) */}
              <View style={styles.calendarDaysGrid}>
                {Array.from({ length: firstDayOffset }, (_, index) => <View key={`offset-${index}`} style={styles.calendarDayCell} />)}
                {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((d) => {
                  const isSelected = rescheduleDay === d;
                  return (
                    <TouchableOpacity accessibilityRole="button"
                      key={d}
                      onPress={() => setRescheduleDay(d)}
                      activeOpacity={0.75}
                      style={[
                        styles.calendarDayCell,
                        isSelected && styles.calendarDayCellActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.calendarDayText,
                          isSelected && styles.calendarDayTextActive,
                        ]}
                      >
                        {d}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Available Time Slots Section */}
            <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
              <Text style={styles.sectionHeadingText}>Available Time Slots</Text>
            </View>

            <View style={styles.timeSlotGrid}>
              {RESCHEDULE_TIMES.map((time) => {
                const isSelected = rescheduleTime === time;
                return (
                  <TouchableOpacity accessibilityRole="button"
                    key={time}
                    onPress={() => setRescheduleTime(time)}
                    activeOpacity={0.85}
                    style={[
                      styles.timeSlotPill,
                      isSelected ? styles.timeSlotPillActive : styles.timeSlotPillInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.timeSlotPillText,
                        isSelected
                          ? styles.timeSlotTextActive
                          : styles.timeSlotTextInactive,
                      ]}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Sticky Bottom Action Button */}
          <View style={styles.bottomActionBar}>
            <TouchableOpacity accessibilityRole="button"
              style={styles.primaryActionButton}
              onPress={handleUpdateBooking}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryActionButtonText}>Update Booking →</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ========================================================================= */}
      {/* 8. CANCEL BOOKING SCREEN (Image 2)                                        */}
      {/* ========================================================================= */}
      {currentStep === 'cancel' && (
        <View style={styles.screenContainer}>
          {renderHeader(false)}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.pageTitle, { textAlign: 'center', marginTop: 10 }]}>
              Cancel Booking
            </Text>
            <Text style={[styles.pageSubtitle, { textAlign: 'center' }]}>
              Are you sure you want to cancel this appointment?
            </Text>

            {/* Summary Card with Doctor Avatar & Appointment Info */}
            <View style={styles.cancelSummaryCard}>
              <View style={styles.cancelDoctorHeader}>
                <Image
                  source={require('../../../assets/images/doctor-rohan.png')}
                  style={styles.cancelDoctorAvatar}
                  resizeMode="cover"
                />
                <Text style={styles.cancelSummaryTitle}>
                  Home Visit{'\n'}Doctor Consultation
                </Text>
              </View>

              <View style={styles.cancelDivider} />

              <View style={styles.cancelInfoRow}>
                <Ionicons name="calendar-outline" size={20} color="#102820" style={{ marginRight: 12 }} />
                <Text style={styles.cancelInfoValue}>{bookingConfirmedDate}</Text>
              </View>

              <View style={styles.cancelDivider} />

              <View style={styles.cancelInfoRow}>
                <Ionicons name="time-outline" size={20} color="#102820" style={{ marginRight: 12 }} />
                <Text style={styles.cancelInfoValue}>{bookingConfirmedTime}</Text>
              </View>
            </View>

            {/* Reason for Cancellation Dropdown */}
            <Text style={styles.cancelReasonLabel}>
              Reason for cancellation (optional)
            </Text>
            <TouchableOpacity accessibilityRole="button"
              style={styles.cancelReasonSelectBox}
              onPress={() => setShowCancelReasonModal(true)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.cancelReasonSelectText,
                  cancelReason === 'Select a reason' && { color: '#94A3B8' },
                ]}
              >
                {cancelReason}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#102820" />
            </TouchableOpacity>

            {/* Action Buttons: Red Cancel Booking & Outline Keep Booking */}
            <View style={styles.cancelActionButtonsCol}>
              <TouchableOpacity accessibilityRole="button"
                style={styles.confirmCancelButton}
                onPress={handleConfirmCancel}
                activeOpacity={0.85}
              >
                <Text style={styles.confirmCancelButtonText}>Cancel Booking</Text>
              </TouchableOpacity>

              <TouchableOpacity accessibilityRole="button"
                style={styles.keepBookingButton}
                onPress={() => setCurrentStep('details_view')}
                activeOpacity={0.85}
              >
                <Text style={styles.keepBookingButtonText}>Keep Booking</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Modal for selecting cancellation reason */}
          <Modal
            visible={showCancelReasonModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowCancelReasonModal(false)}
          >
            <TouchableOpacity accessibilityRole="button"
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={() => setShowCancelReasonModal(false)}
            >
              <View style={styles.modalContentCard}>
                <Text style={styles.modalHeading}>Select Cancellation Reason</Text>
                {CANCELLATION_REASONS.map((reason) => (
                  <TouchableOpacity accessibilityRole="button"
                    key={reason}
                    style={styles.modalReasonOption}
                    onPress={() => {
                      setCancelReason(reason);
                      setShowCancelReasonModal(false);
                    }}
                  >
                    <Text style={styles.modalReasonText}>{reason}</Text>
                    {cancelReason === reason && (
                      <Ionicons name="checkmark" size={18} color="#0F5B43" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      )}
    </SafeAreaView>
  );
}

// =========================================================================
// STYLES (Pixel-perfect matching 8 reference images)
// =========================================================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBFAF7',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#FBFAF7',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 110,
  },

  // -------------------------------------------------------------
  // Header Bar
  // -------------------------------------------------------------
  topHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: '#FBFAF7',
  },
  headerLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBrandLogo: {
    width: 130,
    height: 36,
  },

  // -------------------------------------------------------------
  // 3-Step Stepper
  // -------------------------------------------------------------
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 14,
  },
  stepColumn: {
    alignItems: 'center',
  },
  stepBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeGreen: {
    backgroundColor: '#0F5B43',
  },
  stepBadgeInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
  },
  stepBadgeTextActive: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Typography.fontFamily.sans,
  },
  stepBadgeTextInactive: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Typography.fontFamily.sans,
  },
  stepLabel: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: Typography.fontFamily.sans,
  },
  stepLabelActive: {
    color: '#102820',
    fontWeight: '600',
  },
  stepLabelInactive: {
    color: '#64748B',
    fontWeight: '400',
  },
  stepConnector: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
    marginBottom: 18,
  },
  stepConnectorGreen: {
    backgroundColor: '#0F5B43',
  },
  stepConnectorInactive: {
    backgroundColor: '#DCE9E1',
  },

  // -------------------------------------------------------------
  // Typography
  // -------------------------------------------------------------
  pageTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0F5B43',
    marginBottom: 16,
    letterSpacing: -0.3,
    fontFamily: Typography.fontFamily.sans,
  },
  pageSubtitle: {
    fontSize: 13.5,
    fontWeight: '400',
    color: '#64748B',
    marginBottom: 20,
    marginTop: -8,
    lineHeight: 18,
    fontFamily: Typography.fontFamily.sans,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeadingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#102820',
    fontFamily: Typography.fontFamily.sans,
  },

  // -------------------------------------------------------------
  // Input Cards & Enhanced Step 1
  // -------------------------------------------------------------
  step1ServiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
    padding: 12,
    marginBottom: 14,
    shadowColor: '#102820',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  step1ServiceAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#DCE9E1',
  },
  step1ServiceInfo: {
    flex: 1,
  },
  step1ServiceBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  step1ServiceCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF5EE',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  step1ServiceCategoryText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },
  step1ServicePriceText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },
  step1ServiceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#102820',
    fontFamily: Typography.fontFamily.sans,
  },
  step1ServiceProvider: {
    fontSize: 11.5,
    fontWeight: '400',
    color: '#64748B',
    fontFamily: Typography.fontFamily.sans,
    marginTop: 1,
  },

  patientSelectorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
    padding: 12,
    marginBottom: 14,
    shadowColor: '#102820',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  patientSelectorTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#102820',
    fontFamily: Typography.fontFamily.sans,
    marginBottom: 8,
  },
  patientTabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  patientTabPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FAF7',
    borderRadius: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#DCE9E1',
  },
  patientTabPillActive: {
    backgroundColor: '#0F5B43',
    borderColor: '#0F5B43',
  },
  patientTabText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },
  patientTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  formSectionContainer: {
    marginBottom: 6,
  },
  formSectionHeading: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#102820',
    fontFamily: Typography.fontFamily.sans,
    marginBottom: 8,
  },

  unifiedFormCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
    overflow: 'hidden',
    shadowColor: '#102820',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 14,
  },
  formRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  formRowDivider: {
    height: 1,
    backgroundColor: '#F1F5F3',
    marginLeft: 58,
    marginRight: 14,
  },

  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
    shadowColor: '#102820',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  inputIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EAF5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  inputCol: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 2,
    fontFamily: Typography.fontFamily.sans,
  },
  inputTextValue: {
    fontSize: 14.5,
    fontWeight: '500',
    color: '#102820',
    padding: 0,
    fontFamily: Typography.fontFamily.sans,
  },
  inputVerifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF6ED',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  inputVerifiedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
    fontFamily: Typography.fontFamily.sans,
  },
  addressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  defaultAddressTag: {
    backgroundColor: '#EAF5EE',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  defaultAddressTagText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },

  visitReasonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
    padding: 12,
    marginBottom: 12,
    shadowColor: '#102820',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  visitReasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  visitReasonTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#102820',
    fontFamily: Typography.fontFamily.sans,
  },
  reasonChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  reasonChip: {
    backgroundColor: '#F5FAF7',
    paddingVertical: 5.5,
    paddingHorizontal: 9.5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCE9E1',
  },
  reasonChipActive: {
    backgroundColor: '#0F5B43',
    borderColor: '#0F5B43',
  },
  reasonChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#4B5E55',
    fontFamily: Typography.fontFamily.sans,
  },
  reasonChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  step1TrustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF5EE',
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CDE5D7',
  },
  step1TrustText: {
    fontSize: 10.5,
    color: '#0F5B43',
    fontWeight: '500',
    fontFamily: Typography.fontFamily.sans,
    flex: 1,
  },

  // -------------------------------------------------------------
  // Day Selector Pills (Step 2 - Image 6)
  // -------------------------------------------------------------
  dayPillsScroll: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  dayPillCard: {
    width: 58,
    height: 72,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
  },
  dayPillCardActive: {
    backgroundColor: '#0F5B43',
    borderColor: '#0F5B43',
  },
  dayPillCardInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCE9E1',
  },
  dayPillDayName: {
    fontSize: 12,
    marginBottom: 4,
    fontFamily: Typography.fontFamily.sans,
  },
  dayPillDayNum: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Typography.fontFamily.sans,
  },
  dayPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dayPillTextInactive: {
    color: '#102820',
    fontWeight: '400',
  },

  // -------------------------------------------------------------
  // Time Slot Grid (3 columns matching Image 6 & Image 3)
  // -------------------------------------------------------------
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
    marginTop: 4,
  },
  timeSlotPill: {
    width: '31%',
    paddingVertical: 11,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
  },
  timeSlotPillActive: {
    backgroundColor: '#0F5B43',
    borderColor: '#0F5B43',
  },
  timeSlotPillInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCE9E1',
  },
  timeSlotPillText: {
    fontSize: 12.5,
    fontFamily: Typography.fontFamily.sans,
  },
  timeSlotTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  timeSlotTextInactive: {
    color: '#102820',
    fontWeight: '400',
  },

  // -------------------------------------------------------------
  // Review Summary Card (Step 3 - Image 5)
  // -------------------------------------------------------------
  reviewSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
    padding: 16,
    shadowColor: '#102820',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  reviewThumbnail: {
    width: 76,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#EAF5EE',
  },
  reviewServiceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#102820',
    marginLeft: 14,
    flex: 1,
    lineHeight: 21,
    fontFamily: Typography.fontFamily.sans,
  },
  reviewDivider: {
    height: 1,
    backgroundColor: '#F1F5F3',
    marginVertical: 10,
  },
  reviewDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  reviewDetailCol: {
    flex: 1,
    marginLeft: 12,
  },
  reviewDetailLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '400',
    marginBottom: 2,
    fontFamily: Typography.fontFamily.sans,
  },
  reviewDetailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#102820',
    lineHeight: 19,
    fontFamily: Typography.fontFamily.sans,
  },

  // -------------------------------------------------------------
  // Payment Screen (Step 4 - Image 8)
  // -------------------------------------------------------------
  bookingAmountCard: {
    backgroundColor: '#EAF5EE',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 18,
  },
  bookingAmountLabel: {
    fontSize: 13,
    color: '#0F5B43',
    fontWeight: '500',
    marginBottom: 4,
    fontFamily: Typography.fontFamily.sans,
  },
  bookingAmountValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },
  paymentOptionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
    overflow: 'hidden',
  },
  paymentOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upiIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#EAF5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  paymentIcon: {
    marginRight: 10,
  },
  paymentOptionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#102820',
    fontFamily: Typography.fontFamily.sans,
  },
  paymentOptionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  upiBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  upiAppBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Typography.fontFamily.sans,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0F5B43',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0F5B43',
  },
  paymentDivider: {
    height: 1,
    backgroundColor: '#F1F5F3',
    marginHorizontal: 16,
  },

  // -------------------------------------------------------------
  // Booking Confirmed (Step 5 - Image 7)
  // -------------------------------------------------------------
  celebrationContainer: {
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  confettiDash: {
    position: 'absolute',
    width: 10,
    height: 3,
    borderRadius: 1.5,
  },
  celebrationOuterGlow: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E4F4EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmedCheckCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#0F5B43',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F5B43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmedTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0F5B43',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Typography.fontFamily.sans,
  },
  confirmedSubtitle: {
    fontSize: 13.5,
    fontWeight: '400',
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 290,
    marginBottom: 24,
    lineHeight: 19,
    fontFamily: Typography.fontFamily.sans,
  },
  confirmedSummaryCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
    padding: 16,
    marginBottom: 28,
  },
  confirmedInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  confirmedInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#102820',
    lineHeight: 19,
    fontFamily: Typography.fontFamily.sans,
  },
  confirmedDivider: {
    height: 1,
    backgroundColor: '#F1F5F3',
    marginVertical: 4,
  },
  confirmedActionsWrap: {
    width: '100%',
    gap: 12,
  },
  secondaryLinkButton: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLinkButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },

  // -------------------------------------------------------------
  // Booking Details Screen (Step 6 - Image 4)
  // -------------------------------------------------------------
  detailsHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  detailsHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DCE9E1',
  },
  detailsHeaderLogo: {
    width: 124,
    height: 34,
  },
  detailsHeadingWrap: {
    marginTop: 4,
    marginBottom: 16,
    alignItems: 'center',
  },
  detailsRefBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: '#EAF5EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  detailsRefCode: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },
  detailsRefDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#8C9E96',
    marginHorizontal: 6,
  },
  detailsRefType: {
    fontSize: 12,
    fontWeight: '500',
    color: '#556A61',
    fontFamily: Typography.fontFamily.sans,
  },
  statusTrackerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
    padding: 14,
    marginBottom: 14,
  },
  trackerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  trackerStatusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackerStatusText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Typography.fontFamily.sans,
  },
  trackerEtaPill: {
    backgroundColor: '#EAF6ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  trackerEtaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
    fontFamily: Typography.fontFamily.sans,
  },
  trackerPipelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  trackerStep: {
    alignItems: 'center',
    width: 56,
  },
  trackerCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  trackerCircleDone: {
    backgroundColor: '#0F5B43',
  },
  trackerCircleActive: {
    backgroundColor: '#059669',
  },
  trackerCircleInactive: {
    backgroundColor: '#E2E8F0',
  },
  trackerLine: {
    flex: 1,
    height: 2,
    marginBottom: 16,
    marginHorizontal: -4,
  },
  trackerLineActive: {
    backgroundColor: '#059669',
  },
  trackerLineInactive: {
    backgroundColor: '#E2E8F0',
  },
  trackerStepText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94A3B8',
    fontFamily: Typography.fontFamily.sans,
  },
  trackerStepTextActive: {
    color: '#0F5B43',
    fontWeight: '600',
  },
  trackerStepTextInactive: {
    color: '#94A3B8',
  },
  bookingDetailsDoctorCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
    padding: 14,
    marginBottom: 14,
    gap: 12,
  },
  detailsAvatarWrap: {
    position: 'relative',
  },
  detailsDoctorAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#EAF5EE',
  },
  detailsVerifiedBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0F5B43',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  detailsHeaderInfo: {
    flex: 1,
  },
  doctorHeaderNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  detailsDoctorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#102820',
    fontFamily: Typography.fontFamily.sans,
  },
  doctorRatingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  doctorRatingTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
    fontFamily: Typography.fontFamily.sans,
  },
  detailsServiceTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F5B43',
    marginBottom: 2,
    fontFamily: Typography.fontFamily.sans,
  },
  detailsDoctorSubtext: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '400',
    marginBottom: 8,
    fontFamily: Typography.fontFamily.sans,
  },
  doctorBadgeTagsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  doctorPillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF5EE',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  doctorPillTagText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },
  detailsBedsidePinCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EAF6ED',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#C9E1D4',
    padding: 12,
    marginBottom: 14,
  },
  bedsidePinLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  bedsidePinIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bedsidePinHeading: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },
  bedsidePinSubheading: {
    fontSize: 11,
    fontWeight: '400',
    color: '#52695E',
    lineHeight: 15,
    fontFamily: Typography.fontFamily.sans,
  },
  bedsidePinBadge: {
    backgroundColor: '#0F5B43',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  bedsidePinBadgeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
    fontFamily: Typography.fontFamily.sans,
  },
  cardHeaderTitleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#102820',
    marginBottom: 12,
    letterSpacing: -0.2,
    fontFamily: Typography.fontFamily.sans,
  },
  bookingDetailsListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
    padding: 16,
    marginBottom: 14,
  },
  detailsDataRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  detailsIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EAF5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 1,
  },
  detailsDataCol: {
    flex: 1,
  },
  detailsDataLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 2,
    fontFamily: Typography.fontFamily.sans,
  },
  detailsDataValue: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#102820',
    lineHeight: 18,
    fontFamily: Typography.fontFamily.sans,
  },
  detailsCardDivider: {
    height: 1,
    backgroundColor: '#F1F5F3',
    marginVertical: 6,
  },
  detailsBillingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
    padding: 16,
    marginBottom: 14,
  },
  billingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  billingPaidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF6ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  billingPaidBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
    fontFamily: Typography.fontFamily.sans,
  },
  billRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  billRowLabel: {
    fontSize: 12.5,
    color: '#64748B',
    fontFamily: Typography.fontFamily.sans,
  },
  billRowValue: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#102820',
    fontFamily: Typography.fontFamily.sans,
  },
  billRowDivider: {
    height: 1,
    backgroundColor: '#EDF2EE',
    marginVertical: 8,
  },
  billTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailsBillTotalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#102820',
    fontFamily: Typography.fontFamily.sans,
  },
  detailsBillTotalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },
  downloadInvoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#EAF5EE',
    borderWidth: 1,
    borderColor: '#DCE9E1',
  },
  downloadInvoiceBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },
  detailsPreparationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
    padding: 16,
    marginBottom: 18,
  },
  prepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  prepStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  prepNumberCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EAF5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  prepNumberText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },
  prepStepText: {
    flex: 1,
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    fontFamily: Typography.fontFamily.sans,
  },
  detailsActionButtonsCol: {
    gap: 10,
    marginBottom: 20,
  },
  rescheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EAF5EE',
    borderRadius: 26,
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
    paddingVertical: 14,
  },
  rescheduleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },
  cancelBookingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEECEC',
    borderRadius: 26,
    borderWidth: 1.2,
    borderColor: '#FCA5A5',
    paddingVertical: 14,
  },
  cancelBookingButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
    fontFamily: Typography.fontFamily.sans,
  },
  helplineLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  helplineLinkText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    fontFamily: Typography.fontFamily.sans,
  },

  // -------------------------------------------------------------
  // Reschedule & Step 2 Calendar
  // -------------------------------------------------------------
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 6,
  },
  calendarMonthText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#102820',
    fontFamily: Typography.fontFamily.sans,
  },
  calendarWeekdaysRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  calendarWeekdayLabel: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    fontFamily: Typography.fontFamily.sans,
  },
  calendarDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 3,
  },
  calendarDayCell: {
    width: '14.28%',
    height: 31,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  calendarDayCellActive: {
    backgroundColor: '#0F5B43',
  },
  calendarDayText: {
    fontSize: 12.5,
    fontWeight: '400',
    color: '#102820',
    fontFamily: Typography.fontFamily.sans,
  },
  calendarDayTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // -------------------------------------------------------------
  // Cancel Booking (Step 8 - Image 2)
  // -------------------------------------------------------------
  cancelSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
    padding: 16,
    marginBottom: 20,
  },
  cancelDoctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cancelDoctorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAF5EE',
  },
  cancelSummaryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#102820',
    lineHeight: 19,
    fontFamily: Typography.fontFamily.sans,
  },
  cancelDivider: {
    height: 1,
    backgroundColor: '#F1F5F3',
    marginVertical: 10,
  },
  cancelInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  cancelInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#102820',
    fontFamily: Typography.fontFamily.sans,
  },
  cancelReasonLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#102820',
    marginBottom: 8,
    fontFamily: Typography.fontFamily.sans,
  },
  cancelReasonSelectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
  },
  cancelReasonSelectText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#102820',
    fontFamily: Typography.fontFamily.sans,
  },
  cancelActionButtonsCol: {
    gap: 12,
  },
  confirmCancelButton: {
    backgroundColor: '#DC2626',
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmCancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Typography.fontFamily.sans,
  },
  keepBookingButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#0F5B43',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keepBookingButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },

  // Cancel Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContentCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#102820',
    marginBottom: 16,
    fontFamily: Typography.fontFamily.sans,
  },
  modalReasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F3',
  },
  modalReasonText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#102820',
    fontFamily: Typography.fontFamily.sans,
  },

  // -------------------------------------------------------------
  // Sticky Bottom Action Bar
  // -------------------------------------------------------------
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FBFAF7',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F3',
  },
  primaryActionButton: {
    backgroundColor: '#0F5B43',
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F5B43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  cancelledNoticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  cancelledNoticeText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#DC2626',
    fontFamily: Typography.fontFamily.sans,
  },

  // -------------------------------------------------------------
  // Enhanced Review Styles (Step 3)
  // -------------------------------------------------------------
  reviewDoctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
    padding: 16,
    marginBottom: 14,
    gap: 14,
  },
  reviewDoctorAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EAF5EE',
  },
  reviewDoctorInfo: {
    flex: 1,
  },
  reviewVerifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#EAF6ED',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    marginBottom: 4,
  },
  reviewVerifiedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
    fontFamily: Typography.fontFamily.sans,
  },
  reviewServiceName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#102820',
    fontFamily: Typography.fontFamily.sans,
    marginBottom: 2,
  },
  reviewDoctorName: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },
  reviewDoctorMeta: {
    fontSize: 11.5,
    color: '#64748B',
    fontFamily: Typography.fontFamily.sans,
    marginTop: 2,
  },
  reviewSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
    padding: 16,
    marginBottom: 14,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F3',
  },
  reviewCardHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },
  reviewItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  reviewItemIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F4FAF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  reviewItemTextCol: {
    flex: 1,
  },
  reviewItemLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '400',
    fontFamily: Typography.fontFamily.sans,
    marginBottom: 2,
  },
  reviewItemValue: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#102820',
    lineHeight: 18,
    fontFamily: Typography.fontFamily.sans,
  },
  reviewInnerDivider: {
    height: 1,
    backgroundColor: '#F1F5F3',
    marginVertical: 8,
  },
  billRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  billLabel: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: Typography.fontFamily.sans,
  },
  billValue: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#102820',
    fontFamily: Typography.fontFamily.sans,
  },
  freeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  billStrikeValue: {
    fontSize: 12,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    fontFamily: Typography.fontFamily.sans,
  },
  freeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    fontFamily: Typography.fontFamily.sans,
  },
  billTotalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#102820',
    fontFamily: Typography.fontFamily.sans,
  },
  billTotalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#EAF5EE',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  trustBannerTextCol: {
    flex: 1,
  },
  trustBannerTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
    marginBottom: 2,
  },
  trustBannerSub: {
    fontSize: 11.5,
    color: '#4B6358',
    fontFamily: Typography.fontFamily.sans,
    lineHeight: 16,
  },

  /* Emphasized Schedule Card (Step 3) */
  reviewScheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#C2E5D4',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#0F5B43',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  reviewScheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF5F0',
  },
  reviewScheduleIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EAF5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewScheduleHeaderText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },
  reviewScheduleSubheader: {
    fontSize: 11.5,
    color: '#6B7E75',
    fontFamily: Typography.fontFamily.sans,
    marginTop: 1,
  },
  reviewScheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  reviewScheduleIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F3F9F5',
    borderWidth: 1,
    borderColor: '#E2F0E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reviewScheduleTextCol: {
    flex: 1,
  },
  reviewScheduleLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#657A70',
    fontFamily: Typography.fontFamily.sans,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  reviewScheduleValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B2B20',
    fontFamily: Typography.fontFamily.sans,
    letterSpacing: -0.2,
  },
  reviewScheduleDivider: {
    height: 1,
    backgroundColor: '#F1F6F3',
    marginVertical: 8,
  },
  reviewTimeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDurationTag: {
    backgroundColor: '#EAF6ED',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  reviewDurationTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
    fontFamily: Typography.fontFamily.sans,
  },
  reviewAddressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  homePill: {
    backgroundColor: '#EAF5EE',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    marginLeft: 6,
  },
  homePillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },
  reviewAddressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B2A24',
    fontFamily: Typography.fontFamily.sans,
    lineHeight: 19,
  },

  /* Sticky Bottom Action Bar with Total on Left */
  reviewBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1.2,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  reviewBottomPriceCol: {
    justifyContent: 'center',
    minWidth: 95,
  },
  reviewBottomPriceLabel: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
    fontFamily: Typography.fontFamily.sans,
    marginBottom: 2,
  },
  reviewBottomPriceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },
  reviewBottomButton: {
    flex: 1,
    backgroundColor: '#0F5B43',
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F5B43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  // -------------------------------------------------------------
  // Enhanced Payment Styles (Step 4)
  // -------------------------------------------------------------
  bookingAmountTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  instantRefundBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#D4E7DC',
  },
  instantRefundText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },
  amountBreakdownPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#D4E7DC',
  },
  amountBreakdownPillText: {
    fontSize: 11.5,
    color: '#4B6358',
    fontFamily: Typography.fontFamily.sans,
  },
  paymentOptionItemActive: {
    backgroundColor: '#F8FCF9',
  },
  paymentOptionSub: {
    fontSize: 11.5,
    color: '#64748B',
    fontFamily: Typography.fontFamily.sans,
    marginTop: 2,
  },
  popularBadge: {
    backgroundColor: '#EAF6ED',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  popularBadgeText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#059669',
    fontFamily: Typography.fontFamily.sans,
  },
  upiExpandedContent: {
    backgroundColor: '#F8FCF9',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  upiExpandedLabel: {
    fontSize: 11.5,
    color: '#64748B',
    fontFamily: Typography.fontFamily.sans,
    marginBottom: 8,
  },
  upiAppsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  upiAppPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCE9E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  upiAppPillText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Typography.fontFamily.sans,
  },
  paymentTrustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  paymentTrustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paymentTrustText: {
    fontSize: 11.5,
    color: '#64748B',
    fontFamily: Typography.fontFamily.sans,
  },

  // -------------------------------------------------------------
  // Enhanced Confirmed Styles (Step 5)
  // -------------------------------------------------------------
  bookingRefPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 18,
  },
  bookingRefLabel: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: Typography.fontFamily.sans,
  },
  bookingRefCode: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },
  bedsidePinCard: {
    width: '100%',
    backgroundColor: '#EAF5EE',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#CCE4D5',
    padding: 18,
    marginBottom: 16,
    alignItems: 'center',
  },
  bedsidePinHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  bedsidePinTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },
  pinDigitsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  pinDigitBox: {
    width: 44,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0F5B43',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F5B43',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pinDigitText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F5B43',
    fontFamily: Typography.fontFamily.sans,
  },
  bedsidePinHelp: {
    fontSize: 11.5,
    color: '#4B6358',
    textAlign: 'center',
    fontFamily: Typography.fontFamily.sans,
    lineHeight: 16,
    maxWidth: 290,
  },
  confirmedDoctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 10,
  },
  confirmedDoctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EAF5EE',
  },
  confirmedDoctorCol: {
    flex: 1,
  },
  confirmedDoctorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#102820',
    fontFamily: Typography.fontFamily.sans,
  },
  confirmedDoctorRole: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: Typography.fontFamily.sans,
    marginTop: 1,
  },
  confirmedBadgeSmall: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAF6ED',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginTop: 4,
  },
  confirmedBadgeSmallText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
    fontFamily: Typography.fontFamily.sans,
  },
  confirmedRowLabel: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: Typography.fontFamily.sans,
    marginBottom: 1,
  },
  nextStepsCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#DCE9E1',
    padding: 18,
    marginBottom: 24,
  },
  nextStepsHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#102820',
    fontFamily: Typography.fontFamily.sans,
    marginBottom: 14,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  timelineDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0F5B43',
    marginRight: 12,
    marginTop: 4,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#DCE9E1',
    marginRight: 12,
    marginTop: 4,
  },
  timelineTextCol: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#102820',
    fontFamily: Typography.fontFamily.sans,
  },
  timelineSub: {
    fontSize: 11.5,
    color: '#64748B',
    fontFamily: Typography.fontFamily.sans,
    marginTop: 2,
  },

  primaryActionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Typography.fontFamily.sans,
  },
});
