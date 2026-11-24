import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, type DimensionValue } from 'react-native';

import { ControlSize, Radii, Spacing } from '@/constants/theme';
import { colors } from '@/theme/colors';

export type BloomButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  accessibilityLabel?: string;
  width?: DimensionValue;
};

export function BloomButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  accessibilityLabel = label,
  width = 240,
}: BloomButtonProps) {
  const [focused, setFocused] = useState(false);
  const secondary = variant === 'secondary';
  const backgroundColor = disabled ? colors.border : secondary ? colors.white : colors.purple;
  const textColor = disabled ? colors.deepPlum : secondary ? colors.purple : colors.white;
  const borderColor = disabled ? colors.disabledBorder : colors.purple;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      onFocus={Platform.OS === 'web' ? () => setFocused(true) : undefined}
      onBlur={Platform.OS === 'web' ? () => setFocused(false) : undefined}
      style={({ pressed }) => [
        styles.button,
        { width, backgroundColor },
        secondary && { borderWidth: 2, borderColor },
        !disabled && pressed && styles.pressed,
        !disabled && focused && styles.focused,
      ]}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: ControlSize.preferred,
    maxWidth: '100%',
    flexShrink: 1,
    borderRadius: Radii[16],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twelve,
  },
  pressed: {
    opacity: 0.84,
  },
  focused: {
    outlineColor: colors.deepPlum,
    outlineOffset: 2,
    outlineStyle: 'solid',
    outlineWidth: 2,
  },
  label: {
    fontFamily: 'NotoSans_700Bold',
    fontSize: 17,
    lineHeight: 20.4,
    letterSpacing: 0,
    includeFontPadding: false,
    textAlign: 'center',
  },
});
