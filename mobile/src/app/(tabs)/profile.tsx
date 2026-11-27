import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

import { BloomScreen } from '../../components/BloomScreen';
import { BloomSettingsRow } from '../../components/BloomSettingsRow';
import { ControlSize, Radii, Spacing } from '../../constants/theme';
import { colors } from '../../theme/colors';

const stats = [
  { label: 'Sightings', value: '0' },
  { label: 'Reviews', value: '0' },
  { label: 'Saved', value: '0' },
];

export default function ProfileScreen() {
  return (
    <BloomScreen
      title="Your profile"
      eyebrow="BLOOM COMMUNITY"
      subtitle="Manage your account and keep track of your plant discoveries."
    >
      <View style={styles.profileCard}>
        <View
          aria-hidden
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>✿</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Bloom Explorer</Text>
          <Text style={styles.profileMeta}>Melbourne, Victoria</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Sample profile</Text>
          </View>
        </View>
      </View>

      <View style={styles.stats}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.section}>Your account</Text>
      <View style={styles.card}>
        <BloomSettingsRow
          icon="account-edit-outline"
          label="Account settings"
          description="Personal details, notifications and privacy"
          onPress={() => router.push('/account-settings')}
        />
      </View>
      <Button
        mode="contained"
        contentStyle={{ minHeight: ControlSize.preferred }}
        style={styles.button}
        onPress={() => router.push('/account')}
      >
        Sign in or create an account
      </Button>

      <Text style={styles.section}>Activity</Text>
      <Card mode="outlined" style={styles.activityCard}>
        <Card.Content style={styles.emptyContent}>
          <View
            aria-hidden
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={styles.emptyIcon}
          >
            <MaterialCommunityIcons name="flower-outline" size={30} color={colors.purple} />
          </View>
          <Text style={styles.cardHeading}>Your sightings</Text>
          <Text style={styles.body}>Nothing submitted yet. Add your first sample sighting to see it here.</Text>
          <Button
            mode="outlined"
            contentStyle={{ minHeight: ControlSize.minimumTouch }}
            style={styles.outlineButton}
            onPress={() => router.push('/submit')}
          >
            Submit a sighting
          </Button>
        </Card.Content>
      </Card>

      <Text style={styles.section}>Community</Text>
      <View style={styles.card}>
        <BloomSettingsRow
          icon="clipboard-check-outline"
          label="Review contributions"
          description="Preview the community review controls"
          onPress={() => router.push('/review')}
        />
      </View>

      <Text style={styles.helper}>
        Profile activity, authentication and permissions will require backend integration. Sample content only.
      </Text>
    </BloomScreen>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: colors.paleGreen,
    borderRadius: Radii[24],
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.purple, fontSize: 40, lineHeight: 48 },
  profileInfo: { flex: 1, minWidth: 0, gap: Spacing.half },
  profileName: {
    color: colors.deepPlum,
    fontFamily: 'NotoSans_700Bold',
    fontSize: 21,
    lineHeight: 28,
  },
  profileMeta: {
    color: colors.leafGreen,
    fontFamily: 'NotoSans_400Regular',
    fontSize: 15,
    lineHeight: 21,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: Spacing.one,
    backgroundColor: colors.white,
    borderRadius: Radii[8],
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  badgeText: {
    color: colors.leafGreen,
    fontFamily: 'NotoSans_700Bold',
    fontSize: 12,
    lineHeight: 16,
  },
  stats: { flexDirection: 'row', gap: Spacing.two },
  statCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: Radii[16],
    paddingVertical: Spacing.twelve,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    gap: Spacing.half,
  },
  statValue: {
    color: colors.purple,
    fontFamily: 'NotoSans_700Bold',
    fontSize: 22,
    lineHeight: 28,
  },
  statLabel: {
    color: colors.leafGreen,
    fontFamily: 'NotoSans_400Regular',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  section: {
    color: colors.deepPlum,
    fontFamily: 'NotoSans_700Bold',
    fontSize: 21,
    lineHeight: 29,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: Radii[20],
    overflow: 'hidden',
  },
  button: { borderRadius: Radii[16] },
  activityCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: Radii[20],
  },
  emptyContent: { gap: Spacing.two, alignItems: 'flex-start' },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.palePurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.half,
  },
  cardHeading: {
    color: colors.deepPlum,
    fontFamily: 'NotoSans_700Bold',
    fontSize: 18,
    lineHeight: 24,
  },
  body: {
    color: colors.deepPlum,
    fontFamily: 'NotoSans_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  outlineButton: { marginTop: Spacing.one, borderRadius: Radii[12] },
  helper: {
    color: colors.leafGreen,
    fontFamily: 'NotoSans_400Regular',
    fontSize: 14,
    lineHeight: 22,
  },
});
