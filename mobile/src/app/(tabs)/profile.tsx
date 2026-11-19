import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { router } from 'expo-router';
import { BloomScreen } from '../../components/BloomScreen';
import { colors } from '../../theme/colors';

export default function ProfileScreen() {
  return <BloomScreen title="Your profile" eyebrow="BLOOM COMMUNITY" subtitle="Your plant discoveries and community contributions will live here.">
    <Card mode="contained" style={styles.hero}><Card.Content style={styles.heroContent}>
      <Text style={styles.avatar}>✿</Text><View style={{ flex: 1 }}>
        <Text style={styles.heroHeading}>Welcome to Bloom</Text>
        <Text style={styles.body}>Explore as a guest, or preview the sign-in screen.</Text>
      </View>
    </Card.Content></Card>
    <Button mode="contained" contentStyle={{ minHeight: 52 }} style={styles.button} onPress={() => router.push('/account')}>Sign in or create an account</Button>
    <Text style={styles.section}>Activity</Text>
    <Card mode="outlined" style={styles.card}><Card.Content>
      <Text style={styles.cardHeading}>Your sightings</Text>
      <Text style={styles.body}>Nothing submitted yet. The demo form does not save or upload sightings.</Text>
    </Card.Content></Card>
    <Text style={styles.section}>Community</Text>
    <Card mode="outlined" style={styles.card}><Card.Content>
      <Text style={styles.cardHeading}>Review contributions</Text>
      <Text style={styles.body}>Preview the community review layout and approval controls.</Text>
      <Button mode="outlined" style={styles.linkButton} contentStyle={{ minHeight: 48 }} onPress={() => router.push('/review')}>Open review preview</Button>
    </Card.Content></Card>
    <Text style={styles.helper}>Profile activity and permissions will require authentication and backend integration.</Text>
  </BloomScreen>;
}
const styles = StyleSheet.create({
  hero: { backgroundColor: colors.paleGreen, borderRadius: 22 },
  heroContent: { flexDirection: 'row', gap: 13, alignItems: 'center' },
  avatar: { width: 72, height: 72, textAlign: 'center', textAlignVertical: 'center', fontSize: 47, color: colors.purple, backgroundColor: colors.white, overflow: 'hidden', borderRadius: 38 },
  heroHeading: { color: colors.deepPlum, fontFamily: 'NotoSans_700Bold', fontSize: 19 },
  body: { color: colors.deepPlum, fontSize: 16, lineHeight: 25, marginTop: 5 },
  button: { borderRadius: 18 },
  section: { color: colors.deepPlum, fontSize: 21, fontFamily: 'NotoSans_700Bold' },
  card: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 20 },
  cardHeading: { color: colors.deepPlum, fontFamily: 'NotoSans_700Bold', fontSize: 18 },
  linkButton: { marginTop: 13, borderRadius: 14 },
  helper: { color: colors.leafGreen, fontSize: 14, lineHeight: 22 },
});
