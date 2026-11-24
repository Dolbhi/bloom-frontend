import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text } from 'react-native-paper';
import { BloomScreen } from '../components/BloomScreen';
import { colors } from '../theme/colors';

const queue = [
  { id: '1', title: 'Cherry Blossom', location: 'Carlton Gardens', contributor: 'Example contributor', confidence: 'Needs review', note: 'Sample review note: Spring bloom window was added by a community member.' },
  { id: '2', title: 'Common Lilac', location: 'Fitzroy Gardens', contributor: 'Example contributor', confidence: 'Needs review', note: 'Sample review note: Please verify the location and flowering dates.' },
];
export default function ReviewScreen() {
  const [decisions, setDecisions] = useState<Record<string, string>>({});
  const decide = (id: string, choice: string) => {
    setDecisions((previous) => ({ ...previous, [id]: choice }));
    Alert.alert('Demo review recorded locally', 'This only changes the preview on this screen. Nothing has been moderated or sent to the backend.');
  };
  return <BloomScreen title="Community review" eyebrow="HELP KEEP BLOOM TRUSTWORTHY" subtitle="Review sample contributions before they appear in the community map.">
    <Card mode="contained" style={styles.info}><Card.Content><Text style={styles.infoText}>This is a demonstration queue. Approval and reporting are not connected to real user accounts.</Text></Card.Content></Card>
    {queue.map((item) => <Card key={item.id} mode="outlined" style={styles.card}><Card.Content style={styles.content}>
      <Text style={styles.title}>{item.title}</Text><Text style={styles.text}>{item.location} · {item.contributor}</Text>
      <Chip style={styles.chip} textStyle={styles.chipText}>{decisions[item.id] ?? item.confidence}</Chip>
      <Text style={styles.text}>{item.note}</Text>
      <View style={styles.actions}><Button mode="contained" onPress={() => decide(item.id, 'Approved in demo')} contentStyle={{ minHeight: 49 }}>Approve</Button><Button mode="outlined" onPress={() => decide(item.id, 'Changes requested in demo')} contentStyle={{ minHeight: 49 }}>Request changes</Button></View>
    </Card.Content></Card>)}
  </BloomScreen>;
}
const styles = StyleSheet.create({
  info: { backgroundColor: colors.paleGreen, borderRadius: 20 },
  infoText: { color: colors.deepPlum, fontSize: 16, lineHeight: 25 },
  card: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 20 },
  content: { gap: 10 },
  title: { color: colors.deepPlum, fontSize: 20, fontFamily: 'NotoSans_700Bold' },
  text: { color: colors.deepPlum, fontSize: 16, lineHeight: 24 },
  chip: { alignSelf: 'flex-start', backgroundColor: colors.palePurple, minHeight: 42, justifyContent: 'center' },
  chipText: { color: colors.purple, fontFamily: 'NotoSans_700Bold' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
});
