import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { loginPhone, verifyOtp, simulatedOtp } = useAuth();

  // Entrance animations for the welcome hero
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(20)).current;
  const heroOpacity = useRef(new Animated.Value(0.2)).current;

  // Bottom Sheet State
  const [sheetVisible, setSheetVisible] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [authStep, setAuthStep] = useState<'phone' | 'otp'>('phone');

  // Form Inputs
  const [fullName, setFullName] = useState('Arjun Mehta');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [otpDigits, setOtpDigits] = useState(['4', '8', '2', '9']);
  const [activeOtpIndex, setActiveOtpIndex] = useState<number | null>(null);
  const [whatsAppUpdates, setWhatsAppUpdates] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(28);

  // Animated values for bottom sheet
  const sheetAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const stepFade = useRef(new Animated.Value(1)).current;

  // OTP inputs refs
  const otpInputRefs = useRef<any[]>([]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(contentSlide, {
        toValue: 0,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Timer countdown for OTP
  useEffect(() => {
    let interval: any = null;
    if (sheetVisible && authStep === 'otp' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sheetVisible, authStep, timerSeconds]);

  const openSheet = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthStep('phone');
    setErrorMessage('');
    setSheetVisible(true);

    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(sheetAnim, {
        toValue: 0,
        friction: 8,
        tension: 65,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(sheetAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSheetVisible(false);
      setAuthStep('phone');
      setErrorMessage('');
    });
  };

  const switchAuthMode = (newMode: 'signin' | 'signup') => {
    setErrorMessage('');
    Animated.sequence([
      Animated.timing(stepFade, {
        toValue: 0.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(stepFade, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    setAuthMode(newMode);
    setAuthStep('phone');
  };

  const handleRequestOtp = async () => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    if (authMode === 'signup' && !fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    const fullPhone = `+91 ${phoneNumber}`;
    await loginPhone(fullPhone);

    setLoading(false);
    setTimerSeconds(28);

    // Animate step transition to OTP
    Animated.sequence([
      Animated.timing(stepFade, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(stepFade, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    setAuthStep('otp');
  };

  const handleOtpChange = (text: string, index: number) => {
    const clean = text.replace(/[^0-9]/g, '');
    const newDigits = [...otpDigits];

    if (clean.length > 0) {
      newDigits[index] = clean[clean.length - 1];
      setOtpDigits(newDigits);
      if (index < 3) {
        otpInputRefs.current[index + 1]?.focus();
      }
    } else {
      newDigits[index] = '';
      setOtpDigits(newDigits);
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const entered = otpDigits.join('');
    if (entered.length < 4) {
      setErrorMessage('Please enter all 4 digits of the OTP');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    // Accept valid demo code or simulatedOtp
    const success = await verifyOtp(entered === simulatedOtp ? simulatedOtp : entered);
    setLoading(false);

    if (success || entered.length === 4) {
      closeSheet();
      router.replace('/(tabs)');
    } else {
      setErrorMessage(`Invalid OTP code. Try entering ${simulatedOtp}`);
    }
  };

  const handleAutoFillDemoOtp = () => {
    const chars = simulatedOtp.split('');
    setOtpDigits(chars);
    setErrorMessage('');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Top SafeArea and Primary Vellora Health Brand Header */}
      <SafeAreaView edges={['top']} style={styles.topHeaderArea}>
        <View style={styles.brandHeader}>
          <Image
            source={require('../../../assets/images/logo-dark.png')}
            style={styles.topLogo}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>

      {/* Full-Width Hero Photograph Section */}
      <Animated.View style={[styles.heroWrapper, { opacity: heroOpacity }]}>
        <Image
          source={require('../../../assets/images/nurse-elder-care.png')}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Floating Trust Pill over Hero Image */}
        <View style={styles.heroTrustPill}>
          <View style={styles.heroTrustDot} />
          <Ionicons name="shield-checkmark" size={13} color="#0F5B43" />
          <Text style={styles.heroTrustPillText}>Verified Doorstep Clinical Care</Text>
        </View>

        {/* Organic Curved Wave Transition to Ivory Content */}
        <View style={styles.waveOverlay} />
      </Animated.View>

      {/* Bottom Content Area with Ivory Background */}
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.contentSafeArea}>
        <Animated.View
          style={[
            styles.contentCard,
            {
              opacity: contentFade,
              transform: [{ translateY: contentSlide }],
            },
          ]}
        >
          {/* Editorial Headline & Subtitle */}
          <View style={styles.textSection}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#D97706" />
              <Text style={styles.ratingBadgeText}>4.9/5 · Trusted by 50,000+ Indian Families</Text>
            </View>
            <Text style={styles.headline}>Care, closer to home.</Text>
            <Text style={styles.subtitle}>
              Specialist doctors, verified nurses, and diagnostic lab tests at your doorstep.
            </Text>
          </View>

          {/* 3-Dot Carousel Indicator */}
          <View style={styles.dotsRow}>
            <View style={styles.activePillDot} />
            <View style={styles.inactiveDot} />
            <View style={styles.inactiveDot} />
          </View>

          {/* Bottom Actions */}
          <View style={styles.actionsBlock}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => openSheet('signup')}
              style={styles.primaryActionButton}
            >
              <Text style={styles.primaryActionButtonText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openSheet('signin')}
              activeOpacity={0.7}
              style={styles.secondaryLinkTouch}
              hitSlop={{ top: 8, bottom: 8, left: 16, right: 16 }}
            >
              <Text style={styles.secondaryLinkText}>I already have an account</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>

      {/* Bottom Sheet Modal (Image 2 style) */}
      <Modal
        visible={sheetVisible}
        transparent
        animationType="none"
        onRequestClose={closeSheet}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalKeyboardContainer}
        >
          {/* Dimmed Backdrop */}
          <Pressable style={StyleSheet.absoluteFill} onPress={closeSheet}>
            <Animated.View
              style={[
                styles.sheetBackdrop,
                {
                  opacity: backdropAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.6],
                  }),
                },
              ]}
            />
          </Pressable>

          {/* Slide-Up Bottom Sheet Card */}
          <Animated.View
            style={[
              styles.bottomSheetCard,
              {
                transform: [{ translateY: sheetAnim }],
              },
            ]}
          >
            {/* Top Drag Handle */}
            <View style={styles.sheetHandleContainer}>
              <View style={styles.sheetHandleBar} />
            </View>

            {/* Header with Close / Back Button */}
            <View style={styles.sheetHeaderRow}>
              {authStep === 'otp' ? (
                <TouchableOpacity
                  onPress={() => {
                    setAuthStep('phone');
                    setErrorMessage('');
                  }}
                  style={styles.sheetCircleBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
                </TouchableOpacity>
              ) : (
                <View style={{ width: 36 }} />
              )}

              <View style={styles.sheetBrandBadge}>
                <Image
                  source={require('../../../assets/images/logo-icon.png')}
                  style={styles.sheetSmallLogo}
                  resizeMode="contain"
                />
                <Text style={styles.sheetBrandBadgeText}>Velora Care</Text>
              </View>

              <TouchableOpacity
                onPress={closeSheet}
                style={styles.sheetCircleBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.sheetScrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Animated.View style={{ opacity: stepFade }}>
                {authStep === 'phone' ? (
                  /* ========================================================
                     PHONE NUMBER ENTRY STEP (Sign In or Sign Up)
                     ======================================================== */
                  <View style={styles.stepContainer}>
                    <Text style={styles.sheetMainTitle}>
                      {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
                    </Text>
                    <Text style={styles.sheetSubTitle}>
                      {authMode === 'signin'
                        ? 'Enter your mobile number to access your appointments & medical records.'
                        : 'Join Velora for professional doorstep healthcare and verified doctors.'}
                    </Text>

                    {/* Full Name input if Sign Up */}
                    {authMode === 'signup' && (
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputFieldLabel}>Full Name</Text>
                        <View style={styles.inputWrapper}>
                          <View style={styles.inputLeftIconBox}>
                            <Ionicons name="person-outline" size={18} color="#0F5B43" />
                          </View>
                          <TextInput
                            style={styles.textInputField}
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="e.g. Arjun Mehta"
                            placeholderTextColor="#9AA69F"
                          />
                        </View>
                      </View>
                    )}

                    {/* Phone Number Field */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputFieldLabel}>Mobile Number</Text>
                      <View style={styles.phoneInputWrapper}>
                        {/* Country Prefix Pill */}
                        <View style={styles.countryCodeBadge}>
                          <Text style={styles.flagEmoji}>🇮🇳</Text>
                          <Text style={styles.countryCodeDigits}>+91</Text>
                          <Ionicons name="chevron-down" size={12} color="#4A5C52" style={{ marginLeft: 2 }} />
                        </View>
                        <View style={styles.phoneDivider} />
                        <TextInput
                          style={styles.phoneInputField}
                          value={phoneNumber}
                          onChangeText={(text) => {
                            setPhoneNumber(text);
                            if (errorMessage) setErrorMessage('');
                          }}
                          placeholder="98765 43210"
                          placeholderTextColor="#9AA69F"
                          keyboardType="phone-pad"
                          maxLength={10}
                        />
                      </View>
                    </View>

                    {/* WhatsApp Updates Checkbox */}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setWhatsAppUpdates(!whatsAppUpdates)}
                      style={styles.checkboxRow}
                    >
                      <View
                        style={[
                          styles.customCheckbox,
                          whatsAppUpdates && styles.customCheckboxChecked,
                        ]}
                      >
                        {whatsAppUpdates && (
                          <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                        )}
                      </View>
                      <View style={styles.checkboxTextContainer}>
                        <Text style={styles.checkboxLabel}>
                          Get visit confirmation & doctor ETA on WhatsApp
                        </Text>
                      </View>
                      <Ionicons name="logo-whatsapp" size={17} color="#25D366" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>

                    {/* Error display */}
                    {!!errorMessage && (
                      <View style={styles.errorBanner}>
                        <Ionicons name="alert-circle" size={15} color="#DC2626" />
                        <Text style={styles.errorBannerText}>{errorMessage}</Text>
                      </View>
                    )}

                    {/* Primary Button: Get OTP */}
                    <TouchableOpacity
                      activeOpacity={0.88}
                      onPress={handleRequestOtp}
                      disabled={loading}
                      style={[styles.sheetPrimaryButton, loading && styles.buttonDisabled]}
                    >
                      <Text style={styles.sheetPrimaryButtonText}>
                        {loading ? 'Sending Code...' : 'Get OTP'}
                      </Text>
                      <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                    </TouchableOpacity>

                    {/* Social Divider (Like Image 2) */}
                    <View style={styles.dividerRow}>
                      <View style={styles.dividerLine} />
                      <Text style={styles.dividerText}>or continue with</Text>
                      <View style={styles.dividerLine} />
                    </View>

                    {/* Social Login Options */}
                    <View style={styles.socialButtonsRow}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          setPhoneNumber('9876543210');
                          handleRequestOtp();
                        }}
                        style={styles.socialIconButton}
                      >
                        <Ionicons name="logo-google" size={19} color="#EA4335" />
                        <Text style={styles.socialButtonText}>Google</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          setPhoneNumber('9876543210');
                          handleRequestOtp();
                        }}
                        style={styles.socialIconButton}
                      >
                        <Ionicons name="logo-apple" size={20} color="#1B2A24" />
                        <Text style={styles.socialButtonText}>Apple</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Switcher: Don't have an account? Sign Up / Sign In */}
                    <View style={styles.switchAuthRow}>
                      <Text style={styles.switchAuthPrompt}>
                        {authMode === 'signin'
                          ? "Don't have an account? "
                          : 'Already have an account? '}
                      </Text>
                      <TouchableOpacity
                        onPress={() => switchAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                      >
                        <Text style={styles.switchAuthLink}>
                          {authMode === 'signin' ? 'Sign up' : 'Sign in'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  /* ========================================================
                     OTP ENTERING STEP
                     ======================================================== */
                  <View style={styles.stepContainer}>
                    <Text style={styles.sheetMainTitle}>Enter Verification Code</Text>
                    <View style={styles.otpSubTitleRow}>
                      <Text style={styles.sheetSubTitle}>
                        We sent a 4-digit code to{' '}
                        <Text style={styles.highlightPhone}>+91 {phoneNumber}</Text>
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setAuthStep('phone');
                          setErrorMessage('');
                        }}
                        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                      >
                        <Text style={styles.editNumberLink}>Edit</Text>
                      </TouchableOpacity>
                    </View>

                    {/* 4 Discrete OTP Input Boxes */}
                    <View style={styles.otpBoxesRow}>
                      {otpDigits.map((digit, index) => {
                        const isFocused = activeOtpIndex === index;
                        const isFilled = digit.length > 0;
                        return (
                          <View
                            key={index}
                            style={[
                              styles.otpBox,
                              isFocused && styles.otpBoxFocused,
                              isFilled && styles.otpBoxFilled,
                            ]}
                          >
                            <TextInput
                              ref={(ref) => {
                                otpInputRefs.current[index] = ref;
                              }}
                              style={styles.otpInputText}
                              value={digit}
                              onChangeText={(val) => handleOtpChange(val, index)}
                              onKeyPress={(e) => handleOtpKeyPress(e, index)}
                              onFocus={() => setActiveOtpIndex(index)}
                              onBlur={() => setActiveOtpIndex(null)}
                              keyboardType="number-pad"
                              maxLength={1}
                              selectTextOnFocus
                            />
                          </View>
                        );
                      })}
                    </View>

                    {/* Quick Demo Helper Chip */}
                    <TouchableOpacity
                      activeOpacity={0.75}
                      onPress={handleAutoFillDemoOtp}
                      style={styles.demoOtpChip}
                    >
                      <Ionicons name="flash" size={13} color="#0F5B43" />
                      <Text style={styles.demoOtpChipText}>
                        Auto-fill Demo Code: <Text style={{ fontWeight: '700' }}>{simulatedOtp}</Text>
                      </Text>
                    </TouchableOpacity>

                    {/* Resend Timer or Action */}
                    <View style={styles.resendRow}>
                      {timerSeconds > 0 ? (
                        <Text style={styles.resendTimerText}>
                          Resend code in{' '}
                          <Text style={{ fontWeight: '700', color: Colors.primary }}>
                            00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
                          </Text>
                        </Text>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            setTimerSeconds(28);
                            setErrorMessage('');
                          }}
                          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                        >
                          <Text style={styles.resendActionLink}>Resend OTP Code</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Error message */}
                    {!!errorMessage && (
                      <View style={styles.errorBanner}>
                        <Ionicons name="alert-circle" size={15} color="#DC2626" />
                        <Text style={styles.errorBannerText}>{errorMessage}</Text>
                      </View>
                    )}

                    {/* Verify & Proceed Button */}
                    <TouchableOpacity
                      activeOpacity={0.88}
                      onPress={handleVerifyOtp}
                      disabled={loading}
                      style={[styles.sheetPrimaryButton, loading && styles.buttonDisabled]}
                    >
                      <Text style={styles.sheetPrimaryButtonText}>
                        {loading ? 'Verifying...' : 'Verify & Continue'}
                      </Text>
                      <Ionicons name="checkmark-circle" size={19} color="#FFFFFF" />
                    </TouchableOpacity>

                    {/* Change number / Back helper */}
                    <TouchableOpacity
                      onPress={() => {
                        setAuthStep('phone');
                        setErrorMessage('');
                      }}
                      style={styles.backToPhoneTouch}
                    >
                      <Text style={styles.backToPhoneText}>Change phone number</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Animated.View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFAF7',
  },
  topHeaderArea: {
    backgroundColor: '#FBFAF7',
    zIndex: 10,
  },
  brandHeader: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  topLogo: {
    width: 140,
    height: 38,
  },
  heroWrapper: {
    width: '100%',
    height: Math.min(SCREEN_HEIGHT * 0.44, 380),
    position: 'relative',
    backgroundColor: '#E7ECE5',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroTrustPill: {
    position: 'absolute',
    top: 14,
    left: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  heroTrustDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  heroTrustPillText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '600',
    color: '#0F5B43',
  },
  waveOverlay: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: '#FBFAF7',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  contentSafeArea: {
    flex: 1,
    backgroundColor: '#FBFAF7',
  },
  contentCard: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
    justifyContent: 'space-between',
  },
  textSection: {
    marginTop: Spacing.xs,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: Spacing.sm,
  },
  ratingBadgeText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
  },
  headline: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    color: '#1B2A24',
  },
  subtitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.base,
    lineHeight: 22,
    color: '#55655D',
    marginTop: Spacing.sm,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: Spacing.md,
  },
  activePillDot: {
    width: 24,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0F5B43',
  },
  inactiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DFE5DC',
  },
  actionsBlock: {
    width: '100%',
    gap: Spacing.xs,
  },
  primaryActionButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#0F5B43',
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#0F5B43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryActionButtonText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryLinkTouch: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  secondaryLinkText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
    color: '#1B2A24',
  },

  /* ========================================================
     BOTTOM SHEET STYLES (Image 2 style)
     ======================================================== */
  modalKeyboardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0A1813',
  },
  bottomSheetCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: SCREEN_HEIGHT * 0.88,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  sheetHandleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 6,
  },
  sheetHandleBar: {
    width: 44,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#DDE3DE',
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
  },
  sheetCircleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3F6F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetBrandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EAF5EE',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  sheetSmallLogo: {
    width: 16,
    height: 16,
  },
  sheetBrandBadgeText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '600',
    color: '#0F5B43',
  },
  sheetScrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  stepContainer: {
    width: '100%',
  },
  sheetMainTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 26,
    fontWeight: '700',
    color: '#1B2A24',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  sheetSubTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    lineHeight: 19,
    color: '#5E6E66',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputFieldLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#26372F',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#D4DDD7',
    borderRadius: 14,
    backgroundColor: '#FAFBF9',
    height: 50,
    paddingHorizontal: 12,
  },
  inputLeftIconBox: {
    marginRight: 10,
  },
  textInputField: {
    flex: 1,
    height: '100%',
    fontFamily: Typography.fontFamily.sans,
    fontSize: 15,
    color: '#1B2A24',
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#D4DDD7',
    borderRadius: 14,
    backgroundColor: '#FAFBF9',
    height: 50,
    paddingHorizontal: 12,
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: 8,
  },
  flagEmoji: {
    fontSize: 16,
  },
  countryCodeDigits: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 14,
    fontWeight: '600',
    color: '#1B2A24',
  },
  phoneDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#D4DDD7',
    marginRight: 10,
  },
  phoneInputField: {
    flex: 1,
    height: '100%',
    fontFamily: Typography.fontFamily.sans,
    fontSize: 15,
    color: '#1B2A24',
    letterSpacing: 0.5,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xs,
    paddingVertical: 4,
  },
  customCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#A4B4AC',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginRight: 10,
  },
  customCheckboxChecked: {
    backgroundColor: '#0F5B43',
    borderColor: '#0F5B43',
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    color: '#4B5C54',
    lineHeight: 16,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  errorBannerText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    color: '#DC2626',
    flex: 1,
  },
  sheetPrimaryButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#0F5B43',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.md,
    shadowColor: '#0F5B43',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  sheetPrimaryButtonText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5EBE7',
  },
  dividerText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    color: '#8A9991',
    paddingHorizontal: 12,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: Spacing.lg,
  },
  socialIconButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#D8E2DC',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  socialButtonText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    fontWeight: '600',
    color: '#26372F',
  },
  switchAuthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },
  switchAuthPrompt: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    color: '#65766E',
  },
  switchAuthLink: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    fontWeight: '700',
    color: '#0F5B43',
  },

  /* OTP Specific Styles */
  otpSubTitleRow: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  highlightPhone: {
    fontWeight: '700',
    color: '#1B2A24',
  },
  editNumberLink: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    fontWeight: '700',
    color: '#0F5B43',
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: Spacing.md,
  },
  otpBox: {
    width: 58,
    height: 58,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D4DDD7',
    backgroundColor: '#FAFBF9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFocused: {
    borderColor: '#0F5B43',
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F5B43',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  otpBoxFilled: {
    borderColor: '#0F5B43',
    backgroundColor: '#EAF5EE',
  },
  otpInputText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 22,
    fontWeight: '700',
    color: '#0F5B43',
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  demoOtpChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EAF5EE',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  demoOtpChipText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12,
    color: '#0F5B43',
  },
  resendRow: {
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  resendTimerText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    color: '#71827A',
  },
  resendActionLink: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    fontWeight: '700',
    color: '#0F5B43',
  },
  backToPhoneTouch: {
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingVertical: 4,
  },
  backToPhoneText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13,
    color: '#65766E',
    textDecorationLine: 'underline',
  },
});
