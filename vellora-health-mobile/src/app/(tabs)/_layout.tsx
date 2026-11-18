import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography } from '../../constants/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomMargin = Platform.select({
    ios: Math.max(insets.bottom, 16),
    android: Math.max(insets.bottom, 14),
    default: 16,
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#C2E5D9', // High contrast soft mint, crisp & never faded
        tabBarStyle: {
          position: 'absolute',
          bottom: bottomMargin,
          left: 18,
          right: 18,
          height: 56, // Sleek, compact navbar height - strictly maintained
          backgroundColor: '#0F5B43', // Dark forest green
          borderRadius: 28,
          borderWidth: 1.2,
          borderColor: 'rgba(255, 255, 255, 0.18)',
          elevation: 14,
          zIndex: 999,
          shadowColor: '#08251C',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.32,
          shadowRadius: 16,
          paddingTop: 3,
          paddingBottom: 3,
          paddingHorizontal: 8,
        },
        tabBarItemStyle: {
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 0,
        },
      }}
    >
      {/* 1. Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={[
                styles.tabLabel,
                { color },
                focused ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
            >
              Home
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeIconPill]}>
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={21}
                color={focused ? '#FFFFFF' : '#C2E5D9'}
              />
            </View>
          ),
        }}
      />

      {/* 2. Booking Tab */}
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Booking',
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={[
                styles.tabLabel,
                { color },
                focused ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
            >
              Booking
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeIconPill]}>
              <Ionicons
                name={focused ? 'calendar' : 'calendar-outline'}
                size={21}
                color={focused ? '#FFFFFF' : '#C2E5D9'}
              />
            </View>
          ),
        }}
      />

      {/* 3. Services Tab (Exact 4-grid squares icon) */}
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={[
                styles.tabLabel,
                { color },
                focused ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
            >
              Services
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeIconPill]}>
              <Ionicons
                name={focused ? 'grid' : 'grid-outline'}
                size={21}
                color={focused ? '#FFFFFF' : '#C2E5D9'}
              />
            </View>
          ),
        }}
      />

      {/* 4. Profile Tab */}
      <Tabs.Screen
        name="account"
        options={{
          title: 'Profile',
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={[
                styles.tabLabel,
                { color },
                focused ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
            >
              Profile
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeIconPill]}>
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={21}
                color={focused ? '#FFFFFF' : '#C2E5D9'}
              />
            </View>
          ),
        }}
      />

      {/* Records screen is kept accessible via direct routes without appearing in tab bar */}
      <Tabs.Screen
        name="records"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 24,
    borderRadius: 12,
  },
  activeIconPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  tabLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 10.5,
    marginTop: 2,
    marginBottom: 0,
    lineHeight: 14,
    letterSpacing: 0.15,
    textAlign: 'center',
    ...(Platform.OS === 'web'
      ? ({
          overflow: 'visible',
          textOverflow: 'clip',
          whiteSpace: 'nowrap',
        } as any)
      : {}),
  },
  tabLabelActive: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tabLabelInactive: {
    fontWeight: '500',
    color: '#C2E5D9',
  },
});
