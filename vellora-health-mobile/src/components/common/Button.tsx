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

type ButtonVariant = 'primary' | 'secondary' | 'teal' | 'ghost' | 'danger';
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
      case 'teal':
        return styles.tealContainer;
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
      case 'ghost':
        return styles.ghostText;
      case 'danger':
        return styles.dangerText;
      case 'teal':
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

  const getTextSizeStyle = (): TextStyle => {
    switch (size) {
      case 'sm':
        return styles.textSizeSm;
      case 'lg':
        return styles.textSizeLg;
      case 'md':
      default:
        return styles.textSizeMd;
    }
  };

  const iconColor =
    variant === 'secondary'
      ? Colors.ink
      : variant === 'ghost'
      ? Colors.forest
      : Colors.white;

  return (
    <TouchableOpacity
      activeOpacity={0.82}
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
              getTextSizeStyle(),
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
    backgroundColor: Colors.forest,
    shadowColor: Colors.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  secondaryContainer: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.line,
  },
  tealContainer: {
    backgroundColor: Colors.teal,
    shadowColor: Colors.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  dangerContainer: {
    backgroundColor: Colors.rose,
  },
  disabledContainer: {
    backgroundColor: Colors.line,
    borderColor: Colors.line,
    shadowOpacity: 0,
    elevation: 0,
  },
  sizeSm: {
    height: 38,
    paddingHorizontal: Spacing.md,
  },
  sizeMd: {
    height: TouchTargets.minHeight, // 48px WCAG compliance
    paddingHorizontal: Spacing.xl,
  },
  sizeLg: {
    height: 54,
    paddingHorizontal: Spacing.xxl,
  },
  baseText: {
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.ink,
  },
  ghostText: {
    color: Colors.forest,
  },
  dangerText: {
    color: Colors.white,
  },
  disabledText: {
    color: Colors.muted,
  },
  textSizeSm: {
    fontSize: Typography.fontSize.sm,
  },
  textSizeMd: {
    fontSize: Typography.fontSize.base,
  },
  textSizeLg: {
    fontSize: Typography.fontSize.md,
  },
  leftIcon: {
    marginRight: Spacing.xs,
  },
  rightIcon: {
    marginLeft: Spacing.xs,
  },
});
