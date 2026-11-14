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
import { Colors, Typography, Spacing, BorderRadius, Shadows, TouchTargets } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AccountScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Patient Account" subtitle="Medical Profile & Settings" showBack={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: user?.avatarUrl }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userPhone}>{user?.phone}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.roleRow}>
                <Badge label="VERIFIED PATIENT" variant="emerald" size="sm" />
                <Badge label={`Blood: ${user?.bloodGroup || 'A+'}`} variant="teal" size="sm" />
              </View>
            </View>
          </View>
        </View>

        {/* Clinical Health Snapshot */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Medical Information</Text>

          <View style={styles.infoRow}>
            <Ionicons name="warning-outline" size={18} color={Colors.rose} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Documented Allergies</Text>
              <Text style={styles.infoVal}>{user?.allergies?.join(', ') || 'None'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="pulse-outline" size={18} color={Colors.teal} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Chronic Medical Conditions</Text>
              <Text style={styles.infoVal}>{user?.chronicConditions?.join(', ') || 'None'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={Colors.forest} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Primary Home Address</Text>
              <Text style={styles.infoVal}>{user?.address?.street}, {user?.address?.city} {user?.address?.postalCode}</Text>
              <Text style={styles.landmarkText}>{user?.address?.landmark}</Text>
            </View>
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Primary Emergency Contact</Text>
          <View style={styles.emergencyRow}>
            <View style={styles.emergencyLeft}>
              <Text style={styles.emergencyName}>{user?.emergencyContact?.name}</Text>
              <Text style={styles.emergencyRel}>{user?.emergencyContact?.relationship}</Text>
              <Text style={styles.emergencyPhone}>{user?.emergencyContact?.phone}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.8} style={styles.callCircle}>
              <Ionicons name="call" size={18} color={Colors.forest} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support & Logout Buttons */}
        <View style={styles.actionSection}>
          <Button
            title="Switch Persona / Sign Out"
            variant="secondary"
            onPress={handleLogout}
            iconName="log-out-outline"
            iconPosition="left"
            style={styles.logoutBtn}
          />

          <Text style={styles.versionText}>Vellora Health Mobile v1.0.0 • React Native & Expo</Text>
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
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
    backgroundColor: Colors.mist,
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.mist,
  },
  profileInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  userName: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.lg,
    color: Colors.ink,
  },
  userPhone: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.muted,
    marginTop: 1,
  },
  userEmail: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.muted,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.sm,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.xs,
    color: Colors.muted,
  },
  infoVal: {
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: Typography.fontSize.sm,
    color: Colors.ink,
    marginTop: 2,
  },
  landmarkText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.teal,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.line,
    marginVertical: Spacing.sm,
  },
  emergencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emergencyLeft: {
    flex: 1,
  },
  emergencyName: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.base,
    color: Colors.ink,
  },
  emergencyRel: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.teal,
    marginTop: 1,
  },
  emergencyPhone: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.xs,
    color: Colors.muted,
    marginTop: 2,
  },
  callCircle: {
    width: TouchTargets.minWidth,
    height: TouchTargets.minHeight,
    borderRadius: 24,
    backgroundColor: Colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionSection: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  logoutBtn: {
    width: '100%',
    borderColor: Colors.rose,
  },
  versionText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.mutedLight,
    marginTop: Spacing.md,
  },
});
