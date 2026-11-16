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
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { DOCTOR_ROHAN, addBooking } from '../../data/mockData';
import { PatientBooking } from '../../types';

type BookingStep =
  | 'details'      // Image 1: Enter Booking Details (Step 1)
  | 'schedule'     // Image 6: Choose Date & Time (Step 2)
  | 'review'       // Image 5: Review & Confirm (Step 3)
  | 'payment'      // Image 8: Payment (₹1,200)
  | 'confirmed'    // Image 7: Booking Confirmed!
  | 'details_view' // Image 4: Booking Details
  | 'reschedule'   // Image 3: Reschedule Booking
  | 'cancel';      // Image 2: Cancel Booking

interface DayPill {
  dayName: string;
  dayNum: string;
  fullDate: string;
}

const SCHEDULE_DAYS: DayPill[] = [
  { dayName: 'Tue', dayNum: '20', fullDate: 'Tue, 20 May 2025' },
  { dayName: 'Wed', dayNum: '21', fullDate: 'Wed, 21 May 2025' },
  { dayName: 'Thu', dayNum: '22', fullDate: 'Thu, 22 May 2025' },
  { dayName: 'Fri', dayNum: '23', fullDate: 'Fri, 23 May 2025' },
  { dayName: 'Sat', dayNum: '24', fullDate: 'Sat, 24 May 2025' },
];

const SCHEDULE_TIMES = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
];

