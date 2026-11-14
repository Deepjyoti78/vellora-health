import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows, TouchTargets } from '../../constants/theme';
import { RECENT_BOOKINGS, DOCTOR_MAYA } from '../../data/mockData';
import { Badge } from '../../components/common/Badge';
import { Header } from '../../components/common/Header';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function BookingsScreen() {
  const activeBooking = RECENT_BOOKINGS[0];
  const pastBookings = RECENT_BOOKINGS.slice(1);

  const trackerStages = [
    { label: 'Requested', done: true },
    { label: 'Confirmed', done: true },
    { label: 'Dispatched', done: true },
    { label: 'In Transit', current: true },
    { label: 'Arrived', pending: true },
    { label: 'In Progress', pending: true },
    { label: 'Completed', pending: true },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Your Appointments" subtitle="Live Care Tracking & History" showBack={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Active In-Transit Detailed Tracker */}
        <View style={styles.trackerSection}>
          <View style={styles.trackerCard}>
            <View style={styles.cardHeader}>
              <View>
                <Badge label="IN TRANSIT • ARRIVING SOON" variant="amber" size="sm" iconName="navigate" />
                <Text style={styles.serviceName}>{activeBooking.serviceTitle}</Text>
                <Text style={styles.bookingId}>Booking #{activeBooking.id}</Text>
              </View>
              <View style={styles.etaBox}>
                <Text style={styles.etaNum}>12</Text>
                <Text style={styles.etaLabel}>MINS ETA</Text>
              </View>
            </View>

            {/* Clinician Card */}
            <View style={styles.clinicianBlock}>
              <Image source={DOCTOR_MAYA.avatar} style={styles.doctorImg} />
              <View style={styles.doctorInfo}>
                <Text style={styles.docName}>{DOCTOR_MAYA.name}</Text>
                <Text style={styles.docTitle}>{DOCTOR_MAYA.title}</Text>
                <Text style={styles.hospital}>{DOCTOR_MAYA.hospitalAffiliation}</Text>
              </View>
              <TouchableOpacity activeOpacity={0.8} style={styles.phoneCircle}>
                <Ionicons name="call" size={18} color={Colors.forest} />
              </TouchableOpacity>
            </View>

            {/* Security Verification PIN Card */}
            <View style={styles.pinCard}>
              <View style={styles.pinTextGroup}>
                <Ionicons name="shield-checkmark" size={24} color={Colors.forest} />
                <View>
                  <Text style={styles.pinTitle}>Bedside Verification PIN</Text>
                  <Text style={styles.pinDesc}>
                    Tell clinician this code upon arrival to begin care
                  </Text>
                </View>
              </View>
              <View style={styles.pinBox}>
                <Text style={styles.pinNumber}>{activeBooking.securityPin}</Text>
              </View>
            </View>

            {/* 7-Stage Visual Progress Stepper */}
            <Text style={styles.stepperHeader}>7-Stage Care Delivery Status</Text>
            <View style={styles.stepperContainer}>
              {trackerStages.map((st, idx) => (
                <View key={idx} style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepCircle,
                      st.done && styles.stepCircleDone,
                      st.current && styles.stepCircleCurrent,
                      st.pending && styles.stepCirclePending,
                    ]}
                  >
                    {st.done ? (
                      <Ionicons name="checkmark" size={12} color={Colors.white} />
                    ) : st.current ? (
                      <View style={styles.innerDot} />
                    ) : (
                      <Text style={styles.pendingText}>{idx + 1}</Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      (st.done || st.current) && styles.stepLabelActive,
                    ]}
                    numberOfLines={1}
                  >
                    {st.label}
                  </Text>
                </View>
              ))}
            </View>

            {/* Visit Details */}
            <View style={styles.detailsBox}>
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={16} color={Colors.muted} />
                <Text style={styles.detailText}>{activeBooking.scheduledDate} ({activeBooking.scheduledTimeSlot})</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={16} color={Colors.muted} />
                <Text style={styles.detailText}>{activeBooking.address}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="medical-outline" size={16} color={Colors.muted} />
                <Text style={styles.detailText}>Symptoms: {activeBooking.symptoms}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Past Completed Bookings */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Past Completed Care</Text>

          {pastBookings.map((bk) => (
            <View key={bk.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <View style={styles.historyLeft}>
                  <Text style={styles.histServiceTitle}>{bk.serviceTitle}</Text>
                  <Text style={styles.histDate}>
                    {bk.scheduledDate} • Booking #{bk.id}
                  </Text>
                </View>
                <Badge label="COMPLETED" variant="emerald" size="sm" />
              </View>

              <View style={styles.histFooter}>
                <Text style={styles.histFee}>Total: ${bk.totalPrice}</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push('/(tabs)/records')}
                  style={styles.viewRecordBtn}
                >
                  <Text style={styles.viewRecordText}>View EMR Report</Text>
                  <Ionicons name="arrow-forward" size={12} color={Colors.forest} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
    backgroundColor: Colors.mist,
  },
  trackerSection: {
    marginBottom: Spacing.xl,
  },
  trackerCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  serviceName: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.lg,
    color: Colors.ink,
    marginTop: 4,
  },
  bookingId: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.muted,
  },
  etaBox: {
    backgroundColor: Colors.amberLight,
    borderWidth: 1,
    borderColor: Colors.amberBorder,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    alignItems: 'center',
  },
  etaNum: {
    fontFamily: Typography.fontFamily.heavy,
    fontWeight: Typography.fontWeight.heavy,
    fontSize: Typography.fontSize.xl,
    color: Colors.amber,
  },
  etaLabel: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: 9,
    color: Colors.amber,
  },
  clinicianBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  doctorImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.mist,
  },
  doctorInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  docName: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.base,
    color: Colors.ink,
  },
  docTitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.teal,
  },
  hospital: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.muted,
  },
  phoneCircle: {
    width: TouchTargets.minWidth,
    height: TouchTargets.minHeight,
    borderRadius: 24,
    backgroundColor: Colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ecfdf5',
    borderWidth: 1.5,
    borderColor: '#a7f3d0',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  pinTextGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.sm,
  },
  pinTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.sm,
    color: Colors.forest,
  },
  pinDesc: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 10,
    color: Colors.inkSoft,
    maxWidth: 160,
  },
  pinBox: {
    backgroundColor: Colors.forest,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  pinNumber: {
    fontFamily: Typography.fontFamily.heavy,
    fontWeight: Typography.fontWeight.heavy,
    fontSize: Typography.fontSize.lg,
    color: Colors.white,
    letterSpacing: 3,
  },
  stepperHeader: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.xs,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: Spacing.sm,
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    paddingHorizontal: 2,
  },
  stepItem: {
    alignItems: 'center',
    width: 42,
  },
  stepCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepCircleDone: {
    backgroundColor: Colors.emerald,
  },
  stepCircleCurrent: {
    backgroundColor: Colors.amber,
  },
  stepCirclePending: {
    backgroundColor: Colors.line,
  },
  innerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.white,
  },
  pendingText: {
    fontSize: 9,
    color: Colors.muted,
    fontWeight: 'bold',
  },
  stepLabel: {
    fontSize: 9,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.mutedLight,
    textAlign: 'center',
  },
  stepLabelActive: {
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.forest,
  },
  detailsBox: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.inkSoft,
    flex: 1,
  },
  historySection: {
    marginTop: Spacing.md,
  },
  historyTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.lg,
    color: Colors.ink,
    marginBottom: Spacing.md,
  },
  historyCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  historyLeft: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  histServiceTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.sm,
    color: Colors.ink,
  },
  histDate: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.muted,
    marginTop: 2,
  },
  histFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
  },
  histFee: {
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: Typography.fontSize.xs,
    color: Colors.inkSoft,
  },
  viewRecordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewRecordText: {
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: Typography.fontSize.xs,
    color: Colors.forest,
  },
});
