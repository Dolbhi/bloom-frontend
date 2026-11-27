import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { ControlSize, Radii, Spacing } from '@/constants/theme';
import { colors } from '@/theme/colors';

export type BloomSettingsRowProps = {
  label: string;
  description?: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  onPress?: () => void;
  right?: ReactNode;
  accessibilityLabel?: string;
  destructive?: boolean;
};

export function BloomSettingsRow({
  label,
  description,
  icon,
  onPress,
  right,
  accessibilityLabel,
  destructive = false,
}: BloomSettingsRowProps) {
  const [focused, setFocused] = useState(false);
  const content = (
    <>
      <View
        aria-hidden
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[styles.icon, destructive && styles.destructiveIcon]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={destructive ? colors.pollenText : colors.purple}
        />
      </View>
      <View style={styles.text}>
        <Text style={[styles.label, destructive && styles.destructiveLabel]}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {right ?? (onPress ? <MaterialCommunityIcons name="chevron-right" size={24} color={colors.purple} /> : null)}
    </>
  );

  if (!onPress) {
    return <View style={styles.row}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? [label, description].filter(Boolean).join(', ')}
      onPress={onPress}
      onFocus={Platform.OS === 'web' ? () => setFocused(true) : undefined}
      onBlur={Platform.OS === 'web' ? () => setFocused(false) : undefined}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, focused && styles.focused]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: ControlSize.preferred,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twelve,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twelve,
  },
  icon: {
    width: 40,
    height: 40,
    flexShrink: 0,
    borderRadius: Radii[20],
    backgroundColor: colors.palePurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destructiveIcon: { backgroundColor: colors.pollenBackground },
  text: { flex: 1, minWidth: 0, gap: Spacing.half },
  label: {
    color: colors.deepPlum,
    fontFamily: 'NotoSans_700Bold',
    fontSize: 16,
    lineHeight: 21,
  },
  destructiveLabel: { color: colors.pollenText },
  description: {
    color: colors.leafGreen,
    fontFamily: 'NotoSans_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  pressed: { opacity: 0.84, backgroundColor: colors.petalWhite },
  focused: {
    outlineColor: colors.deepPlum,
    outlineOffset: -2,
    outlineStyle: 'solid',
    outlineWidth: 2,
  },
});
