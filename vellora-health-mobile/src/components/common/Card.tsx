import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors, BorderRadius, Shadows, Spacing } from '../../constants/theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'elevated' | 'flat' | 'dark';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'elevated',
}) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'dark':
        return styles.darkCard;
      case 'flat':
        return styles.flatCard;
      case 'elevated':
      default:
        return styles.elevatedCard;
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        style={[styles.baseCard, getVariantStyle(), style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.baseCard, getVariantStyle(), style]}>{children}</View>;
};

const styles = StyleSheet.create({
  baseCard: {
    borderRadius: BorderRadius.card, // 20px
    padding: Spacing.lg,
    overflow: 'hidden',
  },
  elevatedCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.line,
    ...Shadows.card,
  },
  flatCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.line,
  },
  darkCard: {
    backgroundColor: Colors.ink,
    borderWidth: 1,
    borderColor: '#1e292d',
    ...Shadows.card,
  },
});
