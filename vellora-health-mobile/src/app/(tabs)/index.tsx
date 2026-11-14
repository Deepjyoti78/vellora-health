import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows, TouchTargets } from '../../constants/theme';
import { ACTIVE_IN_TRANSIT_BOOKING } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { user } = useAuth();
  const activeBooking = ACTIVE_IN_TRANSIT_BOOKING;

  const services = [
    {
      id: 'doctor-visit',
      title: 'Doctor Visit',
      subtitle: 'Bedside diagnosis & e-Rx',
      price: 'From $85',
      icon: 'medkit' as const,
      iconColor: Colors.forest,
      iconBg: '#e8f5f1',
    },
    {
      id: 'nursing-care',
      title: 'Nursing Care',
      subtitle: 'IV, wound & 12h shifts',
      price: 'From $45',
      icon: 'heart' as const,
      iconColor: Colors.teal,
      iconBg: Colors.tealLight,
    },
    {
      id: 'caretakers',
      title: 'Caretakers',
      subtitle: 'Elderly & mobility care',
      price: 'From $35',
      icon: 'people' as const,
      iconColor: '#7c3aed',
      iconBg: '#f5f3ff',
    },
    {
      id: 'lab-tests',
      title: 'Diagnostic Labs',
      subtitle: 'Blood draw & cold chain',
      price: 'From $65',
      icon: 'flask' as const,
      iconColor: '#0284c7',
      iconBg: '#f0f9ff',
    },
  ];

  const handleCallHelpline = () => {
    Linking.openURL('tel:15550194357');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 1. Compact Vellora Header */}
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <View style={styles.headerLogo}>
            <Ionicons name="medical" size={16} color={Colors.white} />
          </View>
          <Text style={styles.headerBrandText}>VELLORA HEALTH</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleCallHelpline}
          style={styles.headerSupportPill}
          accessibilityLabel="Call 24/7 Chief Nurse Support"
        >
          <Ionicons name="call-outline" size={14} color={Colors.forest} />
          <Text style={styles.headerSupportText}>Support</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Personalized Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingSub}>PATIENT PORTAL</Text>
          <Text style={styles.greetingName} numberOfLines={1}>
            Hello, {user?.name || 'Eleanor Vance'}
          </Text>
          <Text style={styles.greetingHelper}>
            Select a clinical service for certified doorstep healthcare.
          </Text>
        </View>

        {/* 3. Four Healthcare Service Shortcuts in a 2-Column Grid */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Healthcare Services</Text>
          <Text style={styles.sectionSubtitle}>Doorstep Clinical Care</Text>
        </View>

        <View style={styles.serviceGrid}>
          {services.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              onPress={() => router.push(`/services/${item.id}` as any)}
              style={styles.serviceGridCard}
            >
              <View style={[styles.serviceIconCircle, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon} size={22} color={item.iconColor} />
              </View>
              <Text style={styles.serviceCardTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.serviceCardSub} numberOfLines={2}>
                {item.subtitle}
              </Text>
              <View style={styles.serviceCardFooter}>
                <Text style={styles.serviceCardPrice}>{item.price}</Text>
                <Ionicons name="arrow-forward" size={14} color={Colors.forest} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 4. One Upcoming Appointment Card (if active) */}
        {Boolean(activeBooking) ? (
          <View style={styles.appointmentSection}>
            <Text style={styles.sectionTitle}>Active Demonstration Visit</Text>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push('/(tabs)/bookings')}
              style={styles.appointmentCard}
            >
              <View style={styles.appointmentCardHeader}>
                <Badge
                  label="IN TRANSIT"
                  variant="amber"
                  size="sm"
                  iconName="navigate"
                />
                <Text style={styles.appointmentEta}>
                  ETA ~{activeBooking.etaMinutes || 12} mins
                </Text>
              </View>

              <View style={styles.clinicianRow}>
                <View style={styles.clinicianAvatar}>
                  <Text style={styles.clinicianAvatarInitial}>M</Text>
                </View>
                <View style={styles.clinicianDetails}>
                  <Text style={styles.clinicianName}>
                    {activeBooking.assignedClinician?.name || 'Dr. Maya Patel, MD'}
                  </Text>
                  <Text style={styles.clinicianSpecialty} numberOfLines={1}>
                    {activeBooking.serviceTitle}
                  </Text>
                </View>
              </View>

              <View style={styles.pinRow}>
                <View style={styles.pinInfo}>
                  <Ionicons name="shield-checkmark-outline" size={16} color={Colors.forest} />
                  <Text style={styles.pinLabel}>Bedside Verification PIN</Text>
                </View>
                <View style={styles.pinBadge}>
                  <Text style={styles.pinCode}>{activeBooking.securityPin}</Text>
                </View>
              </View>

              <View style={styles.trackLinkRow}>
                <Text style={styles.trackLinkText}>View live care tracking & route</Text>
                <Ionicons name="chevron-forward" size={14} color={Colors.forest} />
              </View>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* 5. Family Care Shortcut */}
        <View style={styles.familySection}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => router.push('/(tabs)/account')}
            style={styles.familyCard}
          >
            <View style={styles.familyIconCircle}>
              <Ionicons name="people-outline" size={22} color={Colors.teal} />
            </View>
            <View style={styles.familyContent}>
              <Text style={styles.familyTitle}>Family Care & Dependents</Text>
              <Text style={styles.familyDescription}>
                Manage healthcare profiles, medical allergies, and saved addresses for your family members.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.muted} />
          </TouchableOpacity>
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
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
    backgroundColor: Colors.white,
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  headerLogo: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBrandText: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.sm,
    color: Colors.forest,
    letterSpacing: 1,
  },
  headerSupportPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.line,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
    gap: 4,
  },
  headerSupportText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.xs,
    color: Colors.forest,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.md,
    paddingBottom: 96, // Clear bottom navigation bar completely
    backgroundColor: Colors.mist,
  },
  greetingSection: {
    marginBottom: Spacing.lg,
  },
  greetingSub: {
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: 10,
    color: Colors.teal,
    letterSpacing: 1,
  },
  greetingName: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.xl,
    color: Colors.ink,
    marginTop: 2,
  },
  greetingHelper: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.muted,
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.xs + 2,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.base,
    color: Colors.ink,
  },
  sectionSubtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.muted,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  serviceGridCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: Spacing.md,
    ...Shadows.card,
  },
  serviceIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  serviceCardTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.sm,
    color: Colors.ink,
    marginBottom: 2,
  },
  serviceCardSub: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.lineHeight.xs,
    color: Colors.muted,
    minHeight: 32,
    marginBottom: Spacing.xs,
  },
  serviceCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
  },
  serviceCardPrice: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.xs,
    color: Colors.forest,
  },
  appointmentSection: {
    marginBottom: Spacing.xl,
  },
  appointmentCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: '#fed7aa', // Light amber border
    padding: Spacing.md,
    marginTop: Spacing.xs,
    ...Shadows.card,
  },
  appointmentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
    marginBottom: Spacing.sm,
  },
  appointmentEta: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.xs,
    color: Colors.amber,
  },
  clinicianRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  clinicianAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  clinicianAvatarInitial: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: Typography.fontSize.sm,
  },
  clinicianDetails: {
    flex: 1,
  },
  clinicianName: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.sm,
    color: Colors.ink,
  },
  clinicianSpecialty: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.muted,
    marginTop: 1,
  },
  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.tealLight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    marginBottom: Spacing.sm,
  },
  pinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pinLabel: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.xs,
    color: Colors.forest,
  },
  pinBadge: {
    backgroundColor: Colors.forest,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  pinCode: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.xs,
    color: Colors.white,
    letterSpacing: 1.5,
  },
  trackLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 2,
  },
  trackLinkText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.xs,
    color: Colors.forest,
  },
  familySection: {
    marginBottom: Spacing.lg,
  },
  familyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  familyIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  familyContent: {
    flex: 1,
  },
  familyTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.sm,
    color: Colors.ink,
  },
  familyDescription: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.lineHeight.xs + 2,
    color: Colors.muted,
    marginTop: 2,
  },
});
