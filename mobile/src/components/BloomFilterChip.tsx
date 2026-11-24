import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';

import { ControlSize, Radii, Spacing } from '@/constants/theme';
import { colors } from '@/theme/colors';

export type BloomFilterChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  selectedTreatment?: 'tinted' | 'solid';
  disabled?: boolean;
  accessibilityLabel?: string;
  labelFontSize?: number;
};

const treatments = {
  unselected: { background: colors.white, border: colors.leafGreen, text: colors.deepPlum, borderWidth: 1, fontSize: 16 },
  tinted: { background: colors.palePurple, border: colors.purple, text: colors.purple, borderWidth: 2, fontSize: 15 },
  solid: { background: colors.purple, border: colors.purple, text: colors.white, borderWidth: 1.5, fontSize: 16 },
} as const;

export function BloomFilterChip({
  label,
  selected,
  onPress,
  selectedTreatment = 'tinted',
  disabled = false,
  accessibilityLabel = label,
  labelFontSize,
}: BloomFilterChipProps) {
  const [focused, setFocused] = useState(false);
  const treatment = treatments[selected ? selectedTreatment : 'unselected'];
  const fontSize = labelFontSize ?? treatment.fontSize;

  return (
    <Pressable
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected, disabled }}
      onFocus={Platform.OS === 'web' ? () => setFocused(true) : undefined}
      onBlur={Platform.OS === 'web' ? () => setFocused(false) : undefined}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: treatment.background,
          borderColor: treatment.border,
          borderWidth: treatment.borderWidth,
        },
        !disabled && pressed && styles.pressed,
        !disabled && focused && styles.focused,
      ]}
    >
      <Text style={[styles.label, { color: treatment.text, fontSize, lineHeight: fontSize * 1.2 }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    flexShrink: 1,
    minHeight: ControlSize.minimumTouch,
    borderRadius: Radii[24],
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.twelve,
    paddingVertical: Spacing.two,
  },
  label: {
    fontFamily: 'NotoSans_700Bold',
    letterSpacing: 0,
    textAlign: 'center',
    includeFontPadding: false,
  },
  pressed: { opacity: 0.84 },
  focused: {
    outlineColor: colors.deepPlum,
    outlineOffset: 2,
    outlineStyle: 'solid',
    outlineWidth: 2,
  },
});
