import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { Button } from '../../components/common/Button';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function WelcomeScreen() {
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(20)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const heroOpacity = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(contentSlide, {
        toValue: 0,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    // Tactile press & bounce animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.94,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push('/(auth)/login');
    });
  };

  const handleAlreadyHaveAccount = () => {
    router.push('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Top SafeArea and Primary Vellora Health Brand Header */}
      <SafeAreaView edges={['top']} style={styles.topHeaderArea}>
        <View style={styles.brandHeader}>
          <Image
            source={require('../../../assets/images/logo-dark.png')}
            style={styles.topLogo}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>

      {/* Full-Width Hero Photograph Section */}
      <Animated.View style={[styles.heroWrapper, { opacity: heroOpacity }]}>
        <Image
          source={require('../../../assets/images/nurse-elder-care.png')}
          style={styles.heroImage}
          resizeMode="cover"
        />
        {/* Organic Curved Wave Transition to Ivory Content */}
        <View style={styles.waveOverlay} />
      </Animated.View>

      {/* Bottom Content Area with Ivory Background */}
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.contentSafeArea}>
        <Animated.View
          style={[
            styles.contentCard,
            {
              opacity: contentFade,
              transform: [{ translateY: contentSlide }],
            },
          ]}
        >
          {/* Editorial Headline & Subtitle */}
          <View style={styles.textSection}>
            <Text style={styles.headline}>Care, closer to home.</Text>
            <Text style={styles.subtitle}>
              Trusted, professional healthcare services at your doorstep.
            </Text>
          </View>

          {/* 3-Dot Carousel Indicator */}
          <View style={styles.dotsRow}>
            <View style={styles.activePillDot} />
            <View style={styles.inactiveDot} />
            <View style={styles.inactiveDot} />
          </View>

          {/* Bottom Actions */}
          <View style={styles.actionsBlock}>
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <Button
                title="Get Started"
                onPress={handleGetStarted}
                iconName="arrow-forward"
                size="lg"
                style={styles.getStartedButton}
              />
            </Animated.View>

            <TouchableOpacity
              onPress={handleAlreadyHaveAccount}
              activeOpacity={0.7}
              style={styles.secondaryLinkTouch}
              hitSlop={{ top: 8, bottom: 8, left: 16, right: 16 }}
            >
              <Text style={styles.secondaryLinkText}>I already have an account</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topHeaderArea: {
    backgroundColor: Colors.background,
    zIndex: 10,
  },
  brandHeader: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  topLogo: {
    width: 140,
    height: 38,
  },
  heroWrapper: {
    width: '100%',
    height: Math.min(SCREEN_HEIGHT * 0.44, 380),
    position: 'relative',
    backgroundColor: '#E7ECE5',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  waveOverlay: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  contentSafeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentCard: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    justifyContent: 'space-between',
  },
  textSection: {
    marginTop: Spacing.xs,
  },
  headline: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.base,
    lineHeight: 22,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: Spacing.md,
  },
  activePillDot: {
    width: 24,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  inactiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DFE5DC',
  },
  actionsBlock: {
    width: '100%',
    gap: Spacing.xs,
  },
  getStartedButton: {
    width: '100%',
    height: 52,
  },
  secondaryLinkTouch: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  secondaryLinkText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
});
