import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { BloomButton } from '../components/BloomButton';
import { BloomLogo } from '../components/BloomLogo';
import { BloomScreen } from '../components/BloomScreen';
import { Radii, Spacing } from '../constants/theme';
import { mockPlants } from '../data/mockPlants';
import { colors } from '../theme/colors';
import { displayTypography } from '../theme/typography';

const queue = [
  { id: '1', plantId: 'cherry-blossom', title: 'Cherry Blossom', location: 'Carlton Gardens', contributor: 'Example contributor', confidence: 'Needs review', note: 'Sample review note: Spring bloom window was added by a community member.' },
  { id: '2', plantId: 'common-lilac', title: 'Common Lilac', location: 'Fitzroy Gardens', contributor: 'Example contributor', confidence: 'Needs review', note: 'Sample review note: Please verify the location and flowering dates.' },
];

type Decision = 'Approved in demo' | 'Changes requested in demo';

export default function ReviewScreen() {
  const [decisions, setDecisions] = useState<Partial<Record<string, Decision>>>({});

  const decide = (id: string, choice: Decision) => {
    setDecisions((previous) => previous[id] === choice ? previous : { ...previous, [id]: choice });
  };

  return (
    <BloomScreen
      botanical
      contentContainerStyle={styles.content}
      header={
        <View style={styles.header}>
          <BloomLogo />
          <Text accessibilityRole="header" style={displayTypography.screenHeading}>Review sightings</Text>
          <Text style={styles.body}>Review sample contributions by checking the photo, plant identification, location, and flowering window.</Text>
        </View>
      }
    >
      <View style={styles.sections}>
        <View style={styles.guidance}>
          <Text style={styles.body}>Decisions stay on this screen until you leave the review preview. Nothing is published or sent for moderation.</Text>
        </View>
        <Text accessibilityRole="header" style={displayTypography.sectionHeading}>Sightings to review</Text>
        {queue.map((item) => {
          const plant = mockPlants.find(({ id }) => id === item.plantId);
          const decision = decisions[item.id];
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.identity}>
                {plant && <Image source={plant.photo} resizeMode="contain" style={styles.photo} accessible={false} aria-hidden />}
                <View style={styles.metadata}>
                  <Text accessibilityRole="header" style={styles.title}>{item.title}</Text>
                  <Text style={styles.body}>{item.contributor}</Text>
                  <Text style={styles.body}>{item.location}</Text>
                  {plant && <Text style={styles.helper}>Example flowering window · {plant.bloomWindow}</Text>}
                </View>
              </View>
              <Text accessibilityLiveRegion="polite" accessibilityLabel={`${item.title}: ${decision ?? item.confidence}`} style={styles.status}>
                {decision ?? item.confidence}
              </Text>
              <View style={styles.guidance}><Text style={styles.body}>{item.note}</Text></View>
              <View style={styles.actions}>
                <BloomButton
                  label="Request changes"
                  accessibilityLabel={`Request changes for ${item.title} in the demo`}
                  variant="secondary"
                  width="100%"
                  disabled={decision === 'Changes requested in demo'}
                  onPress={() => decide(item.id, 'Changes requested in demo')}
                />
                <BloomButton
                  label="Approve"
                  accessibilityLabel={`Approve ${item.title} in the demo`}
                  width="100%"
                  disabled={decision === 'Approved in demo'}
                  onPress={() => decide(item.id, 'Approved in demo')}
                />
              </View>
            </View>
          );
        })}
      </View>
    </BloomScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: Spacing.three, paddingBottom: Spacing.five },
  header: { gap: Spacing.twelve },
  sections: { gap: Spacing.three, marginTop: Spacing.four },
  guidance: { backgroundColor: colors.paleGreen, borderRadius: Radii[20], padding: Spacing.three },
  card: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: Radii[24],
    padding: Spacing.three,
    gap: Spacing.twelve,
  },
  identity: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', gap: Spacing.twelve },
  photo: { width: 80, height: 62, backgroundColor: colors.petalWhite, borderRadius: Radii[12] },
  metadata: { flexGrow: 1, flexBasis: 170, minWidth: 0, gap: Spacing.one },
  title: { color: colors.deepPlum, fontFamily: 'NotoSans_700Bold', fontSize: 18, lineHeight: 24 },
  body: { color: colors.deepPlum, fontSize: 16, lineHeight: 24 },
  helper: { color: colors.leafGreen, fontSize: 14, lineHeight: 22 },
  status: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    overflow: 'hidden',
    backgroundColor: colors.palePurple,
    color: colors.purple,
    borderRadius: Radii[24],
    paddingHorizontal: Spacing.twelve,
    paddingVertical: Spacing.two,
    fontFamily: 'NotoSans_700Bold',
    fontSize: 14,
    lineHeight: 20,
  },
  actions: { gap: Spacing.two },
});
