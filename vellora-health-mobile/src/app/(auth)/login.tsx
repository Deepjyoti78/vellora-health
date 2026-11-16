import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  FlatList,
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

const SUPPORTED_COUNTRIES = [
  { code: '+91', country: 'India', flag: '🇮🇳', minDigits: 10, maxDigits: 10 },
  { code: '+1', country: 'United States', flag: '🇺🇸', minDigits: 10, maxDigits: 10 },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧', minDigits: 10, maxDigits: 11 },
  { code: '+971', country: 'UAE', flag: '🇦🇪', minDigits: 9, maxDigits: 9 },
  { code: '+65', country: 'Singapore', flag: '🇸🇬', minDigits: 8, maxDigits: 8 },
];

export default function LoginScreen() {
  const { loginPhone, simulatedOtp, verifyOtp } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [selectedCountry, setSelectedCountry] = useState(SUPPORTED_COUNTRIES[0]);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < selectedCountry.minDigits) {
      setError(`Please enter a valid ${selectedCountry.minDigits}-digit mobile number`);
      return;
    }
    setError('');
    setLoading(true);
    const fullPhone = `${selectedCountry.code} ${phoneNumber}`;
    await loginPhone(fullPhone);
    setLoading(false);
    router.push({
      pathname: '/(auth)/otp',
      params: { phone: fullPhone },
    });
  };

  const handleQuickDemoBypass = async () => {
    setLoading(true);
    await verifyOtp(simulatedOtp);
    setLoading(false);
    router.replace('/(tabs)');
  };

  const prefixElement = (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => setShowCountryModal(true)}
      style={styles.prefixWrapper}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Text style={styles.countryCodeText}>{selectedCountry.code}</Text>
      <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} style={styles.chevronIcon} />
      <View style={styles.prefixDivider} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar style="dark" />
      
      {/* Universal Auth Top Bar */}
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
          {/* Main Title & Subtitle */}
          <View style={styles.headerBlock}>
            <Text style={styles.title}>Your care starts here.</Text>
            <Text style={styles.subtitle}>Enter your mobile number to continue.</Text>
          </View>

          {/* Phone Input & Action Section */}
          <View style={styles.formSection}>
            <Input
              prefixComponent={prefixElement}
              placeholder="Enter mobile number"
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                if (error) setError('');
              }}
              keyboardType="phone-pad"
              maxLength={selectedCountry.maxDigits}
              error={error}
              containerStyle={styles.inputContainer}
              autoFocus={false}
            />

            <Button
              title="Continue"
              onPress={handleContinue}
              loading={loading}
              iconName="arrow-forward"
              size="lg"
              style={styles.continueButton}
            />
          </View>

          {/* Naturally Blended Garden Home Illustration */}
          <View style={styles.illustrationContainer}>
            <Image
              source={require('../../../assets/images/home-garden.png')}
              style={styles.illustrationImage}
              resizeMode="contain"
            />
          </View>

          {/* Legal / Trust Footer */}
          <View style={styles.legalSection}>
            <Ionicons name="shield-checkmark-outline" size={18} color={Colors.primary} style={styles.shieldIcon} />
            <Text style={styles.legalText}>
              By continuing, you agree to our{' '}
              <Text style={styles.legalLink}>Terms of Service</Text> and{' '}
              <Text style={styles.legalLink}>Privacy Policy</Text>.
            </Text>
          </View>

          {/* Gated Developer-Only Demo Control */}
          {__DEV__ && (
            <View style={styles.devSection}>
              <TouchableOpacity
                onPress={handleQuickDemoBypass}
                style={styles.devDemoPill}
                activeOpacity={0.7}
              >
                <Text style={styles.devDemoText}>⚡ Dev Quick Bypass</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Country Code Selection Modal */}
      <Modal
        visible={showCountryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCountryModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCountryModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Country Code</Text>
            <FlatList
              data={SUPPORTED_COUNTRIES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.countryRow,
                    item.code === selectedCountry.code ? styles.countryRowSelected : undefined,
                  ]}
                  onPress={() => {
                    setSelectedCountry(item);
                    setShowCountryModal(false);
                  }}
                >
                  <Text style={styles.countryFlag}>{item.flag}</Text>
                  <Text style={styles.countryName}>{item.country}</Text>
                  <Text style={styles.countryCodeVal}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  formSection: {
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    marginBottom: Spacing.sm,
  },
  prefixWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.xs,
    paddingRight: Spacing.xs,
  },
  countryCodeText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  chevronIcon: {
    marginLeft: 3,
    marginRight: Spacing.xs,
  },
  prefixDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.line,
    marginLeft: 4,
  },
  continueButton: {
    width: '100%',
    height: 52,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.md,
  },
  illustrationImage: {
    width: '100%',
    height: 180,
    maxWidth: 340,
  },
  legalSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
    gap: 6,
    marginBottom: Spacing.xs,
  },
  shieldIcon: {
    marginRight: 2,
  },
  legalText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.xs,
    lineHeight: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    flexShrink: 1,
  },
  legalLink: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
    textDecorationLine: 'underline',
  },
  devSection: {
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  devDemoPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: Colors.sage,
  },
  devDemoText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    maxHeight: 360,
  },
  modalTitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  countryRowSelected: {
    backgroundColor: Colors.sageLight,
  },
  countryFlag: {
    fontSize: 22,
    marginRight: Spacing.sm,
  },
  countryName: {
    flex: 1,
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
  },
  countryCodeVal: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.primary,
  },
});
