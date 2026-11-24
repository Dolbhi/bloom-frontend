import { StyleSheet, Text, View } from 'react-native';

import { ControlSize, Radii, Spacing } from '@/constants/theme';
import { colors } from '@/theme/colors';

export type BloomIndicatorProps = {
  status: 'bloom' | 'pollenLow' | 'pollenHigh';
  label?: string;
};

const treatments: Record<
  BloomIndicatorProps['status'],
  { label: string; background: string; disc: string; text: string; border?: string }
> = {
  bloom: {
    label: 'Blooming now',
    background: colors.white,
    border: colors.border,
    disc: colors.purple,
    text: colors.deepPlum,
  },
  pollenLow: {
    label: 'Low pollen',
    background: colors.paleGreen,
    disc: colors.leafGreen,
    text: colors.leafGreen,
  },
  pollenHigh: {
    label: 'High pollen',
    background: colors.palePurple,
    disc: colors.purple,
    text: colors.purple,
  },
};

export function BloomIndicator({ status, label }: BloomIndicatorProps) {
  const treatment = treatments[status];

  return (
    <View style={[styles.indicator, { backgroundColor: treatment.background }]}>
      {treatment.border && (
        <View aria-hidden pointerEvents="none" style={[styles.border, { borderColor: treatment.border }]} />
      )}
      <View
        aria-hidden
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[styles.disc, { backgroundColor: treatment.disc }]}
      />
      <Text style={[styles.label, { color: treatment.text }]}>{label ?? treatment.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  indicator: {
    width: 210,
    maxWidth: '100%',
    minHeight: ControlSize.minimumTouch,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingStart: Spacing.twelve,
    paddingEnd: Spacing.three,
    paddingVertical: Spacing.twelve,
    gap: Spacing.two,
    borderRadius: Radii[24],
  },
  border: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1,
    borderRadius: Radii[24],
  },
  disc: {
    width: Spacing.four,
    height: Spacing.four,
    borderRadius: Radii[12],
    flexShrink: 0,
  },
  label: {
    flex: 1,
    minWidth: 0,
    fontFamily: 'NotoSans_700Bold',
    fontSize: 16,
    lineHeight: 19.2,
    letterSpacing: 0,
    includeFontPadding: false,
  },
});
