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
import { useLocalSearchParams, router } from 'expo-router';
import { CORE_SERVICES } from '../../data/mockData';
import { Colors, Typography, Spacing, BorderRadius, Shadows, TouchTargets } from '../../constants/theme';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const service = CORE_SERVICES.find((s) => s.id === id) || CORE_SERVICES[0];

  const handleBookNow = () => {
    router.push(`/booking/${service.id}` as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header with Back button */}
      <View style={styles.topNav}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.ink} />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          {service.category}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={service.image} style={styles.image} resizeMode="cover" />
          <View style={styles.overlayCategory}>
            <Badge label={`${service.number} • ${service.category}`} variant="dark" size="md" />
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{service.title}</Text>
          </View>
          <Text style={styles.subtitle}>{service.subtitle}</Text>

          {/* Pricing Highlight */}
          <View style={styles.priceCard}>
            <View>
              <Text style={styles.priceLabel}>Standard Doorstep Fee</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceVal}>${service.priceStartingAt}</Text>
                <Text style={styles.priceUnit}> / {service.priceUnit.replace('per ', '')}</Text>
              </View>
            </View>
            <Badge label="Clear Pricing" variant="emerald" size="sm" iconName="shield-checkmark" />
          </View>

          {/* Overview */}
          <Text style={styles.sectionHeading}>Clinical Overview</Text>
          <Text style={styles.descriptionText}>{service.description}</Text>

          {/* Shift options if nursing or caretaker */}
          {service.durationOptions && (
            <View style={styles.shiftBox}>
              <Text style={styles.sectionHeading}>Available Shift Durations</Text>
              <View style={styles.shiftChips}>
                {service.durationOptions.map((opt, idx) => (
                  <View key={idx} style={styles.shiftChip}>
                    <Ionicons name="time-outline" size={14} color={Colors.teal} />
                    <Text style={styles.shiftChipText}>{opt}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Key Clinical Features */}
          <Text style={styles.sectionHeading}>What's Included in Every Visit</Text>
          <View style={styles.featureBox}>
            {service.features.map((feat, idx) => (
              <View key={idx} style={styles.featureRow}>
                <View style={styles.checkIcon}>
                  <Ionicons name="checkmark" size={14} color={Colors.white} />
                </View>
                <Text style={styles.featureText}>{feat}</Text>
              </View>
            ))}
          </View>

          {/* Safety & Protocol Box */}
          <View style={styles.protocolBox}>
            <Ionicons name="finger-print" size={20} color={Colors.forest} />
            <View style={styles.protocolTextCol}>
              <Text style={styles.protocolTitle}>Mandatory Bedside PIN Verification</Text>
              <Text style={styles.protocolDesc}>
                Our clinician cannot initiate service or access clinical charts without your 4-digit security code.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom CTA */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceCol}>
          <Text style={styles.bottomPriceLabel}>Total starting at</Text>
          <Text style={styles.bottomPriceVal}>${service.priceStartingAt}</Text>
        </View>
        <Button
          title="Proceed to Booking"
          onPress={handleBookNow}
          iconName="arrow-forward"
          style={styles.bookButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  backButton: {
    width: TouchTargets.minWidth,
    height: TouchTargets.minHeight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -Spacing.xs,
  },
  navTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.sm,
    color: Colors.ink,
    letterSpacing: 0.5,
  },
  placeholder: {
    width: TouchTargets.minWidth,
  },
  scrollContent: {
    paddingBottom: 110,
    backgroundColor: Colors.mist,
  },
  imageContainer: {
    height: 220,
    width: '100%',
    position: 'relative',
    backgroundColor: Colors.mist,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlayCategory: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.screenPadding,
  },
  body: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
  },
  titleRow: {
    marginBottom: 4,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.xxl,
    color: Colors.ink,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.medium,
    fontWeight: Typography.fontWeight.medium,
    fontSize: Typography.fontSize.sm,
    color: Colors.teal,
    marginBottom: Spacing.md,
  },
  priceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  priceLabel: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.muted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceVal: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.xxl,
    color: Colors.forest,
  },
  priceUnit: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.muted,
  },
  sectionHeading: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.sm,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  descriptionText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.lineHeight.base,
    color: Colors.inkSoft,
    marginBottom: Spacing.md,
  },
  shiftBox: {
    marginBottom: Spacing.md,
  },
  shiftChips: {
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  shiftChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tealLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  shiftChipText: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.xs,
    color: Colors.tealDark,
  },
  featureBox: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  checkIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.emerald,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.sm,
    color: Colors.ink,
    flex: 1,
  },
  protocolBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  protocolTextCol: {
    flex: 1,
  },
  protocolTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.xs,
    color: Colors.forest,
    marginBottom: 2,
  },
  protocolDesc: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.lineHeight.sm,
    color: Colors.inkSoft,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.modal,
  },
  bottomPriceCol: {
    marginRight: Spacing.md,
  },
  bottomPriceLabel: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.muted,
  },
  bottomPriceVal: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.xl,
    color: Colors.forest,
  },
  bookButton: {
    flex: 1,
  },
});
