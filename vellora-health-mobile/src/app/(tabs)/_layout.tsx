import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
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
        tabBarInactiveTintColor: '#A3C6B9',
        tabBarStyle: {
          position: 'absolute',
          bottom: bottomMargin,
          left: 16,
          right: 16,
          height: 66,
          backgroundColor: '#0F5B43', // Exact forest green from Upcoming Appointment card
          borderRadius: 33,
          borderWidth: 1.2,
          borderColor: 'rgba(255, 255, 255, 0.18)',
          elevation: 16,
          zIndex: 999,
          shadowColor: '#08251C',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35,
          shadowRadius: 18,
          paddingTop: 5,
          paddingBottom: 6,
          paddingHorizontal: 10,
        },
        tabBarItemStyle: {
          height: 52,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: {
          fontFamily: Typography.fontFamily.sans,
          fontSize: 10.5,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      {/* 1. Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeIconPill]}>
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={21}
                color={focused ? '#FFFFFF' : '#A3C6B9'}
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
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeIconPill]}>
              <Ionicons
                name={focused ? 'calendar' : 'calendar-outline'}
                size={21}
                color={focused ? '#FFFFFF' : '#A3C6B9'}
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
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeIconPill]}>
              <Ionicons
                name={focused ? 'grid' : 'grid-outline'}
                size={21}
                color={focused ? '#FFFFFF' : '#A3C6B9'}
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
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeIconPill]}>
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={21}
                color={focused ? '#FFFFFF' : '#A3C6B9'}
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
    width: 44,
    height: 28,
    borderRadius: 14,
  },
  activeIconPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
