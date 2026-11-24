import { useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View, type DimensionValue } from 'react-native';

import { Radii, Spacing } from '@/constants/theme';
import type { Plant } from '../types/plant';
import { colors } from '../theme/colors';

export type PlantTileProps = {
  plant: Plant;
  onPress?: () => void;
  width?: DimensionValue;
};

export function PlantTile({ plant, onPress, width = '100%' }: PlantTileProps) {
  const [focused, setFocused] = useState(false);
  const location = plant.location?.trim();
  const status = plant.bloomStatus?.trim();
  const hasDistance = Number.isFinite(plant.distanceKm) && plant.distanceKm >= 0;
  const distance = hasDistance ? plant.distanceKm.toFixed(1) : undefined;
  const locationLine = [location, distance && `${distance} km`].filter(Boolean).join(' · ');
  const cardStyle = [styles.card, { width }];
  const content = (
    <>
      <Image
        source={plant.photo}
        style={styles.image}
        resizeMode="cover"
        accessible={false}
        aria-hidden
        accessibilityIgnoresInvertColors
      />
      <View style={styles.content}>
        <Text style={styles.name}>{plant.name}</Text>
        {locationLine ? <Text style={styles.location}>{locationLine}</Text> : null}
        {status ? (
          <View style={styles.badge}>
            <Text style={styles.status}>{status}</Text>
          </View>
        ) : null}
      </View>
    </>
  );

  if (!onPress) return <View style={cardStyle}>{content}</View>;

  const accessibilityLabel = [
    `View details for ${plant.name}`,
    location,
    distance && `${distance} kilometres`,
    status,
  ].filter(Boolean).join(', ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onFocus={Platform.OS === 'web' ? () => setFocused(true) : undefined}
      onBlur={Platform.OS === 'web' ? () => setFocused(false) : undefined}
      style={({ pressed }) => [cardStyle, pressed && styles.pressed, focused && styles.focused]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    maxWidth: '100%',
    minWidth: 0,
    minHeight: 183,
    backgroundColor: colors.white,
    borderRadius: Radii[20],
    borderWidth: 1.5,
    borderColor: colors.leafGreen,
  },
  image: {
    width: '100%',
    height: 98,
    borderRadius: Radii[20],
  },
  content: {
    paddingHorizontal: Spacing.twelve,
    paddingVertical: Spacing.two,
    gap: Spacing.one,
  },
  name: { color: colors.deepPlum, fontFamily: 'NotoSans_700Bold', fontSize: 18, lineHeight: 21.6 },
  location: { color: colors.leafGreen, fontFamily: 'NotoSans_400Regular', fontSize: 16, lineHeight: 19.2 },
  badge: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    backgroundColor: colors.palePurple,
    borderRadius: Radii[8],
    paddingHorizontal: Spacing.one + Spacing.half,
    paddingVertical: Spacing.half,
  },
  status: { color: colors.purple, fontFamily: 'NotoSans_700Bold', fontSize: 14, lineHeight: 16.8 },
  pressed: { opacity: 0.84 },
  focused: {
    outlineColor: colors.deepPlum,
    outlineOffset: 2,
    outlineStyle: 'solid',
    outlineWidth: 2,
  },
});
