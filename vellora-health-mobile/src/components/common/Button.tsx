import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Colors, Typography, BorderRadius, Spacing, TouchTargets } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'sage';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  iconName,
  iconPosition = 'right',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryContainer;
      case 'sage':
        return styles.sageContainer;
      case 'ghost':
        return styles.ghostContainer;
      case 'danger':
        return styles.dangerContainer;
      case 'primary':
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'sage':
        return styles.sageText;
      case 'ghost':
        return styles.ghostText;
      case 'danger':
        return styles.dangerText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return styles.sizeSm;
      case 'lg':
        return styles.sizeLg;
      case 'md':
      default:
        return styles.sizeMd;
    }
  };

  const iconColor =
    variant === 'secondary'
      ? Colors.textPrimary
      : variant === 'ghost'
      ? Colors.primary
      : variant === 'sage'
      ? Colors.primaryDark
      : Colors.textInverse;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.baseContainer,
        getContainerStyle(),
        getSizeStyle(),
        disabled ? styles.disabledContainer : undefined,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {Boolean(iconName && iconPosition === 'left') ? (
            <Ionicons
              name={iconName!}
              size={size === 'sm' ? 16 : 18}
              color={iconColor}
              style={styles.leftIcon}
            />
          ) : null}
          <Text
            style={[
              styles.baseText,
              getTextStyle(),
              disabled ? styles.disabledText : undefined,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {Boolean(iconName && iconPosition === 'right') ? (
            <Ionicons
              name={iconName!}
              size={size === 'sm' ? 16 : 18}
              color={iconColor}
              style={styles.rightIcon}
            />
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryContainer: {
    backgroundColor: Colors.primary, // #075239
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  secondaryContainer: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sageContainer: {
    backgroundColor: Colors.sage,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  dangerContainer: {
    backgroundColor: Colors.rose,
  },
  disabledContainer: {
    backgroundColor: '#CBD5CD',
    borderColor: '#CBD5CD',
    shadowOpacity: 0,
    elevation: 0,
  },
  sizeSm: {
    height: 40,
    paddingHorizontal: Spacing.md,
  },
  sizeMd: {
    height: 52, // High-fidelity touch target matching reference
    paddingHorizontal: Spacing.xl,
  },
  sizeLg: {
    height: 56,
    paddingHorizontal: Spacing.xxl,
  },
  baseText: {
    fontFamily: Typography.fontFamily.medium,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
    fontSize: Typography.fontSize.base,
  },
  primaryText: {
    color: Colors.textInverse,
  },
  secondaryText: {
    color: Colors.textPrimary,
  },
  sageText: {
    color: Colors.primaryDark,
  },
  ghostText: {
    color: Colors.primary,
  },
  dangerText: {
    color: Colors.textInverse,
  },
  disabledText: {
    color: '#8A9993',
  },
  leftIcon: {
    marginRight: Spacing.xs,
  },
  rightIcon: {
    marginLeft: Spacing.xs,
  },
});
