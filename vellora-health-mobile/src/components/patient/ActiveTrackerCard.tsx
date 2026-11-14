import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { PatientBooking } from '../../types';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '../../constants/theme';
import { Badge } from '../common/Badge';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface ActiveTrackerCardProps {
  booking: PatientBooking;
  style?: ViewStyle;
}

export const ActiveTrackerCard: React.FC<ActiveTrackerCardProps> = ({
  booking,
  style,
}) => {
  const clinician = booking.assignedClinician;

  return (
    <View style={[styles.container, style]}>
      {/* Header status bar */}
      <View style={styles.header}>
        <View style={styles.statusRow}>
          <View style={styles.pulsingDot} />
          <Text style={styles.statusTitle}>CLINICIAN EN ROUTE</Text>
        </View>
        <Badge
          label={`ETA ~${booking.etaMinutes || 12} mins`}
          variant="amber"
          size="sm"
          iconName="time"
        />
      </View>

      {/* Clinician Overview */}
      {clinician && (
        <View style={styles.clinicianRow}>
          <Image source={clinician.avatar} style={styles.avatar} />
          <View style={styles.clinicianInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.doctorName} numberOfLines={1}>
                {clinician.name}
              </Text>
              <Ionicons name="checkmark-circle" size={16} color={Colors.emerald} />
            </View>
            <Text style={styles.specialty} numberOfLines={1}>
              {clinician.title} • {clinician.hospitalAffiliation}
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color="#f59e0b" />
              <Text style={styles.ratingText}>
                {clinician.rating} ({clinician.reviewCount} visits)
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/bookings')}
            style={styles.callButton}
          >
            <Ionicons name="call" size={16} color={Colors.forest} />
          </TouchableOpacity>
        </View>
      )}

      {/* Security PIN highlight banner (RFP Requirement: physical verification PIN) */}
      <View style={styles.pinBanner}>
        <View style={styles.pinLeft}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.forest} />
          <View style={styles.pinTexts}>
            <Text style={styles.pinLabel}>Physical Verification PIN</Text>
            <Text style={styles.pinHelper}>Share with doctor upon bedside arrival</Text>
          </View>
        </View>
        <View style={styles.pinBadge}>
          <Text style={styles.pinCode}>{booking.securityPin}</Text>
        </View>
      </View>

      {/* Transit Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '65%' }]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressStepActive}>Dispatched</Text>
          <Text style={styles.progressStepActive}>In Transit</Text>
          <Text style={styles.progressStepPending}>Arrived</Text>
          <Text style={styles.progressStepPending}>Completed</Text>
        </View>
      </View>

      {/* Footer Action */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push('/(tabs)/bookings')}
        style={styles.trackButton}
      >
        <Text style={styles.trackButtonText}>View Live Care Tracking & Route</Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.forest} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card, // 20px
    borderWidth: 1.5,
    borderColor: '#bbf7d0', // Subtle emerald highlight border
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.amber,
    marginRight: Spacing.xs,
  },
  statusTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.xs,
    color: Colors.amber,
    letterSpacing: 0.8,
  },
  clinicianRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.mist,
  },
  clinicianInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  doctorName: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.base,
    color: Colors.ink,
  },
  specialty: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.muted,
    marginTop: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  ratingText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.xs,
    color: Colors.inkSoft,
  },
  callButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.tealLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  pinLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pinTexts: {
    marginLeft: Spacing.sm,
  },
  pinLabel: {
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: Typography.fontSize.xs,
    color: Colors.forest,
  },
  pinHelper: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 10,
    color: Colors.inkSoft,
  },
  pinBadge: {
    backgroundColor: Colors.forest,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  pinCode: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.md,
    color: Colors.white,
    letterSpacing: 2,
  },
  progressContainer: {
    marginBottom: Spacing.sm,
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.line,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.emerald,
    borderRadius: 2,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStepActive: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 10,
    color: Colors.forest,
  },
  progressStepPending: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 10,
    color: Colors.mutedLight,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    gap: 4,
  },
  trackButtonText: {
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: Typography.fontSize.xs,
    color: Colors.forest,
  },
});
