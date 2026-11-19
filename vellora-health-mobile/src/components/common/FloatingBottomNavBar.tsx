import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Typography } from '../../constants/theme';

export type NavTabKey = 'home' | 'bookings' | 'services' | 'account';

export interface FloatingBottomNavBarProps {
  activeTab?: NavTabKey;
  onTabPress?: (tab: NavTabKey) => void;
}

interface NavItemConfig {
  key: NavTabKey;
  label: string;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
  route: string;
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    key: 'home',
    label: 'Home',
    activeIcon: 'home',
    inactiveIcon: 'home-outline',
    route: '/(tabs)',
  },
  {
    key: 'bookings',
    label: 'Booking',
    activeIcon: 'calendar',
    inactiveIcon: 'calendar-outline',
    route: '/(tabs)/bookings',
  },
  {
    key: 'services',
    label: 'Services',
    activeIcon: 'grid',
    inactiveIcon: 'grid-outline',
    route: '/(tabs)/services',
  },
  {
    key: 'account',
    label: 'Profile',
    activeIcon: 'person',
    inactiveIcon: 'person-outline',
    route: '/(tabs)/account',
  },
];

const AnimatedNavBarItem: React.FC<{
  item: NavItemConfig;
  isFocused: boolean;
  onPress: () => void;
}> = ({ item, isFocused, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(isFocused ? 1.05 : 1)).current;
  const pillOpacity = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isFocused ? 1.08 : 1,
        friction: 6,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.timing(pillOpacity, {
        toValue: isFocused ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: isFocused ? 1.08 : 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      style={styles.navBarItem}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={item.label}
    >
      <Animated.View
        style={[
          styles.navBarIconWrapper,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Animated.View
          style={[
            styles.navBarActiveIconPill,
            { opacity: pillOpacity },
          ]}
        />
        <Ionicons
          name={isFocused ? item.activeIcon : item.inactiveIcon}
          size={21}
          color={isFocused ? '#FFFFFF' : '#C2E5D9'}
        />
      </Animated.View>
      <Text
        style={[
          styles.navBarLabel,
          isFocused ? styles.navBarLabelActive : styles.navBarLabelInactive,
        ]}
        numberOfLines={1}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};

export const FloatingBottomNavBar: React.FC<FloatingBottomNavBarProps> = ({
  activeTab = 'services',
  onTabPress,
}) => {
  const handlePress = (item: NavItemConfig) => {
    if (onTabPress) {
      onTabPress(item.key);
    } else {
      router.replace(item.route as any);
    }
  };

  return (
    <View style={styles.floatingNavBar}>
      {NAV_ITEMS.map((item) => (
        <AnimatedNavBarItem
          key={item.key}
          item={item}
          isFocused={activeTab === item.key}
          onPress={() => handlePress(item)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  floatingNavBar: {
    position: 'absolute',
    bottom: Platform.select({ ios: 20, android: 16, default: 16 }),
    left: 18,
    right: 18,
    height: 56,
    backgroundColor: '#0F5B43',
    borderRadius: 28,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    elevation: 14,
    zIndex: 999,
    shadowColor: '#08251C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  navBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  navBarIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 26,
    marginBottom: 2,
    position: 'relative',
    paddingHorizontal: 12,
  },
  navBarActiveIconPill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 14,
  },
  navBarLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: 11,
    letterSpacing: -0.1,
    textAlign: 'center',
  },
  navBarLabelActive: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  navBarLabelInactive: {
    fontWeight: '500',
    color: '#C2E5D9',
  },
});

export default FloatingBottomNavBar;
