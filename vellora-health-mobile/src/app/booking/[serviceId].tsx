import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { CORE_SERVICES, CURRENT_PATIENT } from '../../data/mockData';
import { Colors, Typography, Spacing, BorderRadius, Shadows, TouchTargets } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Ionicons } from '@expo/vector-icons';

export default function BookingScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const service = CORE_SERVICES.find((s) => s.id === serviceId) || CORE_SERVICES[0];

  const [selectedDate, setSelectedDate] = useState('Today (Immediate)');
  const [selectedSlot, setSelectedSlot] = useState('Afternoon (2 PM – 5 PM)');
  const [selectedShift, setSelectedShift] = useState(
    service.durationOptions ? service.durationOptions[0] : 'Standard Consultation'
  );
  const [isEmergency, setIsEmergency] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'AT_HOME' | 'CARD'>('AT_HOME');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const basePrice = service.priceStartingAt;
  const emergencySurcharge = isEmergency ? 25 : 0;
  const tax = Math.round((basePrice + emergencySurcharge) * 0.08);
  const totalPrice = basePrice + emergencySurcharge + tax;

  const handleConfirmBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Doorstep Care Dispatched',
        `Your visit has been confirmed! Share security PIN 4829 upon bedside arrival.`,
        [
          {
            text: 'Track Visit Now',
            onPress: () => router.replace('/(tabs)/bookings'),
          },
        ]
      );
    }, 700);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Schedule Doorstep Visit" subtitle={service.title} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Step 1: Patient Profile */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>1</Text>
            </View>
            <Text style={styles.stepTitle}>Patient & Bedside Location</Text>
          </View>

          <View style={styles.patientInfoBox}>
            <View style={styles.patientAvatar}>
              <Text style={styles.patientInitial}>E</Text>
            </View>
            <View style={styles.patientDetails}>
              <Text style={styles.patientName}>{CURRENT_PATIENT.name} (74 yrs)</Text>
              <Text style={styles.patientAddress}>{CURRENT_PATIENT.address?.street}, {CURRENT_PATIENT.address?.city}</Text>
              <Text style={styles.patientConditions}>
                Conditions: {CURRENT_PATIENT.chronicConditions?.join(', ')}
              </Text>
            </View>
            <Badge label="Primary" variant="teal" size="sm" />
          </View>

          <Input
            label="Chief Medical Symptoms (Optional)"
            placeholder="e.g. Mild fever, dry cough, blood pressure check"
            value={symptoms}
            onChangeText={setSymptoms}
            iconName="fitness-outline"
            containerStyle={styles.symptomsInput}
          />
        </View>

        {/* Step 2: Shift or Duration (if applicable) */}
        {service.durationOptions && (
          <View style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>2</Text>
              </View>
              <Text style={styles.stepTitle}>Care Shift Duration</Text>
            </View>

            <View style={styles.shiftSelector}>
              {service.durationOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  activeOpacity={0.8}
                  onPress={() => setSelectedShift(opt)}
                  style={[styles.shiftOption, selectedShift === opt && styles.shiftOptionActive]}
                >
                  <View style={styles.radioOuter}>
                    {selectedShift === opt && <View style={styles.radioInner} />}
                  </View>
                  <Text style={[styles.shiftText, selectedShift === opt && styles.shiftTextActive]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 3: Date & Time Slot */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>3</Text>
            </View>
            <Text style={styles.stepTitle}>Preferred Arrival Window</Text>
          </View>

          {/* Date Selector */}
          <View style={styles.slotPillsRow}>
            {['Today (Immediate)', 'Tomorrow Morning', 'Next Day'].map((d) => (
              <TouchableOpacity
                key={d}
                activeOpacity={0.8}
                onPress={() => setSelectedDate(d)}
                style={[styles.slotPill, selectedDate === d && styles.slotPillActive]}
              >
                <Text style={[styles.slotPillText, selectedDate === d && styles.slotPillTextActive]}>
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Time Slot */}
          <View style={styles.timeSlotGrid}>
            {[
              { slot: 'Morning (8 AM – 12 PM)', icon: 'sunny-outline' },
              { slot: 'Afternoon (2 PM – 5 PM)', icon: 'partly-sunny-outline' },
              { slot: 'Evening (6 PM – 9 PM)', icon: 'moon-outline' },
            ].map((ts) => (
              <TouchableOpacity
                key={ts.slot}
                activeOpacity={0.8}
                onPress={() => setSelectedSlot(ts.slot)}
                style={[styles.timeSlotItem, selectedSlot === ts.slot && styles.timeSlotItemActive]}
              >
                <Ionicons
                  name={ts.icon as any}
                  size={16}
                  color={selectedSlot === ts.slot ? Colors.forest : Colors.muted}
                />
                <Text style={[styles.timeSlotText, selectedSlot === ts.slot && styles.timeSlotTextActive]}>
                  {ts.slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Step 4: Emergency Dispatch Priority Toggle */}
        <View style={[styles.stepCard, isEmergency && styles.emergencyCard]}>
          <View style={styles.emergencyToggleRow}>
            <View style={styles.emergencyTextGroup}>
              <View style={styles.emergencyTitleRow}>
                <Ionicons name="flash" size={18} color={isEmergency ? Colors.rose : Colors.muted} />
                <Text style={[styles.emergencyTitle, isEmergency && { color: Colors.rose }]}>
                  Immediate Emergency Dispatch (+$25)
                </Text>
              </View>
              <Text style={styles.emergencySubtitle}>
                Priority 15-minute dispatch alert sent directly to closest in-radius clinician.
              </Text>
            </View>
            <Switch
              value={isEmergency}
              onValueChange={setIsEmergency}
              trackColor={{ false: Colors.line, true: Colors.roseLight }}
              thumbColor={isEmergency ? Colors.rose : Colors.white}
            />
          </View>
        </View>

        {/* Step 5: Bill Breakdown & Payment */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>4</Text>
            </View>
            <Text style={styles.stepTitle}>Itemized Billing & Payment</Text>
          </View>

          <View style={styles.billBox}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Base Clinical Fee ({service.title})</Text>
              <Text style={styles.billVal}>${basePrice}.00</Text>
            </View>
            {isEmergency && (
              <View style={styles.billRow}>
                <Text style={[styles.billLabel, { color: Colors.rose }]}>Emergency Priority Dispatch</Text>
                <Text style={[styles.billVal, { color: Colors.rose }]}>+$25.00</Text>
              </View>
            )}
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Medical Consumables & Tax (8%)</Text>
              <Text style={styles.billVal}>${tax}.00</Text>
            </View>
            <View style={styles.billDivider} />
            <View style={styles.billTotalRow}>
              <Text style={styles.billTotalLabel}>Total Due</Text>
              <Text style={styles.billTotalVal}>${totalPrice}.00</Text>
            </View>
          </View>

          {/* Payment Method Selector */}
          <Text style={styles.payMethodHeader}>Payment Method</Text>
          <View style={styles.payOptions}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setPaymentMethod('AT_HOME')}
              style={[styles.payOption, paymentMethod === 'AT_HOME' && styles.payOptionActive]}
            >
              <Ionicons
                name="cash-outline"
                size={18}
                color={paymentMethod === 'AT_HOME' ? Colors.forest : Colors.muted}
              />
              <Text style={[styles.payText, paymentMethod === 'AT_HOME' && styles.payTextActive]}>
                Pay at Home After Service
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setPaymentMethod('CARD')}
              style={[styles.payOption, paymentMethod === 'CARD' && styles.payOptionActive]}
            >
              <Ionicons
                name="card-outline"
                size={18}
                color={paymentMethod === 'CARD' ? Colors.forest : Colors.muted}
              />
              <Text style={[styles.payText, paymentMethod === 'CARD' && styles.payTextActive]}>
                Credit / Debit Card (Mock)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Security PIN Assurance Note */}
        <View style={styles.securityPinNote}>
          <Ionicons name="key-outline" size={20} color={Colors.forest} />
          <View style={styles.secTextCol}>
            <Text style={styles.secTitle}>Auto-Generated Bedside PIN: 4829</Text>
            <Text style={styles.secDesc}>
              You will be provided this 4-digit code to unlock the clinician encounter upon doorstep arrival.
            </Text>
          </View>
        </View>

        <Button
          title={`Confirm Booking • $${totalPrice}.00`}
          onPress={handleConfirmBooking}
          loading={isSubmitting}
          iconName="checkmark-circle"
          style={styles.confirmBtn}
        />
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
  stepCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  emergencyCard: {
    borderColor: Colors.roseBorder,
    backgroundColor: '#fffbfa',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 11,
    color: Colors.white,
  },
  stepTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.sm,
    color: Colors.ink,
  },
  patientInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  patientAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  patientInitial: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.xs,
    color: Colors.ink,
  },
  patientAddress: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 10,
    color: Colors.muted,
  },
  patientConditions: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 9,
    color: Colors.teal,
  },
  symptomsInput: {
    marginTop: Spacing.md,
    marginBottom: 0,
  },
  shiftSelector: {
    gap: Spacing.xs,
  },
  shiftOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  shiftOptionActive: {
    borderColor: Colors.forest,
    backgroundColor: '#f0fdf9',
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.forest,
  },
  shiftText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.xs,
    color: Colors.inkSoft,
  },
  shiftTextActive: {
    fontFamily: Typography.fontFamily.bold,
    color: Colors.forest,
  },
  slotPillsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  slotPill: {
    flex: 1,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: BorderRadius.md,
    paddingVertical: 8,
    alignItems: 'center',
  },
  slotPillActive: {
    backgroundColor: Colors.forest,
    borderColor: Colors.forest,
  },
  slotPillText: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: 10,
    color: Colors.inkSoft,
    textAlign: 'center',
  },
  slotPillTextActive: {
    color: Colors.white,
  },
  timeSlotGrid: {
    gap: 6,
  },
  timeSlotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  timeSlotItemActive: {
    borderColor: Colors.forest,
    backgroundColor: '#f0fdf9',
  },
  timeSlotText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.xs,
    color: Colors.inkSoft,
  },
  timeSlotTextActive: {
    fontFamily: Typography.fontFamily.bold,
    color: Colors.forest,
  },
  emergencyToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emergencyTextGroup: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  emergencyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  emergencyTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.xs,
    color: Colors.ink,
  },
  emergencySubtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 10,
    color: Colors.muted,
  },
  billBox: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  billLabel: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.muted,
  },
  billVal: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.xs,
    color: Colors.ink,
  },
  billDivider: {
    height: 1,
    backgroundColor: Colors.line,
    marginVertical: 6,
  },
  billTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billTotalLabel: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.sm,
    color: Colors.ink,
  },
  billTotalVal: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.lg,
    color: Colors.forest,
  },
  payMethodHeader: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.xs,
    color: Colors.muted,
    marginBottom: Spacing.xs,
  },
  payOptions: {
    gap: 6,
  },
  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  payOptionActive: {
    borderColor: Colors.forest,
    backgroundColor: '#f0fdf9',
  },
  payText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.xs,
    color: Colors.inkSoft,
  },
  payTextActive: {
    fontFamily: Typography.fontFamily.bold,
    color: Colors.forest,
  },
  securityPinNote: {
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
  secTextCol: {
    flex: 1,
  },
  secTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.xs,
    color: Colors.forest,
    marginBottom: 2,
  },
  secDesc: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 10,
    lineHeight: 14,
    color: Colors.inkSoft,
  },
  confirmBtn: {
    marginBottom: Spacing.xl,
  },
});
