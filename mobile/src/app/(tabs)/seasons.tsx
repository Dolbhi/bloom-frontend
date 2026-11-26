import { useCallback, useEffect, useRef, useState, type ComponentRef, type ReactNode } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';
import { BloomButton } from '../../components/BloomButton';
import { BloomFilterChip } from '../../components/BloomFilterChip';
import { BloomLogo } from '../../components/BloomLogo';
import { BloomPollenWarning } from '../../components/BloomPollenWarning';
import { BloomScreen } from '../../components/BloomScreen';
import { ControlSize, Radii, Spacing } from '../../constants/theme';
import { colors } from '../../theme/colors';
import { displayTypography } from '../../theme/typography';
import { usePlantList } from '../../hooks/usePlantList';
import { calendarMonths, monthNames } from '../../utils/calendar';

const seasons = [
  { name: 'Summer', months: [12, 1, 2] },
  { name: 'Autumn', months: [3, 4, 5] },
  { name: 'Winter', months: [6, 7, 8] },
  { name: 'Spring', months: [9, 10, 11] },
] as const;

type CalendarSelection = { month: number } | { season: typeof seasons[number] };

function SelectorRow({ label, selectedKey, children }: {
  label: string;
  selectedKey?: string;
  children: { key: string; chip: ReactNode }[];
}) {
  const scrollView = useRef<ComponentRef<typeof ScrollView>>(null);
  const offset = useRef(0);
  const itemBounds = useRef(new Map<string, { x: number; width: number }>());
  const [viewportWidth, setViewportWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [focusedControl, setFocusedControl] = useState<'previous' | 'next'>();
  const maxScroll = Math.max(0, contentWidth - viewportWidth);
  const hasOverflow = viewportWidth > 0 && maxScroll > 1;
  const hasPrevious = hasOverflow && scrollX > 1;
  const hasNext = hasOverflow && scrollX < maxScroll - 1;

  const revealSelection = useCallback(() => {
    const bounds = selectedKey === undefined ? undefined : itemBounds.current.get(selectedKey);
    if (!bounds || !viewportWidth || !contentWidth) return;
    const start = bounds.x - Spacing.one;
    const end = bounds.x + bounds.width + Spacing.one;
    const current = offset.current;
    const target = start < current ? start : end > current + viewportWidth ? end - viewportWidth : current;
    if (Math.abs(target - current) > 1) {
      scrollView.current?.scrollTo({ x: Math.min(maxScroll, Math.max(0, target)), animated: false });
    }
  }, [selectedKey, viewportWidth, contentWidth, maxScroll]);

  useEffect(() => {
    revealSelection();
  }, [revealSelection]);

  return (
    <View>
      <View style={styles.selectorHeader}>
        <Text style={styles.controlLabel}>{label}</Text>
        {hasOverflow && (
          <View style={styles.scrollControls}>
            {(['previous', 'next'] as const).map((direction) => {
              const previous = direction === 'previous';
              const disabled = previous ? !hasPrevious : !hasNext;
              return (
                <Pressable
                  key={direction}
                  accessibilityRole="button"
                  accessibilityLabel={`Scroll ${direction} ${label.toLowerCase().replace('explore by ', '')} options`}
                  accessibilityState={{ disabled }}
                  disabled={disabled}
                  onPress={() => {
                    const target = offset.current + (previous ? -1 : 1) * viewportWidth * 0.8;
                    scrollView.current?.scrollTo({ x: Math.min(maxScroll, Math.max(0, target)), animated: true });
                  }}
                  onFocus={() => setFocusedControl(direction)}
                  onBlur={() => setFocusedControl(undefined)}
                  style={[styles.scrollControl, focusedControl === direction && styles.focusedControl]}
                >
                  <Text style={[styles.scrollArrow, disabled && styles.disabledArrow]} aria-hidden>
                    {previous ? '‹' : '›'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
      <View style={styles.selectorViewport}>
        <ScrollView
          ref={scrollView}
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={styles.chips}
          onLayout={(event) => setViewportWidth(event.nativeEvent.layout.width)}
          onContentSizeChange={setContentWidth}
          onScroll={(event) => {
            offset.current = event.nativeEvent.contentOffset.x;
            setScrollX(offset.current);
          }}
        >
          {children.map(({ key, chip }) => (
            <View
              key={key}
              style={styles.selectorItem}
              onLayout={(event) => {
                const { x, width } = event.nativeEvent.layout;
                itemBounds.current.set(key, { x, width });
                if (key === selectedKey) revealSelection();
              }}
            >
              {chip}
            </View>
          ))}
        </ScrollView>
        {hasPrevious && <View pointerEvents="none" aria-hidden style={[styles.edgeFade, styles.leftFade]} />}
        {hasNext && <View pointerEvents="none" aria-hidden style={[styles.edgeFade, styles.rightFade]} />}
      </View>
    </View>
  );
}

export default function SeasonsScreen() {
  const [selection, setSelection] = useState<CalendarSelection>({ month: 11 });
  const { status, plants, retry } = usePlantList();

  const selectedMonth = 'month' in selection ? selection.month : undefined;
  const selectedSeason = 'season' in selection ? selection.season : undefined;
  const selectedMonths: readonly number[] = 'month' in selection
    ? [selection.month]
    : selection.season.months;
  const period = 'month' in selection ? monthNames[selection.month - 1] : selection.season.name;
  const results = plants?.filter((plant) =>
    plant.bloomMonths.some((month) => selectedMonths.includes(month)),
  );
  const count = results?.length ?? 0;

  return (
    <BloomScreen
      botanical
      contentContainerStyle={styles.content}
      header={
        <View style={styles.header}>
          <View style={styles.logo}><BloomLogo /></View>
          <Text style={styles.location}>MELBOURNE · SAMPLE CALENDAR</Text>
          <Text accessibilityRole="header" style={displayTypography.screenHeading}>Seasons</Text>
          <Text style={styles.body}>
            Choose a season or month to explore example flowering windows for Melbourne.
          </Text>
        </View>
      }
    >
      <View style={styles.sections}>
        <View style={styles.section}>
          <SelectorRow label="Explore by season" selectedKey={selectedSeason?.name}>
            {seasons.map((season) => ({ key: season.name, chip: (
              <BloomFilterChip
                label={selectedSeason === season ? `✓ ${season.name}` : season.name}
                accessibilityLabel={season.name}
                selected={selectedSeason === season}
                selectedTreatment="solid"
                onPress={() => setSelection({ season })}
              />
            ) }))}
          </SelectorRow>
          <SelectorRow label="Explore by month" selectedKey={selectedMonth === undefined ? undefined : period}>
            {calendarMonths.map(({ name, number, abbreviation }) => ({ key: name, chip: (
              <BloomFilterChip
                label={(selectedMonth === number ? '✓ ' : '') + abbreviation}
                accessibilityLabel={name}
                selected={selectedMonth === number}
                selectedTreatment="solid"
                onPress={() => setSelection({ month: number })}
              />
            ) }))}
          </SelectorRow>
        </View>

        <View style={styles.card}>
          <View style={styles.outlook}>
            <Text style={styles.outlookLabel}>{period} outlook</Text>
            <Text accessibilityRole="header" accessibilityLiveRegion="polite" style={displayTypography.sectionHeading}>
              {status === 'loading' ? 'Loading sample plants…'
                : status === 'error' ? 'Couldn’t load sample plants.'
                : status === 'empty' ? 'No sample plants are available.'
                : `${count} matching sample ${count === 1 ? 'plant' : 'plants'}`}
            </Text>
          </View>
          {status === 'error' && (
            <View style={styles.empty}>
              <BloomButton label="Retry" accessibilityLabel="Retry loading sample plants" onPress={retry} />
            </View>
          )}
          {results && (count === 0 ? (
            <Text style={styles.empty}>No sample flowering windows overlap this selection.</Text>
          ) : results.map((plant) => (
            <Pressable
              key={plant.id}
              style={({ pressed }) => [styles.plantRow, pressed && styles.pressed]}
              onPress={() => router.push({ pathname: '/plants/[id]', params: { id: plant.id } })}
              accessibilityRole="button"
              accessibilityHint="Opens plant details"
            >
              <Image source={plant.photo} style={styles.photo} resizeMode="cover" accessible={false} aria-hidden />
              <View style={styles.plantInfo}>
                <Text style={styles.plantName}>{plant.name}</Text>
                <Text style={styles.body}>{plant.location}</Text>
                <Text style={styles.meta}>{plant.bloomWindow} · {plant.distanceKm.toFixed(1)} km sample distance</Text>
                <Text style={styles.meta}>Sample status · {plant.bloomStatus}</Text>
              </View>
              <Text style={styles.chevron} aria-hidden>›</Text>
            </Pressable>
          )))}
        </View>

        {plants && <View style={styles.section}>
          <Text accessibilityRole="header" style={displayTypography.sectionHeading}>Flowering windows</Text>
          <View style={[styles.card, styles.timelineCard]}>
            {plants.map((plant) => (
              <View key={plant.id} style={styles.section}>
                <View style={styles.timelineTitle}>
                  <Text style={styles.plantName}>{plant.name}</Text>
                  <Text style={styles.meta}>{plant.bloomWindow}</Text>
                </View>
                <View style={styles.timeline} aria-hidden>
                  {calendarMonths.map(({ name, number }) => (
                    <View key={name} style={[
                      styles.monthMarker,
                      selectedMonths.includes(number) && styles.selectedMarker,
                    ]}>
                      <View style={[
                        styles.monthBar,
                        plant.bloomMonths.includes(number) && styles.floweringBar,
                      ]} />
                    </View>
                  ))}
                </View>
              </View>
            ))}
            <View style={styles.timeline} aria-hidden>
              {calendarMonths.map(({ name, initial }) => <Text key={name} style={styles.monthInitial}>{initial}</Text>)}
            </View>
            <Text style={styles.body}>
              Example windows run January to December. Taller bars show flowering months, and outlines mark the selected period. Weather and location can affect flowering.
            </Text>
          </View>
        </View>}

        <View style={styles.section}>
          <Text accessibilityRole="header" style={displayTypography.sectionHeading}>Coming up next</Text>
          <Text style={[styles.body, styles.tip]}>Share a sighting to record what you observed and when it flowered.</Text>
          <BloomButton variant="secondary" label="Add an observation" width="100%" onPress={() => router.navigate('/submit')} />
        </View>

        <BloomPollenWarning
          title="Hay fever today · Example: Moderate"
          body="Sample tree pollen information. Check a local forecast before planning a visit."
        />
        <BloomButton variant="secondary" label="Explore the map" width="100%" onPress={() => router.navigate('/')} />
      </View>
    </BloomScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: Spacing.three, paddingBottom: Spacing.five },
  header: { gap: Spacing.two },
  logo: { marginBottom: Spacing.three },
  location: { color: colors.leafGreen, fontFamily: 'NotoSans_700Bold', fontSize: 12, letterSpacing: 1 },
  body: { color: colors.deepPlum, fontSize: 16, lineHeight: 24 },
  sections: { gap: Spacing.four, marginTop: Spacing.four },
  section: { gap: Spacing.twelve },
  selectorHeader: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: Spacing.one },
  controlLabel: { flex: 1, color: colors.leafGreen, fontFamily: 'NotoSans_700Bold', fontSize: 16 },
  scrollControls: { flexDirection: 'row' },
  scrollControl: { minWidth: ControlSize.minimumTouch, minHeight: ControlSize.minimumTouch, alignItems: 'center', justifyContent: 'center' },
  focusedControl: { outlineColor: colors.deepPlum, outlineWidth: 2, outlineOffset: -2, outlineStyle: 'solid' },
  scrollArrow: { color: colors.purple, fontSize: 24 },
  disabledArrow: { color: colors.disabledBorder },
  selectorViewport: { minWidth: 0, overflow: 'hidden' },
  chips: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, padding: Spacing.one },
  selectorItem: { flexShrink: 0 },
  edgeFade: { position: 'absolute', top: 0, bottom: 0, width: Spacing.three },
  leftFade: {
    left: 0,
    ...Platform.select({ web: { backgroundImage: 'linear-gradient(90deg, #F8F5FA, transparent)' }, default: { experimental_backgroundImage: 'linear-gradient(90deg, #F8F5FA, transparent)' } }),
  },
  rightFade: {
    right: 0,
    ...Platform.select({ web: { backgroundImage: 'linear-gradient(270deg, #F8F5FA, transparent)' }, default: { experimental_backgroundImage: 'linear-gradient(270deg, #F8F5FA, transparent)' } }),
  },
  card: { backgroundColor: colors.white, borderRadius: Radii[24], borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  outlook: { backgroundColor: colors.petalGreen, padding: Spacing.three, gap: Spacing.one },
  outlookLabel: { fontFamily: 'NotoSans_700Bold', color: colors.deepPlum, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.8 },
  plantRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.twelve, padding: Spacing.twelve, borderTopWidth: 1, borderColor: colors.border },
  pressed: { backgroundColor: colors.palePurple },
  photo: { width: 48, height: 48, borderRadius: Radii[12] },
  plantInfo: { flex: 1, minWidth: 0, gap: Spacing.one },
  plantName: { fontSize: 17, lineHeight: 23, fontFamily: 'NotoSans_700Bold', color: colors.deepPlum },
  meta: { color: colors.leafGreen, fontSize: 13, lineHeight: 19 },
  chevron: { fontSize: 24, color: colors.purple },
  empty: { color: colors.deepPlum, fontSize: 16, lineHeight: 24, padding: Spacing.three },
  timelineCard: { padding: Spacing.three, gap: Spacing.three },
  timelineTitle: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: Spacing.one },
  timeline: { flexDirection: 'row', gap: Spacing.half },
  monthMarker: { flex: 1, minWidth: 0, height: 16, borderWidth: 1, borderColor: 'transparent', borderRadius: Radii[8], paddingHorizontal: 1, justifyContent: 'center' },
  selectedMarker: { borderColor: colors.purple },
  monthBar: { height: 3, borderRadius: Radii[8], backgroundColor: colors.border },
  floweringBar: { height: 8, backgroundColor: colors.leafGreen },
  monthInitial: { flex: 1, minWidth: 0, color: colors.leafGreen, fontSize: 10, textAlign: 'center' },
  tip: { backgroundColor: colors.paleGreen, borderRadius: Radii[20], padding: Spacing.three },
});
