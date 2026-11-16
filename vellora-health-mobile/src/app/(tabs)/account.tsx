import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { Typography, Shadows } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

const Palette = {
  primary: '#0F5B43',        // Primary forest green
  mint: '#EAF5EE',           // Soft mint accent
  bgWarm: '#FBFAF7',         // Warm ivory page background
  surface: '#FFFFFF',        // Card white
  textDark: '#1B2A24',       // Primary text
  textMuted: '#7A8B84',      // Secondary text
  border: '#DCE9E1',         // Clean border
  badgeDot: '#E53E3E',       // Red notification dot
  logoutRed: '#E11D48',      // Red for logout
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const patientName = user?.name || 'Emma Kapoor';
  const patientEmail = user?.email || 'emma.kapoor@example.com';

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your Velora Health account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 'bookings',
      icon: 'calendar-outline' as const,
      label: 'My Bookings',
      onPress: () => router.push('/(tabs)/bookings'),
    },
    {
      id: 'records',
      icon: 'folder-outline' as const,
      label: 'Health Records',
      onPress: () => router.push('/(tabs)/records' as any),
    },
    {
      id: 'prescriptions',
      icon: 'medical-outline' as const,
      label: 'Prescriptions',
      onPress: () => router.push('/(tabs)/records' as any),
    },
    {
      id: 'saved',
      icon: 'bookmark-outline' as const,
      label: 'Saved Services',
      onPress: () => router.push('/(tabs)/services'),
    },
    {
      id: 'payment',
      icon: 'card-outline' as const,
      label: 'Payment Methods',
      onPress: () => Alert.alert('Payment Methods', 'UPI, Net Banking, and Cards are verified and linked securely.'),
    },
    {
      id: 'notifications',
      icon: 'notifications-outline' as const,
      label: 'Notifications',
      onPress: () => Alert.alert('Notifications', 'Care visit updates and prescription alerts are enabled via Push and SMS.'),
    },
    {
      id: 'help',
      icon: 'help-circle-outline' as const,
      label: 'Help & Support',
      onPress: () => Alert.alert('24/7 Clinical Concierge', 'Connect with our team at support@velorahealth.com or call 1800-VELORA.'),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ============================================================ */}
        {/* 1. TOP BRAND HEADER                                          */}
        {/* ============================================================ */}
        <View style={styles.topBrandBar}>
          {/* Brand Logo */}
          <TouchableOpacity
            style={styles.brandContainer}
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)')}
          >
            <Image
              source={require('../../../assets/images/logo-dark.png')}
              style={styles.brandLogo}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.topActionButtons}>
            <TouchableOpacity
              style={styles.bellBtn}
              activeOpacity={0.75}
              onPress={() => router.push('/(tabs)/bookings')}
            >
              <Ionicons name="notifications-outline" size={20} color={Palette.textDark} />
              <View style={styles.bellBadgeDot} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.plusBtn}
              activeOpacity={0.75}
              onPress={() => router.push('/(tabs)/bookings')}
            >
              <Ionicons name="add" size={22} color={Palette.textDark} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 2. PROFILE HEADER ROW: AVATAR + DETAILS + EDIT PROFILE       */}
        {/* ============================================================ */}
        <View style={styles.profileHeaderCard}>
          <Image
            source={require('../../../assets/images/avatar-indian-1.jpg')}
            style={styles.profileAvatar}
            resizeMode="cover"
          />

          <View style={styles.profileInfoCol}>
            <Text style={styles.profileNameText}>{patientName}</Text>
            <Text style={styles.profileEmailText}>{patientEmail}</Text>

            <TouchableOpacity
              style={styles.editProfileBtn}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Edit Profile', 'Profile editing is available in your clinical account dashboard.')}
            >
              <Ionicons name="pencil-outline" size={13} color={Palette.primary} style={{ marginRight: 5 }} />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 3. QUICK STATS ROW: 3 Bookings | 5 Reports | 2 Health Plans  */}
        {/* ============================================================ */}
        <View style={styles.statsRow}>
          {/* Stat 1: Bookings */}
          <TouchableOpacity
            style={styles.statCard}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/bookings')}
          >
            <Ionicons name="calendar-outline" size={19} color={Palette.primary} style={{ marginBottom: 4 }} />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </TouchableOpacity>

          {/* Stat 2: Reports */}
          <TouchableOpacity
            style={styles.statCard}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/records' as any)}
          >
            <Ionicons name="document-text-outline" size={19} color={Palette.primary} style={{ marginBottom: 4 }} />
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Reports</Text>
          </TouchableOpacity>

          {/* Stat 3: Health Plans */}
          <TouchableOpacity
            style={styles.statCard}
            activeOpacity={0.85}
            onPress={() => Alert.alert('Health Plans', 'You are currently enrolled in 2 active care plans: Primary Care & Family Wellness.')}
          >
            <Ionicons name="heart-outline" size={19} color={Palette.primary} style={{ marginBottom: 4 }} />
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Health Plans</Text>
          </TouchableOpacity>
        </View>

        {/* ============================================================ */}
        {/* 4. SETTINGS & MENU LIST CARD                                 */}
        {/* ============================================================ */}
        <View style={styles.menuContainerCard}>
          {menuItems.map((item, idx) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity
                style={styles.menuRowItem}
                activeOpacity={0.7}
                onPress={item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons name={item.icon} size={19} color={Palette.textDark} style={styles.menuIcon} />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>

                <Ionicons name="chevron-forward" size={16} color="#A0AEC0" />
              </TouchableOpacity>

              {idx < menuItems.length - 1 && <View style={styles.menuDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* ============================================================ */}
        {/* 5. LOG OUT ACTION                                            */}
        {/* ============================================================ */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.75}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color={Palette.logoutRed} style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.bgWarm,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 14 : 8,
    paddingBottom: 110,
  },

  /* 1. Top Brand Header */
  topBrandBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    marginBottom: 16,
  },
  brandContainer: {
    justifyContent: 'center',
  },
  brandLogo: {
    width: 124,
    height: 34,
  },
  topActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Palette.surface,
    borderWidth: 1.2,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Shadows.subtle,
  },
  bellBadgeDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Palette.badgeDot,
  },
  plusBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Palette.mint,
    borderWidth: 1.2,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },

  /* 2. Profile Header */
  profileHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  profileAvatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1.5,
    borderColor: Palette.border,
  },
  profileInfoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  profileNameText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 18,
    fontWeight: '700',
    color: Palette.textDark,
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  profileEmailText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 12.5,
    fontWeight: '400',
    color: Palette.textMuted,
    marginBottom: 8,
  },
  editProfileBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: Palette.border,
    ...Shadows.subtle,
  },
  editProfileText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11.5,
    fontWeight: '600',
    color: Palette.textDark,
  },

  /* 3. Quick Stats Row */
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Palette.surface,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: Palette.border,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  statNumber: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textDark,
    marginBottom: 1,
  },
  statLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '500',
    color: Palette.textMuted,
  },

  /* 4. Menu Card */
  menuContainerCard: {
    backgroundColor: Palette.surface,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: Palette.border,
    paddingVertical: 4,
    paddingHorizontal: 16,
    marginBottom: 16,
    ...Shadows.subtle,
  },
  menuRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 14,
    width: 20,
  },
  menuLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13.5,
    fontWeight: '500',
    color: Palette.textDark,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F0F4F1',
    marginLeft: 34,
  },

  /* 5. Logout Button */
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  logoutText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 13.5,
    fontWeight: '600',
    color: Palette.logoutRed,
  },
});
