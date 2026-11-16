import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing } from '../../constants/theme';

interface AuthHeaderProps {
  onBack?: () => void;
  showBack?: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  onBack,
  showBack = true,
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/welcome');
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.centerContainer}>
        <Image
          source={require('../../../assets/images/logo-dark.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.rightContainer} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: Spacing.xs,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 130,
    height: 36,
  },
  rightContainer: {
    width: 40,
  },
});
