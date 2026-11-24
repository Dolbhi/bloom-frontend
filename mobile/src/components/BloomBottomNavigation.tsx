import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { PlatformPressable, useLinkBuilder } from 'expo-router/react-navigation';
import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { Radii, Spacing } from '@/constants/theme';
import { colors } from '@/theme/colors';

export function BloomBottomNavigation({
  state,
  descriptors,
  emitter,
  navigateToTab,
  insets,
}: BottomTabBarProps) {
  const { buildHref } = useLinkBuilder();
  const [focusedKey, setFocusedKey] = useState<string | null>(null);

  return (
    <View
      style={[
        styles.bar,
        { paddingLeft: insets.left, paddingRight: insets.right, paddingBottom: insets.bottom },
      ]}
    >
      <View accessibilityRole="tablist" style={styles.items}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const selected = state.index === index;
          const isSubmit = route.name === 'submit';
          const label = options.title ?? route.name;
          const foreground = selected ? colors.purple : colors.leafGreen;

          return (
            <PlatformPressable
              key={route.key}
              href={buildHref(route.name, route.params)}
              role={Platform.OS === 'ios' ? 'button' : 'tab'}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              accessibilityState={{ selected }}
              testID={options.tabBarButtonTestID}
              onPress={() => {
                const event = emitter.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!selected && !event.defaultPrevented) {
                  navigateToTab(route.key);
                }
              }}
              onLongPress={() => emitter.emit({ type: 'tabLongPress', target: route.key })}
              onFocus={Platform.OS === 'web' ? () => setFocusedKey(route.key) : undefined}
              onBlur={Platform.OS === 'web' ? () => setFocusedKey(null) : undefined}
              pressOpacity={0.84}
              style={[styles.item, focusedKey === route.key && styles.focused]}
            >
              <View
                aria-hidden
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                style={styles.iconSlot}
              >
                <View style={[styles.disc, isSubmit && styles.submitDisc]}>
                  {options.tabBarIcon?.({
                    focused: selected,
                    color: isSubmit ? colors.white : foreground,
                    size: isSubmit ? 24 : 16,
                  })}
                </View>
              </View>
              <Text style={[styles.label, { color: foreground }]}>{label}</Text>
            </PlatformPressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.petalWhite,
    borderColor: colors.leafGreen,
    borderWidth: 1.5,
  },
  items: {
    minHeight: 72,
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.half,
    paddingHorizontal: Spacing.half,
    paddingVertical: Spacing.two,
  },
  iconSlot: {
    height: 30,
    justifyContent: 'center',
  },
  disc: {
    width: Spacing.four,
    height: Spacing.four,
    borderRadius: Radii[12],
    backgroundColor: colors.paleGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitDisc: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.purple,
  },
  label: {
    maxWidth: '100%',
    textAlign: 'center',
    fontFamily: 'NotoSans_400Regular',
    fontSize: 14,
    lineHeight: 16.8,
    includeFontPadding: false,
  },
  focused: {
    outlineColor: colors.deepPlum,
    outlineOffset: -2,
    outlineStyle: 'solid',
    outlineWidth: 2,
  },
});
