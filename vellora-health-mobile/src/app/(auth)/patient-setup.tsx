import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { AuthHeader } from '../../components/common/AuthHeader';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';

export default function PatientSetupScreen() {
  const { userName } = useLocalSearchParams<{ userName?: string }>();
  const { verifyOtp, simulatedOtp, updateProfile } = useAuth();
  
  // Current step state: 1 (Who will receive care) or 2 (Family member details if family chosen)
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [recipient, setRecipient] = useState<'myself' | 'family'>('myself');
  
  // Step 2 Fields (Family details)
  const [familyRelation, setFamilyRelation] = useState<'Parent' | 'Spouse' | 'Child' | 'Other'>('Parent');
  const [familyMemberName, setFamilyMemberName] = useState('');
  const [familyMemberAge, setFamilyMemberAge] = useState('');
  const [loading, setLoading] = useState(false);

  // Animations
  const progressAnim = useRef(new Animated.Value(0.5)).current;
  const stepFade = useRef(new Animated.Value(1)).current;
  const stepSlide = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const myselfScale = useRef(new Animated.Value(1)).current;
  const familyScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate progress bar width smoothly
    Animated.timing(progressAnim, {
      toValue: currentStep === 1 ? 0.5 : 1,
      duration: 350,
      useNativeDriver: false,
    }).start();

    // Animate step entrance
    stepFade.setValue(0);
    stepSlide.setValue(currentStep === 2 ? 30 : -30);
    Animated.parallel([
      Animated.timing(stepFade, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.spring(stepSlide, {
        toValue: 0,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  const selectMyself = () => {
    Animated.sequence([
      Animated.timing(myselfScale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.spring(myselfScale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    setRecipient('myself');
  };

  const selectFamily = () => {
    Animated.sequence([
      Animated.timing(familyScale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.spring(familyScale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    setRecipient('family');
  };

  const handleContinue = async () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.spring(buttonScale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start(async () => {
      if (currentStep === 1) {
        if (recipient === 'family') {
          setCurrentStep(2);
          return;
        }
        await completeOnboarding();
      } else {
        await completeOnboarding();
      }
    });
  };

  const completeOnboarding = async () => {
    if (recipient === 'family' && (!familyMemberName.trim() || !/^\d+$/.test(familyMemberAge) || Number(familyMemberAge) < 1 || Number(familyMemberAge) > 120)) { Alert.alert('Family details required', 'Enter a name and an age from 1 to 120.'); return; }
    setLoading(true);
    await verifyOtp(simulatedOtp);
    updateProfile({ name: userName?.trim() || 'Demo patient', demoDependent: recipient === 'family' ? { name: familyMemberName.trim(), relationship: familyRelation, age: Number(familyMemberAge) } : undefined });
    setLoading(false);
    router.replace('/(tabs)');
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/welcome');
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar style="dark" />
      
      {/* Universal Top Bar */}
      <AuthHeader onBack={handleBack} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSection}>
          {/* Progress / Step Header */}
          <View style={styles.stepHeader}>
            <Text style={styles.stepTitle}>Set up your profile</Text>
            <Text style={styles.stepCounter}>{currentStep} of 2</Text>
          </View>

          {/* Dynamic Green Progress Bar (50% on step 1, 100% on step 2) */}
          <View style={styles.progressBarTrack}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          <Animated.View
            style={{
              opacity: stepFade,
              transform: [{ translateX: stepSlide }],
            }}
          >
            {currentStep === 1 ? (
              /* STEP 1: Who will receive care? */
              <>
                {/* Main Title & Subtitle */}
                <View style={styles.headerBlock}>
                  <Text style={styles.title}>Who will receive care?</Text>
                  <Text style={styles.subtitle}>
                    Let us know who the healthcare service is for.
                  </Text>
                </View>

                {/* Option 1: Myself */}
                <Animated.View style={{ transform: [{ scale: myselfScale }] }}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={selectMyself}
                    style={[
                      styles.optionCard,
                      recipient === 'myself' ? styles.optionCardActive : undefined,
                    ]}
                  >
                    <View style={styles.avatarContainer}>
                      <Image
                        source={require('../../../assets/images/patient-myself.png')}
                        style={styles.avatarThumbnail}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.optionContent}>
                      <Text style={styles.optionTitle}>Myself</Text>
                      <Text style={styles.optionDescription}>I need care or services for me.</Text>
                    </View>
                    <View
                      style={[
                        styles.radioOuter,
                        recipient === 'myself' ? styles.radioOuterActive : undefined,
                      ]}
                    >
                      {recipient === 'myself' && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                </Animated.View>

                {/* Option 2: Family Member */}
                <Animated.View style={{ transform: [{ scale: familyScale }] }}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={selectFamily}
                    style={[
                      styles.optionCard,
                      recipient === 'family' ? styles.optionCardActive : undefined,
                    ]}
                  >
                    <View style={styles.avatarContainer}>
                      <Image
                        source={require('../../../assets/images/patient-family.png')}
                        style={styles.avatarThumbnail}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.optionContent}>
                      <Text style={styles.optionTitle}>Family member</Text>
                      <Text style={styles.optionDescription}>
                        I'm booking care for a family member (e.g., parent, spouse, child).
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.radioOuter,
                        recipient === 'family' ? styles.radioOuterActive : undefined,
                      ]}
                    >
                      {recipient === 'family' && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              </>
            ) : (
              /* STEP 2: Family Member Details */
              <>
                <View style={styles.headerBlock}>
                  <Text style={styles.title}>Family Member Info</Text>
                  <Text style={styles.subtitle}>
                    Add details so healthcare providers can prepare proper bedside care.
                  </Text>
                </View>

                {/* Relationship Pills */}
                <Text style={styles.sectionLabel}>Relationship</Text>
                <View style={styles.relationRow}>
                  {(['Parent', 'Spouse', 'Child', 'Other'] as const).map((rel) => {
                    const isSelected = familyRelation === rel;
                    return (
                      <TouchableOpacity
                        key={rel}
                        onPress={() => setFamilyRelation(rel)}
                        style={[
                          styles.relationPill,
                          isSelected ? styles.relationPillActive : undefined,
                        ]}
                      >
                        <Text
                          style={[
                            styles.relationPillText,
                            isSelected ? styles.relationPillTextActive : undefined,
                          ]}
                        >
                          {rel}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Input
                  iconName="person-outline"
                  placeholder="Family Member's Full Name"
                  value={familyMemberName}
                  onChangeText={setFamilyMemberName}
                  containerStyle={styles.inputSpacing}
                />

                <Input
                  iconName="calendar-outline"
                  placeholder="Age (Years)"
                  value={familyMemberAge}
                  onChangeText={setFamilyMemberAge}
                  keyboardType="number-pad"
                  maxLength={3}
                  containerStyle={styles.inputSpacing}
                />
              </>
            )}
          </Animated.View>
        </View>

        {/* Primary Action Button */}
        <View style={styles.actionContainer}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <Button
              title={currentStep === 1 && recipient === 'family' ? 'Next: Family Details' : 'Continue'}
              onPress={handleContinue}
              loading={loading}
              iconName="arrow-forward"
              size="lg"
              style={styles.continueButton}
            />
          </Animated.View>

          {currentStep === 2 && (
            <TouchableOpacity
              onPress={completeOnboarding}
              style={styles.skipTouch}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>Set up later in Account</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.lg,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    width: '100%',
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  stepTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  stepCounter: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.semibold,
  },
  progressBarTrack: {
    width: '100%',
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#DFE5DC',
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2.5,
  },
  headerBlock: {
    marginBottom: Spacing.lg,
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
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  optionCardActive: {
    borderColor: Colors.primary,
    backgroundColor: '#F7FAF5',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E7ECE5',
  },
  avatarThumbnail: {
    width: '100%',
    height: '100%',
  },
  optionContent: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  optionTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  optionDescription: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.sm,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  sectionLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  relationRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.md,
  },
  relationPill: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1.2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  relationPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  relationPillText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  relationPillTextActive: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.semibold,
  },
  inputSpacing: {
    marginBottom: Spacing.sm,
  },
  actionContainer: {
    paddingTop: Spacing.md,
  },
  continueButton: {
    width: '100%',
    height: 52,
  },
  skipTouch: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  skipText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    textDecorationLine: 'underline',
  },
});
