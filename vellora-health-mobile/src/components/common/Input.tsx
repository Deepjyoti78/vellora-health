import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Colors, Typography, BorderRadius, Spacing, TouchTargets } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  containerStyle?: ViewStyle;
  rightAction?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  iconName,
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
        {Boolean(iconName) ? (
          <Ionicons
            name={iconName!}
            size={18}
            color={Boolean(error) ? Colors.rose : isFocused ? Colors.forest : Colors.muted}
            style={styles.leftIcon}
          />
        ) : null}
        <TextInput
          placeholderTextColor={Colors.mutedLight}
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
    color: Colors.ink,
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    height: TouchTargets.minHeight, // 48px
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  inputFocused: {
    borderColor: Colors.forest,
    backgroundColor: Colors.white,
  },
  inputError: {
    borderColor: Colors.rose,
  },
  leftIcon: {
    marginRight: Spacing.xs,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.base,
    color: Colors.ink,
  },
  errorText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.rose,
    marginTop: 4,
  },
});
