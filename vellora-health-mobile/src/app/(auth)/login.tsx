import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, TouchTargets } from '../../constants/theme';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const { loginPhone, simulatedOtp, verifyOtp } = useAuth();
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setLoading(true);
    await loginPhone(phone);
    setLoading(false);
    router.push('/(auth)/otp');
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    await verifyOtp(simulatedOtp);
    setLoading(false);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Brand Bar */}
          <View style={styles.brandRow}>
            <View style={styles.brandIconCircle}>
              <Ionicons name="medical" size={20} color={Colors.white} />
            </View>
            <View>
              <Text style={styles.brandTitle}>VELLORA HEALTH</Text>
              <Text style={styles.brandTagline}>Doorstep Clinical Care</Text>
            </View>
          </View>

          {/* Heading Section */}
          <View style={styles.headingSection}>
            <Text style={styles.title}>Sign in with mobile</Text>
            <Text style={styles.subtitle}>
              Access doorstep physician consultations, registered nursing, elderly care, and diagnostic blood draws.
            </Text>
          </View>

          {/* Input & Action */}
          <View style={styles.formContainer}>
            <Input
              label="Mobile Number"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChangeText={(txt) => {
                setPhone(txt);
                if (error) setError('');
              }}
              keyboardType="phone-pad"
              iconName="call-outline"
              error={error}
            />

            <Button
              title="Continue"
              onPress={handleSendOtp}
              loading={loading}
              iconName="arrow-forward"
              style={styles.continueButton}
            />
          </View>

          {/* Privacy & Legal Note */}
          <View style={styles.legalSection}>
            <Text style={styles.legalText}>
              By continuing, you agree to Vellora Health's Terms of Service and Privacy Policy. Standard SMS rates may apply.
            </Text>
            <Text style={styles.supportText}>
              Need assistance? Contact support@vellorahealth.com
            </Text>
          </View>

          {/* Development / Reviewer Utility Controls (Only in DEV) */}
          {__DEV__ ? (
            <View style={styles.devContainer}>
              <Text style={styles.devHeading}>DEVELOPMENT REVIEW CONTROLS</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleQuickDemoLogin}
                style={styles.devQuickButton}
              >
                <Ionicons name="flash" size={14} color={Colors.teal} />
                <Text style={styles.devQuickText}>One-Tap Demo Login (Code: {simulatedOtp})</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
    flexGrow: 1,
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  brandIconCircle: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.md,
    color: Colors.forest,
    letterSpacing: 1.2,
  },
  brandTagline: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.xs,
    color: Colors.muted,
  },
  headingSection: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.xxl,
    color: Colors.ink,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.base,
    color: Colors.inkSoft,
  },
  formContainer: {
    marginBottom: Spacing.xl,
  },
  continueButton: {
    marginTop: Spacing.xs,
  },
  legalSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.line,
    paddingTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  legalText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.lineHeight.xs + 2,
    color: Colors.muted,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  supportText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.xs,
    color: Colors.teal,
    textAlign: 'center',
  },
  devContainer: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  devHeading: {
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: 10,
    color: Colors.muted,
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
  },
  devQuickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.teal,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    gap: 6,
  },
  devQuickText: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.xs,
    color: Colors.teal,
  },
});
