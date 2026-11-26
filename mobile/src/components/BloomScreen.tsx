import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { displayTypography } from '../theme/typography';

type DefaultHeader = {
  title: string;
  subtitle: string;
  eyebrow?: string;
  displayHeading?: boolean;
  header?: never;
};

type CustomHeader = {
  header: ReactNode;
  title?: never;
  subtitle?: never;
  eyebrow?: never;
  displayHeading?: never;
};

type Props = (DefaultHeader | CustomHeader) & {
  botanical?: boolean;
  /** Set to false when an opaque stack header already applies the top inset. */
  insetTop?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
};

const botanicalArtwork = require('../../assets/brand/botanical-background.png');
const gradient = `linear-gradient(180deg, ${colors.palePurple}, ${colors.petalWhite}, ${colors.paleGreen})`;

/** Shared screen spacing, reading hierarchy and safe-area handling for demo tabs. */
export function BloomScreen({
  title,
  subtitle,
  eyebrow,
  header,
  displayHeading = false,
  botanical = false,
  insetTop = true,
  contentContainerStyle,
  children,
}: Props) {
  const content = title !== undefined ? (
    <>
      <Text style={styles.logo}>✿ bloom</Text>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text
        variant={displayHeading ? undefined : 'headlineMedium'}
        style={[styles.title, displayHeading && displayTypography.screenHeading]}
      >
        {title}
      </Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.body}>{children}</View>
    </>
  ) : (
    <>
      {header}
      {children}
    </>
  );

  return (
    <SafeAreaView style={styles.safe} edges={insetTop ? ['top'] : []}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.container, botanical && styles.botanicalContainer, contentContainerStyle]}
      >
        {botanical ? (
          <>
            <View
              style={[styles.decoration, styles.gradient]}
              pointerEvents="none"
              aria-hidden
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <Image source={botanicalArtwork} style={styles.botanicalArtwork} contentFit="contain" />
            </View>
            <View style={styles.foreground}>{content}</View>
          </>
        ) : content}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.petalWhite },
  container: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 36 },
  botanicalContainer: { flexGrow: 1 },
  decoration: { ...StyleSheet.absoluteFill, backgroundColor: colors.petalWhite, alignItems: 'center', overflow: 'hidden' },
  gradient: Platform.select({
    web: { backgroundImage: gradient },
    default: { experimental_backgroundImage: gradient },
  }) ?? {},
  botanicalArtwork: { width: '100%', maxWidth: 480, aspectRatio: 393 / 620, marginTop: 64 },
  foreground: { zIndex: 1 },
  logo: { fontSize: 27, color: colors.purple, fontFamily: 'NotoSans_700Bold', marginBottom: 30 },
  eyebrow: { color: colors.leafGreen, fontSize: 13, fontFamily: 'NotoSans_700Bold', letterSpacing: 1.0 },
  title: { color: colors.deepPlum, fontSize: 30, lineHeight: 40, fontFamily: 'NotoSans_700Bold', marginTop: 6 },
  subtitle: { color: colors.deepPlum, fontSize: 17, lineHeight: 26, marginTop: 7 },
  body: { gap: 15, paddingTop: 22 },
});
