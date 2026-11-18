import React from 'react';
import { Tabs } from 'expo-router';
import { FloatingBottomNavBar, NavTabKey } from '../../components/common/FloatingBottomNavBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => {
        const currentRoute = props.state.routes[props.state.index]?.name;
        const activeTab: NavTabKey =
          currentRoute === 'bookings'
            ? 'bookings'
            : currentRoute === 'services'
            ? 'services'
            : currentRoute === 'account'
            ? 'account'
            : 'home';

        const handleTabPress = (tab: NavTabKey) => {
          const routeName = tab === 'home' ? 'index' : tab;
          const targetRoute = props.state.routes.find((r) => r.name === routeName);
          if (targetRoute) {
            props.navigateToTab(targetRoute.key);
          }
        };

        return <FloatingBottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />;
      }}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* 1. Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />

      {/* 2. Booking Tab */}
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Booking',
        }}
      />

      {/* 3. Services Tab */}
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
        }}
      />

      {/* 4. Profile Tab */}
      <Tabs.Screen
        name="account"
        options={{
          title: 'Profile',
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
