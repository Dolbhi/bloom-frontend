import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { BloomButton } from '../../components/BloomButton';
import { BloomLogo } from '../../components/BloomLogo';
import { BloomScreen } from '../../components/BloomScreen';
import { Radii, Spacing } from '../../constants/theme';
import { colors } from '../../theme/colors';
import { displayTypography } from '../../theme/typography';

export default function ProfileScreen() {
  return (
    <BloomScreen
      botanical
      contentContainerStyle={styles.content}
      header={
        <View style={styles.header}>
          <BloomLogo />
          <View style={styles.identity}>
            <View style={styles.avatar} aria-hidden>
              <MaterialCommunityIcons name="account-outline" size={32} color={colors.leafGreen} />
            </View>
            <View style={styles.identityCopy}>
              <Text accessibilityRole="header" style={displayTypography.screenHeading}>Your profile</Text>
              <Text style={styles.guest}>Guest</Text>
            </View>
          </View>
          <Text style={styles.body}>Explore Bloom and try the account and community features in preview.</Text>
        </View>
      }
    >
      <View style={styles.sections}>
        <View style={styles.card}>
          <Text accessibilityRole="header" style={styles.cardHeading}>Account</Text>
          <Text style={styles.body}>The account preview shows the sign-in and account creation screens. Authentication is unavailable in this demo.</Text>
          <BloomButton label="Open account preview" width="100%" onPress={() => router.push('/account')} />
        </View>

        <View style={styles.section}>
          <Text accessibilityRole="header" style={displayTypography.sectionHeading}>Your sightings</Text>
          <View style={styles.card}>
            <Text style={styles.cardHeading}>No saved sightings</Text>
            <Text style={styles.body}>You can preview a new sighting. The demo form does not save or upload it.</Text>
            <BloomButton variant="secondary" label="Preview a new sighting" width="100%" onPress={() => router.navigate('/submit')} />
          </View>
        </View>

        <View style={styles.section}>
          <Text accessibilityRole="header" style={displayTypography.sectionHeading}>Community</Text>
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Review contributions</Text>
            <Text style={styles.body}>Explore the sample review queue. Decisions only affect the review preview.</Text>
            <BloomButton variant="secondary" label="Open review preview" width="100%" onPress={() => router.push('/review')} />
          </View>
        </View>
      </View>
    </BloomScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: Spacing.three, paddingBottom: Spacing.five },
  header: { gap: Spacing.twelve },
  identity: { flexDirection: 'row', alignItems: 'center', gap: Spacing.twelve, marginTop: Spacing.two },
  avatar: {
    width: 64,
    height: 64,
    flexShrink: 0,
    borderRadius: 32,
    backgroundColor: colors.paleGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  identityCopy: { flex: 1, minWidth: 0, gap: Spacing.one },
  guest: { color: colors.leafGreen, fontFamily: 'NotoSans_700Bold', fontSize: 14, lineHeight: 20 },
  sections: { gap: Spacing.four, marginTop: Spacing.four },
  section: { gap: Spacing.twelve },
  card: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: Radii[24],
    padding: Spacing.three,
    gap: Spacing.twelve,
  },
  cardHeading: { color: colors.deepPlum, fontFamily: 'NotoSans_700Bold', fontSize: 17, lineHeight: 24 },
  body: { color: colors.deepPlum, fontSize: 16, lineHeight: 24 },
});
