import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing, Shadows, TouchTargets } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export const QuickActionGrid: React.FC = () => {
  const actions = [
    {
      id: 'doctor-visit',
      title: 'Doctor Visit',
      subtitle: '$85 / visit',
      icon: 'medkit' as const,
      color: Colors.forest,
      bgColor: '#e8f5f1',
    },
    {
      id: 'nursing-care',
      title: 'Home Nurse',
      subtitle: '$45 / 12h',
      icon: 'heart' as const,
      color: Colors.teal,
      bgColor: Colors.tealLight,
    },
    {
      id: 'caretakers',
      title: 'Caretaker',
      subtitle: '$35 / 12h',
      icon: 'people' as const,
      color: '#7c3aed',
      bgColor: '#f5f3ff',
    },
    {
      id: 'lab-tests',
      title: 'Lab Blood Draw',
      subtitle: '$65 / panel',
      icon: 'flask' as const,
      color: '#0284c7',
      bgColor: '#f0f9ff',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Quick Doorstep Dispatch</Text>
      <View style={styles.grid}>
        {actions.map((act) => (
          <TouchableOpacity
            key={act.id}
            activeOpacity={0.82}
            onPress={() => router.push(`/services/${act.id}` as any)}
            style={styles.actionItem}
          >
            <View style={[styles.iconCircle, { backgroundColor: act.bgColor }]}>
              <Ionicons name={act.icon} size={22} color={act.color} />
            </View>
            <Text style={styles.actionTitle} numberOfLines={1}>
              {act.title}
            </Text>
            <Text style={styles.actionSubtitle} numberOfLines={1}>
              {act.subtitle}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.md,
    color: Colors.ink,
    marginBottom: Spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  actionItem: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.line,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    alignItems: 'center',
    ...Shadows.subtle,
  },
  iconCircle: {
    width: TouchTargets.minWidth,
    height: TouchTargets.minHeight,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  actionTitle: {
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: Typography.fontSize.xs,
    color: Colors.ink,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 10,
    color: Colors.muted,
    marginTop: 2,
    textAlign: 'center',
  },
});
