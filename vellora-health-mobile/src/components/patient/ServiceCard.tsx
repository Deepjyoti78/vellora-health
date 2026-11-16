import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { CoreServiceItem } from '../../types';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '../../constants/theme';
import { Badge } from '../common/Badge';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../../data/mockData';

interface ServiceCardProps {
  service: CoreServiceItem;
  onPress: (service: CoreServiceItem) => void;
  style?: ViewStyle;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(service)}
      style={[styles.card, style]}
    >
      {/* Image Container with overlay badge */}
      <View style={styles.imageContainer}>
        <Image source={service.image} style={styles.image} resizeMode="cover" />
        <View style={styles.badgeOverlay}>
          <Badge
            label={`${service.number} • ${service.category}`}
            variant="dark"
            size="sm"
          />
        </View>
        <View style={styles.priceTag}>
          <Text style={styles.priceTagText}>From {formatCurrency(service.priceStartingAt)}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {service.title}
          </Text>
        </View>

        <Text style={styles.subtitle} numberOfLines={1}>
          {service.subtitle}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {service.description}
        </Text>

        {/* Feature Pills */}
        <View style={styles.featureList}>
          {service.features.slice(0, 2).map((feature, idx) => (
            <View key={idx} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.emerald} />
              <Text style={styles.featureText} numberOfLines={1}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer with Price and Action Button */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>Starting from</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceAmount}>{formatCurrency(service.priceStartingAt)}</Text>
              <Text style={styles.priceUnit}> / {service.priceUnit.replace('per ', '')}</Text>
            </View>
          </View>

          <View style={styles.actionPill}>
            <Text style={styles.actionText}>Book Visit</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.white} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card, // 20px
    borderWidth: 1,
    borderColor: Colors.line,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  imageContainer: {
    height: 160,
    width: '100%',
    position: 'relative',
    backgroundColor: Colors.mist,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
  },
  priceTag: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(17, 25, 27, 0.82)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  priceTagText: {
    color: Colors.white,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: Typography.fontSize.xs,
  },
  body: {
    padding: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.lg,
    color: Colors.ink,
    flex: 1,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.medium,
    fontWeight: Typography.fontWeight.medium,
    fontSize: Typography.fontSize.xs,
    color: Colors.teal,
    marginBottom: Spacing.xs,
  },
  description: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.sm,
    color: Colors.muted,
    marginBottom: Spacing.sm,
  },
  featureList: {
    marginBottom: Spacing.md,
    gap: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.inkSoft,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
  },
  priceLabel: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.muted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceAmount: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.xl,
    color: Colors.forest,
  },
  priceUnit: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.muted,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.forest,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
    gap: 6,
  },
  actionText: {
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: Typography.fontSize.xs,
    color: Colors.white,
  },
});
