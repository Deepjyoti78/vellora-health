import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { Colors, Typography, BorderRadius, Spacing, TouchTargets } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  prefixComponent?: React.ReactNode;
  containerStyle?: ViewStyle;
  rightAction?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  iconName,
  prefixComponent,
  containerStyle,
  rightAction,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {Boolean(label) ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputContainer,
          isFocused ? styles.inputFocused : undefined,
          Boolean(error) ? styles.inputError : undefined,
        ]}
      >
        {prefixComponent}
        {Boolean(iconName) ? (
          <Ionicons
            name={iconName!}
            size={18}
            color={Boolean(error) ? Colors.rose : isFocused ? Colors.primary : Colors.textSecondary}
            style={styles.leftIcon}
          />
        ) : null}
        <TextInput
          placeholderTextColor={Colors.textMuted}
          style={styles.textInput}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {rightAction || null}
      </View>
      {Boolean(error) ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
  },
  label: {
    fontFamily: Typography.fontFamily.medium,
    fontWeight: Typography.fontWeight.medium,
    fontSize: Typography.fontSize.sm,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    height: 52, // High-fidelity touch target matching reference
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  inputFocused: {
    borderColor: Colors.borderFocused,
    backgroundColor: Colors.surface,
  },
  inputError: {
    borderColor: Colors.rose,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
  },
  errorText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.rose,
    marginTop: 4,
  },
});