const RESCHEDULE_TIMES = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
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
  const params = useLocalSearchParams<{
    serviceId?: string;
    doctorId?: string;
    doctorName?: string;
    specialty?: string;
    step?: BookingStep;
  }>();

  // Active step in the workflow
  const [currentStep, setCurrentStep] = useState<BookingStep>(params.step || 'details');

  // Step 1: Details (Image 1)
  const [fullName, setFullName] = useState('Arjun Mehta');
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [emailAddress, setEmailAddress] = useState('arjun.mehta@gmail.com');
  const [serviceAddress, setServiceAddress] = useState(
    'A-402, Green Valley Apartments, Bangalore - 560068'
  );

  // Step 2: Schedule (Image 6)
  const [selectedDayIndex, setSelectedDayIndex] = useState(1); // Wed 21 (Image 6)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('02:00 PM'); // 02:00 PM (Image 6)

  // Step 4: Payment (Image 8)
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'WALLET'>('UPI');

  // Step 7: Reschedule (Image 3)
  const [rescheduleDay, setRescheduleDay] = useState(16); // 16 May 2025 (Image 3)
  const [rescheduleTime, setRescheduleTime] = useState('03:00 PM'); // 03:00 PM (Image 3)

  // Step 8: Cancel (Image 2)
  const [cancelReason, setCancelReason] = useState('Select a reason');
  const [showCancelReasonModal, setShowCancelReasonModal] = useState(false);

  // Dynamic booking state
  const [bookingConfirmedDate, setBookingConfirmedDate] = useState('Wed, 21 May 2025');
  const [bookingConfirmedTime, setBookingConfirmedTime] = useState('02:00 PM');

  const selectedDateStr = SCHEDULE_DAYS[selectedDayIndex]?.fullDate || 'Wed, 21 May 2025';

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
        router.replace('/(tabs)/services');
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
    if (!fullName.trim() || !phoneNumber.trim()) {
      Alert.alert('Required Fields', 'Please ensure Full Name and Phone Number are entered.');
      return;
    }
    setCurrentStep('schedule');
  };

  const handleStep2Continue = () => {
    setBookingConfirmedDate(selectedDateStr);
    setBookingConfirmedTime(selectedTimeSlot);
    setCurrentStep('review');
  };

  const handleStep3ProceedToPayment = () => {
    setCurrentStep('payment');
  };

  const handleStep4Pay = () => {
    // Save booking to patient mock store
    const newBooking: PatientBooking = {
      id: `VEL-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceId: 'doctor-visit',
      serviceTitle: 'Home Visit Doctor Consultation',
      patientName: fullName,
      patientRelationship: 'Self',
      patientAge: 34,
      status: 'CONFIRMED',
      scheduledDate: bookingConfirmedDate,
      scheduledTimeSlot: bookingConfirmedTime,
      urgency: 'STANDARD',
      totalPrice: 1200,
      securityPin: '4829',
      address: serviceAddress,
      symptoms: 'Doctor home visit consultation',
      assignedClinician: DOCTOR_ROHAN,
      createdAt: new Date().toISOString(),
    };
    addBooking(newBooking);

    // Show Confirmation screen (Image 7)
    setCurrentStep('confirmed');
  };

  const handleViewMyBookings = () => {
    // Show Booking Details screen (Image 4)
    setCurrentStep('details_view');
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
    const updatedDate = `${rescheduleDay} May 2025`;
    setBookingConfirmedDate(updatedDate);
    setBookingConfirmedTime(rescheduleTime);
    Alert.alert('Booking Rescheduled', `Your consultation has been updated to ${updatedDate} at ${rescheduleTime}.`);
    setCurrentStep('details_view');
  };

  const handleConfirmCancel = () => {
    Alert.alert('Appointment Cancelled', 'Your home visit doctor appointment has been cancelled successfully.');
    router.replace('/(tabs)/services');
  };

  // -------------------------------------------------------------
  // Top Header Component (Matches all 8 images with Logo & Arrow)
  // -------------------------------------------------------------
  const renderHeader = (showCloseIcon = false) => (
    <View style={styles.topHeader}>
      <TouchableOpacity
        onPress={handleBack}
        style={styles.headerIconButton}
        activeOpacity={0.7}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons
          name={showCloseIcon ? 'close' : 'arrow-back'}
          size={24}
          color="#102820"
        />
      </TouchableOpacity>

      <View style={styles.headerLogoContainer}>
        {/* Leaf Icon + Brand Text */}
        <View style={styles.logoLeafIcon}>
          <Ionicons name="leaf" size={20} color="#0F5B43" />
        </View>
        <Text style={styles.headerLogoText}>
          Velora <Text style={{ fontWeight: '400' }}>Health</Text>
        </Text>
      </View>

      <View style={styles.headerRightSpacer} />
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
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
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
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
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

            {/* Input Card 1: Full Name */}
            <View style={styles.inputCard}>
              <View style={styles.inputIconCircle}>
                <Ionicons name="person-outline" size={20} color="#102820" />
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

            {/* Input Card 2: Phone Number */}
            <View style={styles.inputCard}>
              <View style={styles.inputIconCircle}>
                <Ionicons name="call-outline" size={20} color="#102820" />
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
            </View>

            {/* Input Card 3: Email Address */}
            <View style={styles.inputCard}>
              <View style={styles.inputIconCircle}>
                <Ionicons name="mail-outline" size={20} color="#102820" />
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
            </View>

            {/* Input Card 4: Service Address */}
            <View style={styles.inputCard}>
              <View style={styles.inputIconCircle}>
                <Ionicons name="location-outline" size={20} color="#102820" />
              </View>
              <View style={styles.inputCol}>
                <Text style={styles.inputLabel}>Service Address</Text>
                <TextInput
                  value={serviceAddress}
                  onChangeText={setServiceAddress}
                  multiline
                  style={styles.inputTextValue}
                  placeholder="Enter street, apartment, city, pincode"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <Ionicons name="chevron-forward" size={18} color="#64748B" />
            </View>
          </ScrollView>

          {/* Sticky Bottom Action Button */}
          <View style={styles.bottomActionBar}>
            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={handleStep1Continue}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryActionButtonText}>Continue →</Text>
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

            {/* Select Date Section */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeadingText}>Select Date</Text>
              <Ionicons name="calendar-outline" size={20} color="#102820" />
            </View>

            {/* Horizontal Day Selector Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dayPillsScroll}
            >
              {SCHEDULE_DAYS.map((day, idx) => {
                const isSelected = selectedDayIndex === idx;
                return (
                  <TouchableOpacity
                    key={day.dayNum}
                    onPress={() => setSelectedDayIndex(idx)}
                    activeOpacity={0.85}
                    style={[
                      styles.dayPillCard,
                      isSelected ? styles.dayPillCardActive : styles.dayPillCardInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayPillDayName,
                        isSelected ? styles.dayPillTextActive : styles.dayPillTextInactive,
                      ]}
                    >
                      {day.dayName}
                    </Text>
                    <Text
                      style={[
                        styles.dayPillDayNum,
                        isSelected ? styles.dayPillTextActive : styles.dayPillTextInactive,
                      ]}
                    >
                      {day.dayNum}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Select Time Section */}
            <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
              <Text style={styles.sectionHeadingText}>Select Time</Text>
            </View>

            {/* Time Slot Grid (2 columns or 3 columns) */}
            <View style={styles.timeSlotGrid}>
              {SCHEDULE_TIMES.map((time) => {
                const isSelected = selectedTimeSlot === time;
                return (
                  <TouchableOpacity
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
            <TouchableOpacity
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
      {/* 3. STEP 3: REVIEW & CONFIRM (Image 5)                                     */}
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

            {/* Summary Card with Image Thumbnail */}
            <View style={styles.reviewSummaryCard}>
              <View style={styles.reviewImageWrap}>
                <Image
                  source={require('../../../assets/images/service-doctor.png')}
                  style={styles.reviewImageThumbnail}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.reviewCardBody}>
                <Text style={styles.reviewServiceTitle}>
                  Home Visit Doctor Consultation
                </Text>

                <View style={styles.reviewDetailRow}>
                  <Ionicons name="calendar-outline" size={17} color="#0F5B43" />
                  <Text style={styles.reviewDetailText}>
                    Date: <Text style={styles.reviewDetailBold}>{bookingConfirmedDate}</Text>
                  </Text>
                </View>

                <View style={styles.reviewDetailRow}>
                  <Ionicons name="time-outline" size={17} color="#0F5B43" />
                  <Text style={styles.reviewDetailText}>
                    Time: <Text style={styles.reviewDetailBold}>{bookingConfirmedTime}</Text>
                  </Text>
                </View>

                <View style={styles.reviewDetailRow}>
                  <Ionicons name="location-outline" size={17} color="#0F5B43" />
                  <Text style={styles.reviewDetailText}>
                    Address: <Text style={styles.reviewDetailBold}>{serviceAddress}</Text>
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Sticky Bottom Action Button */}
          <View style={styles.bottomActionBar}>
            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={handleStep3ProceedToPayment}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryActionButtonText}>Proceed to Payment →</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ========================================================================= */}
      {/* 4. PAYMENT SCREEN (Image 8)                                              */}
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
              Complete your booking by making a secure payment.
            </Text>

            {/* Booking Amount Mint Card */}
            <View style={styles.bookingAmountCard}>
              <Text style={styles.bookingAmountLabel}>Booking Amount</Text>
              <Text style={styles.bookingAmountValue}>₹1,200</Text>
            </View>

            {/* Payment Options Radio List */}
            <View style={styles.paymentOptionsList}>
              {/* Option 1: UPI */}
              <TouchableOpacity
                onPress={() => setPaymentMethod('UPI')}
                activeOpacity={0.85}
                style={[
                  styles.paymentOptionCard,
                  paymentMethod === 'UPI' && styles.paymentOptionCardActive,
                ]}
              >
                <View style={styles.paymentOptionLeft}>
                  <View style={styles.radioOuter}>
                    {paymentMethod === 'UPI' && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.paymentOptionTextWrap}>
                    <Text style={styles.paymentOptionTitle}>UPI</Text>
                    <View style={styles.upiBadgesRow}>
                      <View style={styles.upiBadge}>
                        <Text style={styles.upiBadgeText}>GPay</Text>
                      </View>
                      <View style={styles.upiBadge}>
                        <Text style={styles.upiBadgeText}>PhonePe</Text>
                      </View>
                      <View style={styles.upiBadge}>
                        <Text style={styles.upiBadgeText}>Paytm</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Option 2: Debit / Credit Card */}
              <TouchableOpacity
                onPress={() => setPaymentMethod('CARD')}
                activeOpacity={0.85}
                style={[
                  styles.paymentOptionCard,
                  paymentMethod === 'CARD' && styles.paymentOptionCardActive,
                ]}
              >
                <View style={styles.paymentOptionLeft}>
                  <View style={styles.radioOuter}>
                    {paymentMethod === 'CARD' && <View style={styles.radioInner} />}
                  </View>
                  <Ionicons name="card-outline" size={20} color="#102820" style={{ marginLeft: 6, marginRight: 8 }} />
                  <Text style={styles.paymentOptionTitle}>Debit / Credit Card</Text>
                </View>
              </TouchableOpacity>

              {/* Option 3: Net Banking */}
              <TouchableOpacity
                onPress={() => setPaymentMethod('NETBANKING')}
                activeOpacity={0.85}
                style={[
                  styles.paymentOptionCard,
                  paymentMethod === 'NETBANKING' && styles.paymentOptionCardActive,
                ]}
              >
                <View style={styles.paymentOptionLeft}>
                  <View style={styles.radioOuter}>
                    {paymentMethod === 'NETBANKING' && <View style={styles.radioInner} />}
                  </View>
                  <Ionicons name="business-outline" size={20} color="#102820" style={{ marginLeft: 6, marginRight: 8 }} />
                  <Text style={styles.paymentOptionTitle}>Net Banking</Text>
                </View>
              </TouchableOpacity>

              {/* Option 4: Wallet */}
              <TouchableOpacity
                onPress={() => setPaymentMethod('WALLET')}
                activeOpacity={0.85}
                style={[
                  styles.paymentOptionCard,
                  paymentMethod === 'WALLET' && styles.paymentOptionCardActive,
                ]}
              >
                <View style={styles.paymentOptionLeft}>
                  <View style={styles.radioOuter}>
                    {paymentMethod === 'WALLET' && <View style={styles.radioInner} />}
                  </View>
                  <Ionicons name="wallet-outline" size={20} color="#102820" style={{ marginLeft: 6, marginRight: 8 }} />
                  <Text style={styles.paymentOptionTitle}>Wallet</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Sticky Bottom Action Button */}
          <View style={styles.bottomActionBar}>
            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={handleStep4Pay}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryActionButtonText}>Pay ₹1,200 →</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ========================================================================= */}
      {/* 5. BOOKING CONFIRMED! SCREEN (Image 7)                                    */}
      {/* ========================================================================= */}
      {currentStep === 'confirmed' && (
        <View style={styles.screenContainer}>
          {renderHeader(true)}
          <ScrollView
            contentContainerStyle={[styles.scrollContent, { alignItems: 'center' }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Celebration Icon with Confetti particles */}
            <View style={styles.celebrationContainer}>
              <View style={styles.confettiParticle1} />
              <View style={styles.confettiParticle2} />
              <View style={styles.confettiParticle3} />
              <View style={styles.confettiParticle4} />
              <View style={styles.confettiParticle5} />
              <View style={styles.confettiParticle6} />

              <View style={styles.confirmedCheckCircle}>
                <Ionicons name="checkmark" size={42} color="#FFFFFF" />
              </View>
            </View>

            <Text style={styles.confirmedTitle}>Booking Confirmed!</Text>
            <Text style={styles.confirmedSubtitle}>
              Your home visit doctor consultation has been successfully booked.
            </Text>

            {/* Confirmed Details Card */}
            <View style={styles.confirmedSummaryCard}>
              <View style={styles.confirmedInfoRow}>
                <Text style={styles.confirmedInfoLabel}>Date</Text>
                <Text style={styles.confirmedInfoValue}>{bookingConfirmedDate}</Text>
              </View>
              <View style={styles.confirmedDivider} />
              <View style={styles.confirmedInfoRow}>
                <Text style={styles.confirmedInfoLabel}>Time</Text>
                <Text style={styles.confirmedInfoValue}>{bookingConfirmedTime}</Text>
              </View>
              <View style={styles.confirmedDivider} />
              <View style={styles.confirmedInfoRow}>
                <Text style={styles.confirmedInfoLabel}>Address</Text>
                <Text style={styles.confirmedInfoValue}>{serviceAddress}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.confirmedActionsWrap}>
              <TouchableOpacity
                style={styles.primaryActionButton}
                onPress={handleViewMyBookings}
                activeOpacity={0.88}
              >
                <Text style={styles.primaryActionButtonText}>View My Bookings</Text>
              </TouchableOpacity>

              <TouchableOpacity
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
      {/* 6. BOOKING DETAILS SCREEN (Image 4)                                       */}
      {/* ========================================================================= */}
      {currentStep === 'details_view' && (
        <View style={styles.screenContainer}>
          {renderHeader(false)}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.pageTitle}>Booking Details</Text>

            {/* Booking Details Card */}
            <View style={styles.bookingDetailsCard}>
              {/* Doctor Avatar Header */}
              <View style={styles.detailsCardHeader}>
                <Image
                  source={require('../../../assets/images/doctor-rohan.png')}
                  style={styles.detailsDoctorAvatar}
                  resizeMode="cover"
                />
                <View style={styles.detailsHeaderInfo}>
                  <Text style={styles.detailsServiceTitle}>Home Visit Consultation</Text>
                  <View style={styles.confirmedBadge}>
                    <Text style={styles.confirmedBadgeText}>Confirmed</Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailsCardDivider} />

              {/* Rows */}
              <View style={styles.detailsDataRow}>
                <Ionicons name="calendar-outline" size={18} color="#0F5B43" />
                <View style={styles.detailsDataCol}>
                  <Text style={styles.detailsDataLabel}>Date</Text>
                  <Text style={styles.detailsDataValue}>{bookingConfirmedDate}</Text>
                </View>
              </View>

              <View style={styles.detailsDataRow}>
                <Ionicons name="time-outline" size={18} color="#0F5B43" />
                <View style={styles.detailsDataCol}>
                  <Text style={styles.detailsDataLabel}>Time</Text>
                  <Text style={styles.detailsDataValue}>{bookingConfirmedTime}</Text>
                </View>
              </View>

              <View style={styles.detailsDataRow}>
                <Ionicons name="location-outline" size={18} color="#0F5B43" />
                <View style={styles.detailsDataCol}>
                  <Text style={styles.detailsDataLabel}>Address</Text>
                  <Text style={styles.detailsDataValue}>{serviceAddress}</Text>
                </View>
              </View>

              <View style={styles.detailsDataRow}>
                <Ionicons name="person-outline" size={18} color="#0F5B43" />
                <View style={styles.detailsDataCol}>
                  <Text style={styles.detailsDataLabel}>Doctor</Text>
                  <Text style={styles.detailsDataValue}>Dr. Arjun Mehta</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons: Reschedule & Cancel */}
            <View style={styles.detailsActionButtonsCol}>
              <TouchableOpacity
                style={styles.rescheduleButton}
                onPress={handleOpenReschedule}
                activeOpacity={0.85}
              >
                <Ionicons name="calendar-outline" size={18} color="#0F5B43" />
                <Text style={styles.rescheduleButtonText}>Reschedule</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBookingButton}
                onPress={handleOpenCancel}
                activeOpacity={0.85}
              >
                <Ionicons name="close" size={18} color="#DC2626" />
                <Text style={styles.cancelBookingButtonText}>Cancel Booking</Text>
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

            {/* Month Calendar Picker */}
            <View style={styles.calendarCard}>
              <View style={styles.calendarHeaderRow}>
                <TouchableOpacity
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chevron-back" size={20} color="#102820" />
                </TouchableOpacity>
                <Text style={styles.calendarMonthText}>May 2025</Text>
                <TouchableOpacity
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chevron-forward" size={20} color="#102820" />
                </TouchableOpacity>
              </View>

              {/* Weekday Labels */}
              <View style={styles.calendarWeekdaysRow}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((w) => (
                  <Text key={w} style={styles.calendarWeekdayLabel}>
                    {w}
                  </Text>
                ))}
              </View>

              {/* Calendar Grid (Days 1 to 31) */}
              <View style={styles.calendarDaysGrid}>
                {/* 3 offset empty spaces for May 2025 starting Thursday */}
                <View style={styles.calendarDayCell} />
                <View style={styles.calendarDayCell} />
                <View style={styles.calendarDayCell} />

                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                  const isSelected = rescheduleDay === d;
                  return (
                    <TouchableOpacity
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
                  <TouchableOpacity
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
            <TouchableOpacity
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
            <Text style={styles.pageTitle}>Cancel Booking</Text>
            <Text style={styles.pageSubtitle}>
              Are you sure you want to cancel this appointment?
            </Text>

            {/* Summary Card */}
            <View style={styles.cancelSummaryCard}>
              <Text style={styles.cancelSummaryTitle}>
                Home Visit Doctor Consultation
              </Text>
              <Text style={styles.cancelSummaryDateTime}>
                {bookingConfirmedDate} • {bookingConfirmedTime}
              </Text>
            </View>

            {/* Reason for Cancellation Dropdown */}
            <Text style={styles.cancelReasonLabel}>
              Reason for cancellation (optional)
            </Text>
            <TouchableOpacity
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
              <Ionicons name="chevron-down" size={20} color="#64748B" />
            </TouchableOpacity>

            {/* Action Buttons: Red Cancel Booking & Outline Keep Booking */}
            <View style={styles.cancelActionButtonsCol}>
              <TouchableOpacity
                style={styles.confirmCancelButton}
                onPress={handleConfirmCancel}
                activeOpacity={0.85}
              >
                <Text style={styles.confirmCancelButtonText}>Cancel Booking</Text>
              </TouchableOpacity>

              <TouchableOpacity
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
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={() => setShowCancelReasonModal(false)}
            >
              <View style={styles.modalContentCard}>
                <Text style={styles.modalHeading}>Select Cancellation Reason</Text>
                {CANCELLATION_REASONS.map((reason) => (
                  <TouchableOpacity
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
    backgroundColor: '#FFFFFF',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F3',
    backgroundColor: '#FFFFFF',
  },
  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoLeafIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogoText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#102820',
    letterSpacing: -0.3,
  },
  headerRightSpacer: {
    width: 38,
  },

  // -------------------------------------------------------------
  // 3-Step Stepper
  // -------------------------------------------------------------
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 26,
    paddingHorizontal: 16,
  },
  stepColumn: {
    alignItems: 'center',
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeGreen: {
    backgroundColor: '#0F5B43',
  },
  stepBadgeInactive: {
    backgroundColor: '#F1F5F3',
    borderWidth: 1,
    borderColor: '#E2EBE7',
  },
  stepBadgeTextActive: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  stepBadgeTextInactive: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  stepLabel: {
    marginTop: 5,
    fontSize: 12,
  },
  stepLabelActive: {
    color: '#102820',
    fontWeight: '700',
  },
  stepLabelInactive: {
    color: '#64748B',
    fontWeight: '500',
  },
  stepConnector: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  stepConnectorGreen: {
    backgroundColor: '#0F5B43',
  },
  stepConnectorInactive: {
    backgroundColor: '#E2EBE7',
  },

  // -------------------------------------------------------------
  // Typography
  // -------------------------------------------------------------
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#102820',
    marginBottom: 16,
    letterSpacing: -0.4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
    marginTop: -8,
    lineHeight: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeadingText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#102820',
  },

  // -------------------------------------------------------------
  // Input Cards (Step 1)
  // -------------------------------------------------------------
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2EBE7',
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 12,
    shadowColor: '#102820',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  inputIconCircle: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  inputCol: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 2,
  },
  inputTextValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#102820',
    padding: 0,
  },

  // -------------------------------------------------------------
  // Day Selector Pills (Step 2)
  // -------------------------------------------------------------
  dayPillsScroll: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  dayPillCard: {
    width: 60,
    height: 68,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  dayPillCardActive: {
    backgroundColor: '#0F5B43',
    borderColor: '#0F5B43',
  },
  dayPillCardInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2EBE7',
  },
  dayPillDayName: {
    fontSize: 12,
    marginBottom: 2,
  },
  dayPillDayNum: {
    fontSize: 17,
    fontWeight: '800',
  },
  dayPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dayPillTextInactive: {
    color: '#102820',
    fontWeight: '500',
  },

  // -------------------------------------------------------------
  // Time Slot Grid (Step 2 & Reschedule)
  // -------------------------------------------------------------
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  timeSlotPill: {
    width: (Dimensions.get('window').width - 60) / 2,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  timeSlotPillActive: {
    backgroundColor: '#0F5B43',
    borderColor: '#0F5B43',
  },
  timeSlotPillInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2EBE7',
  },
  timeSlotPillText: {
    fontSize: 13,
  },
  timeSlotTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  timeSlotTextInactive: {
    color: '#102820',
    fontWeight: '600',
  },

  // -------------------------------------------------------------
  // Review Summary Card (Step 3)
  // -------------------------------------------------------------
  reviewSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2EBE7',
    overflow: 'hidden',
    shadowColor: '#102820',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  reviewImageWrap: {
    width: '100%',
    height: 160,
    backgroundColor: '#EAF5EE',
  },
  reviewImageThumbnail: {
    width: '100%',
    height: '100%',
  },
  reviewCardBody: {
    padding: 18,
  },
  reviewServiceTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#102820',
    marginBottom: 14,
  },
  reviewDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  reviewDetailText: {
    fontSize: 13,
    color: '#64748B',
    flex: 1,
  },
  reviewDetailBold: {
    color: '#102820',
    fontWeight: '700',
  },

  // -------------------------------------------------------------
  // Payment Screen (Step 4)
  // -------------------------------------------------------------
  bookingAmountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EAF5EE',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 20,
  },
  bookingAmountLabel: {
    fontSize: 14,
    color: '#0F5B43',
    fontWeight: '600',
  },
  bookingAmountValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F5B43',
  },
  paymentOptionsList: {
    gap: 12,
  },
  paymentOptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2EBE7',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  paymentOptionCardActive: {
    borderColor: '#0F5B43',
    backgroundColor: '#F7FCF9',
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0F5B43',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0F5B43',
  },
  paymentOptionTextWrap: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#102820',
  },
  upiBadgesRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  upiBadge: {
    backgroundColor: '#F1F5F3',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  upiBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F5B43',
  },

  // -------------------------------------------------------------
  // Booking Confirmed (Step 5)
  // -------------------------------------------------------------
  celebrationContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    position: 'relative',
  },
  confirmedCheckCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#0F5B43',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F5B43',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  confettiParticle1: {
    position: 'absolute',
    top: 6,
    left: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  confettiParticle2: {
    position: 'absolute',
    top: 4,
    right: 14,
    width: 7,
    height: 7,
    borderRadius: 2,
    backgroundColor: '#F59E0B',
  },
  confettiParticle3: {
    position: 'absolute',
    bottom: 8,
    left: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
  },
  confettiParticle4: {
    position: 'absolute',
    bottom: 12,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EC4899',
  },
  confettiParticle5: {
    position: 'absolute',
    top: 45,
    left: -6,
    width: 7,
    height: 7,
    borderRadius: 2,
    backgroundColor: '#8B5CF6',
  },
  confettiParticle6: {
    position: 'absolute',
    top: 40,
    right: -8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  confirmedTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#102820',
    textAlign: 'center',
    marginBottom: 6,
  },
  confirmedSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 20,
    lineHeight: 18,
  },
  confirmedSummaryCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2EBE7',
    padding: 16,
    marginBottom: 24,
  },
  confirmedInfoRow: {
    paddingVertical: 6,
  },
  confirmedInfoLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 2,
  },
  confirmedInfoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#102820',
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
    fontWeight: '700',
    color: '#0F5B43',
  },

  // -------------------------------------------------------------
  // Booking Details Screen (Step 6)
  // -------------------------------------------------------------
  bookingDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2EBE7',
    padding: 18,
    marginBottom: 20,
    shadowColor: '#102820',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  detailsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailsDoctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EAF5EE',
  },
  detailsHeaderInfo: {
    flex: 1,
  },
  detailsServiceTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#102820',
    marginBottom: 4,
  },
  confirmedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAF6ED',
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  confirmedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  detailsCardDivider: {
    height: 1,
    backgroundColor: '#F1F5F3',
    marginVertical: 14,
  },
  detailsDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  detailsDataCol: {
    flex: 1,
  },
  detailsDataLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  detailsDataValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#102820',
    marginTop: 1,
  },
  detailsActionButtonsCol: {
    gap: 12,
  },
  rescheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EAF5EE',
    borderRadius: 28,
    paddingVertical: 14,
  },
  rescheduleButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F5B43',
  },
  cancelBookingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    borderRadius: 28,
    paddingVertical: 14,
  },
  cancelBookingButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },

  // -------------------------------------------------------------
  // Reschedule Calendar (Step 7)
  // -------------------------------------------------------------
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2EBE7',
    padding: 16,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 6,
  },
  calendarMonthText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#102820',
  },
  calendarWeekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  calendarWeekdayLabel: {
    width: 38,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  calendarDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8,
  },
  calendarDayCell: {
    width: (Dimensions.get('window').width - 74) / 7,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  calendarDayCellActive: {
    backgroundColor: '#0F5B43',
  },
  calendarDayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#102820',
  },
  calendarDayTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // -------------------------------------------------------------
  // Cancel Booking (Step 8)
  // -------------------------------------------------------------
  cancelSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2EBE7',
    padding: 16,
    marginBottom: 20,
  },
  cancelSummaryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#102820',
    marginBottom: 4,
  },
  cancelSummaryDateTime: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  cancelReasonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#102820',
    marginBottom: 8,
  },
  cancelReasonSelectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2EBE7',
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 24,
  },
  cancelReasonSelectText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#102820',
  },
  cancelActionButtonsCol: {
    gap: 12,
  },
  confirmCancelButton: {
    backgroundColor: '#DC2626',
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmCancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  keepBookingButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#0F5B43',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keepBookingButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F5B43',
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
    fontWeight: '800',
    color: '#102820',
    marginBottom: 16,
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
    fontWeight: '600',
    color: '#102820',
  },

  // -------------------------------------------------------------
  // Sticky Bottom Action Bar
  // -------------------------------------------------------------
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
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
  primaryActionButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
