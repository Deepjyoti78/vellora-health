import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export type BadgeVariant = 'emerald' | 'amber' | 'rose' | 'teal' | 'neutral' | 'dark';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  iconName?: keyof typeof Ionicons.glyphMap;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'emerald',
  iconName,
  size = 'md',
  style,
}) => {
  const getBadgeStyle = (): { container: ViewStyle; text: TextStyle; iconColor: string } => {
    switch (variant) {
      case 'amber':
        return {
          container: { backgroundColor: Colors.amberLight, borderColor: Colors.amberBorder },
          text: { color: Colors.amber },
          iconColor: Colors.amber,
        };
      case 'rose':
        return {
          container: { backgroundColor: Colors.roseLight, borderColor: Colors.roseBorder },
          text: { color: Colors.rose },
          iconColor: Colors.rose,
        };
      case 'teal':
        return {
          container: { backgroundColor: Colors.tealLight, borderColor: '#cce6e4' },
          text: { color: Colors.teal },
          iconColor: Colors.teal,
        };
      case 'dark':
        return {
          container: { backgroundColor: Colors.ink, borderColor: Colors.ink },
          text: { color: Colors.white },
          iconColor: Colors.white,
        };
      case 'neutral':
        return {
          container: { backgroundColor: Colors.surfaceSubtle, borderColor: Colors.line },
          text: { color: Colors.inkSoft },
          iconColor: Colors.inkSoft,
        };
      case 'emerald':
      default:
        return {
          container: { backgroundColor: Colors.emeraldLight, borderColor: Colors.emeraldBorder },
          text: { color: Colors.emerald },
          iconColor: Colors.emerald,
        };
    }
  };

  const currentTheme = getBadgeStyle();

  return (
    <View
      style={[
        styles.badge,
        size === 'sm' ? styles.badgeSm : styles.badgeMd,
        currentTheme.container,
        style,
      ]}
    >
      {Boolean(iconName) ? (
        <Ionicons
          name={iconName!}
          size={size === 'sm' ? 12 : 14}
          color={currentTheme.iconColor}
          style={styles.icon}
        />
      ) : null}
      <Text
        style={[
          styles.badgeText,
          size === 'sm' ? styles.badgeTextSm : styles.badgeTextMd,
          currentTheme.text,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingVertical: 2,
    paddingHorizontal: Spacing.xs,
  },
  badgeMd: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
  },
  icon: {
    marginRight: 4,
  },
  badgeText: {
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    letterSpacing: 0.3,
  },
  badgeTextSm: {
    fontSize: Typography.fontSize.xs,
  },
  badgeTextMd: {
    fontSize: Typography.fontSize.sm,
  },
});
