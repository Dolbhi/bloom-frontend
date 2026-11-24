import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRef, type ComponentRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ControlSize, Radii, Spacing } from '@/constants/theme';
import { colors } from '@/theme/colors';

export type BloomSearchFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  accessibilityLabel: string;
  onClear?: () => void;
  onSubmit?: () => void;
  disabled?: boolean;
};

export function BloomSearchField({
  value,
  onChangeText,
  placeholder = 'Plant, park or street',
  accessibilityLabel,
  onClear,
  onSubmit,
  disabled = false,
}: BloomSearchFieldProps) {
  const input = useRef<ComponentRef<typeof TextInput>>(null);
  const showClear = !disabled && value.length > 0;

  function clearSearch() {
    input.current?.focus();
    onChangeText('');
    onClear?.();
  }

  return (
    <View style={styles.field}>
      <View
        aria-hidden
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.icon}
      >
        <MaterialCommunityIcons name="magnify" size={16} color={colors.purple} />
      </View>
      <TextInput
        ref={input}
        value={value}
        onChangeText={disabled ? undefined : onChangeText}
        editable={!disabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        placeholder={placeholder}
        placeholderTextColor={colors.deepPlum}
        returnKeyType="search"
        multiline={false}
        onSubmitEditing={disabled ? undefined : onSubmit}
        style={styles.input}
      />
      {showClear && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Clear ${accessibilityLabel}`}
          onPress={clearSearch}
          style={({ pressed }) => [styles.clear, pressed && styles.pressed]}
        >
          <Text style={styles.clearLabel}>Clear</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    minWidth: 0,
    minHeight: ControlSize.preferred,
    paddingStart: Spacing.three,
    paddingEnd: Spacing.two,
    borderWidth: 1.5,
    borderColor: colors.leafGreen,
    borderRadius: Radii[16],
    backgroundColor: colors.white,
  },
  icon: {
    width: Spacing.four,
    height: Spacing.four,
    borderRadius: Radii[12],
    backgroundColor: colors.palePurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: Spacing.twelve,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: Spacing.two,
    fontFamily: 'NotoSans_400Regular',
    fontSize: 17,
    color: colors.deepPlum,
  },
  clear: {
    minWidth: ControlSize.minimumTouch,
    minHeight: ControlSize.minimumTouch,
    maxWidth: '50%',
    paddingHorizontal: Spacing.one,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearLabel: {
    color: colors.purple,
    fontFamily: 'NotoSans_400Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  pressed: { opacity: 0.84 },
});
