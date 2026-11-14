import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, TouchTargets } from '../../constants/theme';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OtpVerificationScreen() {
  const { pendingPhone, simulatedOtp, verifyOtp } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendStatus, setResendStatus] = useState('');

  // Mask phone number for security: e.g. "+1 (555) 019-2834" -> "+1 (555) •••-2834"
  const getMaskedPhone = (num: string) => {
    if (!num) return '+1 (555) •••-2834';
    const parts = num.split(' ');
    if (parts.length >= 3) {
      return `${parts[0]} ${parts[1]} •••-${parts[2].slice(-4)}`;
    }
    return num.replace(/\d(?=\d{4})/g, '•');
  };

  const handleVerify = async (codeToVerify?: string) => {
    const finalCode = (codeToVerify || code).trim();
    if (finalCode.length < 4) {
      setError('Please enter the full 4-digit code');
      return;
    }
    setError('');
    setLoading(true);
    const success = await verifyOtp(finalCode);
    setLoading(false);
    if (success) {
      router.replace('/(tabs)');
    } else {
      setError(`Incorrect verification code. Please try again.`);
    }
  };

  const handleResend = () => {
    setResendStatus('A new code has been sent.');
    setTimeout(() => setResendStatus(''), 4000);
  };

  const handleAutofillDemo = () => {
    setCode(simulatedOtp);
    setError('');
    handleVerify(simulatedOtp);
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
          {/* Back Navigation */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityLabel="Go back to phone entry"
          >
            <Ionicons name="arrow-back" size={22} color={Colors.ink} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.headingSection}>
            <Text style={styles.title}>Enter verification code</Text>
            <Text style={styles.subtitle}>
              We sent a 4-digit security code to{' '}
              <Text style={styles.phoneText}>{getMaskedPhone(pendingPhone)}</Text>
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Input
              label="4-Digit Code"
              placeholder="••••"
              value={code}
              onChangeText={(txt) => {
                setCode(txt.slice(0, 4));
                if (error) setError('');
              }}
              keyboardType="number-pad"
              maxLength={4}
              error={error}
              autoFocus={true}
              style={styles.otpInput}
            />

            <Button
              title="Verify & Continue"
              onPress={() => handleVerify()}
              loading={loading}
              iconName="checkmark"
              style={styles.verifyButton}
            />
          </View>

          {/* Resend & Status */}
          <View style={styles.resendSection}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleResend}
              style={styles.resendButton}
            >
              <Text style={styles.resendText}>Didn't receive a code? Resend SMS</Text>
            </TouchableOpacity>

            {Boolean(resendStatus) ? (
              <Text style={styles.resendSuccessText}>{resendStatus}</Text>
            ) : null}
          </View>

          {/* Development / Reviewer Utility (Only in DEV) */}
          {__DEV__ ? (
            <View style={styles.devBox}>
              <Text style={styles.devLabel}>DEVELOPMENT REVIEW CONTROLS</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleAutofillDemo}
                style={styles.devPill}
              >
                <Ionicons name="sparkles" size={14} color={Colors.teal} />
                <Text style={styles.devText}>
                  Autofill Demo Code: <Text style={styles.devCode}>{simulatedOtp}</Text>
                </Text>
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
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    flexGrow: 1,
  },
  backButton: {
    width: TouchTargets.minWidth,
    height: TouchTargets.minHeight,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: Spacing.md,
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
  phoneText: {
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.ink,
  },
  formContainer: {
    marginBottom: Spacing.lg,
  },
  otpInput: {
    textAlign: 'center',
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    letterSpacing: 8,
  },
  verifyButton: {
    marginTop: Spacing.xs,
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  resendButton: {
    paddingVertical: Spacing.xs,
  },
  resendText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.sm,
    color: Colors.teal,
  },
  resendSuccessText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.emerald,
    marginTop: 4,
  },
  devBox: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: 'auto',
  },
  devLabel: {
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: 10,
    color: Colors.muted,
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
  },
  devPill: {
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
  devText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.xs,
    color: Colors.inkSoft,
  },
  devCode: {
    fontFamily: Typography.fontFamily.bold,
    color: Colors.forest,
  },
});
