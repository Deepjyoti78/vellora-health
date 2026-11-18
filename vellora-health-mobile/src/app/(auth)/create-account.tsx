import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { AuthHeader } from '../../components/common/AuthHeader';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';

export default function CreateAccountScreen() {
  const { user } = useAuth();
  // Neutral, un-assumed initial values
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');

  // Animations
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-16)).current;
  const formFade = useRef(new Animated.Value(0)).current;
  const formSlide = useRef(new Animated.Value(24)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.spring(headerSlide, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(formFade, {
        toValue: 1,
        duration: 420,
        delay: 80,
        useNativeDriver: true,
      }),
      Animated.spring(formSlide, {
        toValue: 0,
        friction: 7,
        tension: 50,
        delay: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!agreeTerms) {
      setError('Please acknowledge this is a demonstration to continue');
      return;
    }
    setError('');

    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.spring(buttonScale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start(() => {
      router.push({
        pathname: '/(auth)/patient-setup',
        params: { userName: fullName.trim() },
      });
    });
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar style="dark" />
      
      {/* Universal Top Bar */}
      <AuthHeader />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Main Title & Subtitle with Tight Proportional Spacing */}
          <Animated.View
            style={[
              styles.headerBlock,
              {
                opacity: headerFade,
                transform: [{ translateY: headerSlide }],
              },
            ]}
          >
            <Text style={styles.title}>Let's get to know you.</Text>
            <Text style={styles.subtitle}>Create your account to book and manage care.</Text>
          </Animated.View>

          {/* Form Fields Section */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: formFade,
                transform: [{ translateY: formSlide }],
              },
            ]}
          >
            {/* Full Name */}
            <Input
              iconName="person-outline"
              placeholder="Full Name"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (error) setError('');
              }}
              error={error.includes('name') ? error : undefined}
              containerStyle={styles.inputItem}
            />

            {/* Email (Optional) */}
            <Input
              iconName="mail-outline"
              placeholder="Email (Optional)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.inputItem}
            />

            {/* Date of Birth (Optional) */}
            <Input
              iconName="calendar-outline"
              placeholder="Date of Birth (Optional)"
              value={dob}
              onChangeText={setDob}
              containerStyle={styles.inputItem}
            />

            {/* Gender Selection Segment */}
            <View style={styles.genderRow}>
              {(['Male', 'Female', 'Other'] as const).map((option) => {
                const isSelected = gender === option;
                return (
                  <TouchableOpacity
                    key={option}
                    activeOpacity={0.8}
                    onPress={() => setGender(option)}
                    style={[
                      styles.genderPill,
                      isSelected ? styles.genderPillActive : undefined,
                    ]}
                  >
                    <Text
                      style={[
                        styles.genderPillText,
                        isSelected ? styles.genderPillTextActive : undefined,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Demo terms & Session-only data notice Agreement */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setAgreeTerms(!agreeTerms);
                if (error.includes('Terms')) setError('');
              }}
              style={styles.checkboxRow}
            >
              <View style={[styles.checkboxBox, agreeTerms ? styles.checkboxBoxActive : undefined]}>
                {agreeTerms && <Ionicons name="checkmark" size={15} color={Colors.white} />}
              </View>
              <Text style={styles.checkboxLabel}>
                I understand this is a demonstration. Account details stay in this app session.
              </Text>
            </TouchableOpacity>

            {error.includes('Terms') ? (
              <Text style={styles.termsErrorText}>{error}</Text>
            ) : null}
          </Animated.View>

          {/* Primary Action Button */}
          <View style={styles.actionContainer}>
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <Button
                title="Continue"
                onPress={handleContinue}
                iconName="arrow-forward"
                size="lg"
                style={styles.continueButton}
              />
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  headerBlock: {
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.base,
    lineHeight: 22,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  formContainer: {
    marginBottom: Spacing.md,
  },
  inputItem: {
    marginBottom: Spacing.sm,
  },
  genderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginVertical: Spacing.xs,
    marginBottom: Spacing.md,
  },
  genderPill: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    borderWidth: 1.2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  genderPillText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  genderPillTextActive: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.semibold,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Spacing.xs,
    gap: Spacing.sm,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxBoxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxLabel: {
    flex: 1,
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.sm,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  inlineLink: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
    textDecorationLine: 'underline',
  },
  termsErrorText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.xs,
    color: Colors.rose,
    marginTop: Spacing.xs,
    marginLeft: 30,
  },
  actionContainer: {
    paddingTop: Spacing.sm,
  },
  continueButton: {
    width: '100%',
    height: 52,
  },
});
