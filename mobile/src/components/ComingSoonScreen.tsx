import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export function ComingSoonScreen({ name }: { name: string }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.logo}>✿ bloom</Text>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.body}>This tab is reserved to match the approved navigation. We will build its screen after the Discovery → Plant Details flow is working.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.petalWhite },
  content: { padding: 24, gap: 18 },
  logo: { fontSize: 26, color: colors.purple, fontFamily: 'NotoSans_700Bold' },
  title: { fontSize: 28, color: colors.deepPlum, fontFamily: 'NotoSans_700Bold' },
  body: { fontSize: 18, lineHeight: 28, color: colors.deepPlum },
});
