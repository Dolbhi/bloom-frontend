import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

type Props = {
  title: string;
  subtitle: string;
  eyebrow?: string;
  children: ReactNode;
};

/** Shared screen spacing, reading hierarchy and safe-area handling for demo tabs. */
export function BloomScreen({ title, subtitle, eyebrow, children }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.container}>
        <Text style={styles.logo}>✿ bloom</Text>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text variant="headlineMedium" style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.body}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.petalWhite },
  container: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 36 },
  logo: { fontSize: 27, color: colors.purple, fontFamily: 'NotoSans_700Bold', marginBottom: 30 },
  eyebrow: { color: colors.leafGreen, fontSize: 13, fontFamily: 'NotoSans_700Bold', letterSpacing: 1.0 },
  title: { color: colors.deepPlum, fontSize: 30, lineHeight: 40, fontFamily: 'NotoSans_700Bold', marginTop: 6 },
  subtitle: { color: colors.deepPlum, fontSize: 17, lineHeight: 26, marginTop: 7 },
  body: { gap: 15, paddingTop: 22 },
});
