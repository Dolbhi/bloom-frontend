import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Divider, Switch, Text, TextInput } from 'react-native-paper';

import { BloomScreen } from '../components/BloomScreen';
import { BloomSettingsRow } from '../components/BloomSettingsRow';
import { ControlSize, Radii, Spacing } from '../constants/theme';
import { colors } from '../theme/colors';

type ToggleRowProps = {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

function ToggleRow({ label, description, value, onValueChange }: ToggleRowProps) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <View style={styles.switchWrap}>
        <Switch
          value={value}
          onValueChange={onValueChange}
          color={colors.purple}
          accessibilityLabel={label}
          accessibilityState={{ checked: value }}
        />
      </View>
    </View>
  );
}

export default function AccountSettingsScreen() {
  const [displayName, setDisplayName] = useState('Bloom Explorer');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('Melbourne, Victoria');
  const [notifications, setNotifications] = useState({
    bloomAlerts: true,
    pollenAlerts: true,
    communityUpdates: false,
    pushEnabled: false,
  });
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    shareLocation: false,
  });

  const showDemoAlert = (title: string, message: string) => Alert.alert(title, message);

  const saveDetails = () => {
    showDemoAlert(
      'Details saved locally',
      'This preview does not connect to an account service. Nothing was sent to a server.',
    );
  };

  return (
    <BloomScreen
      title="Account settings"
      eyebrow="YOUR BLOOM ACCOUNT"
      subtitle="Update your details and choose how Bloom keeps in touch."
    >
      <View style={styles.demoNotice}>
        <Text style={styles.demoNoticeText}>
          This is a UI-only preview. Changes stay on this device and no account service is connected.
        </Text>
      </View>

      <Text style={styles.section}>Personal details</Text>
      <View style={styles.formCard}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Display name</Text>
          <TextInput
            mode="outlined"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your name"
            accessibilityLabel="Display name"
            style={styles.input}
            contentStyle={styles.inputContent}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Email address</Text>
          <TextInput
            mode="outlined"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="name@example.com"
            accessibilityLabel="Email address"
            style={styles.input}
            contentStyle={styles.inputContent}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Location</Text>
          <TextInput
            mode="outlined"
            value={location}
            onChangeText={setLocation}
            placeholder="City or suburb"
            accessibilityLabel="Location"
            style={styles.input}
            contentStyle={styles.inputContent}
          />
        </View>
        <Button
          mode="contained"
          contentStyle={{ minHeight: ControlSize.preferred }}
          style={styles.saveButton}
          onPress={saveDetails}
        >
          Save changes
        </Button>
      </View>

      <Text style={styles.section}>Notifications</Text>
      <View style={styles.card}>
        <ToggleRow
          label="Bloom alerts"
          description="Hear when plants near you start blooming"
          value={notifications.bloomAlerts}
          onValueChange={(value) => setNotifications((current) => ({ ...current, bloomAlerts: value }))}
        />
        <Divider style={styles.divider} />
        <ToggleRow
          label="Pollen alerts"
          description="Sample pollen reminders for your area"
          value={notifications.pollenAlerts}
          onValueChange={(value) => setNotifications((current) => ({ ...current, pollenAlerts: value }))}
        />
        <Divider style={styles.divider} />
        <ToggleRow
          label="Community updates"
          description="News about reviews and community sightings"
          value={notifications.communityUpdates}
          onValueChange={(value) => setNotifications((current) => ({ ...current, communityUpdates: value }))}
        />
        <Divider style={styles.divider} />
        <ToggleRow
          label="Push notifications"
          description="Allow alerts on this device"
          value={notifications.pushEnabled}
          onValueChange={(value) => setNotifications((current) => ({ ...current, pushEnabled: value }))}
        />
      </View>
      <Text style={styles.helper}>
        Notification delivery will require backend support and device permissions.
      </Text>

      <Text style={styles.section}>Privacy</Text>
      <View style={styles.card}>
        <ToggleRow
          label="Public profile"
          description="Show your contributions on the community map"
          value={privacy.publicProfile}
          onValueChange={(value) => setPrivacy((current) => ({ ...current, publicProfile: value }))}
        />
        <Divider style={styles.divider} />
        <ToggleRow
          label="Share approximate location"
          description="Use your area for nearby plant suggestions"
          value={privacy.shareLocation}
          onValueChange={(value) => setPrivacy((current) => ({ ...current, shareLocation: value }))}
        />
      </View>
      <Text style={styles.helper}>Location sharing is not connected in this preview.</Text>

      <Text style={styles.section}>Account</Text>
      <View style={styles.card}>
        <BloomSettingsRow
          icon="lock-reset"
          label="Change password"
          description="Send a password reset link"
          onPress={() => showDemoAlert('Password reset not connected', 'No email was sent. Account services are not connected in this preview.')}
        />
        <Divider style={styles.divider} />
        <BloomSettingsRow
          icon="logout"
          label="Sign out"
          description="End this demo session"
          onPress={() => showDemoAlert('Sign out preview', 'Authentication is not connected, so this demo cannot sign you out.')}
        />
        <Divider style={styles.divider} />
        <BloomSettingsRow
          icon="delete-outline"
          label="Delete account"
          description="Permanently remove this account"
          destructive
          onPress={() => showDemoAlert('Delete account preview', 'No account was deleted. Account deletion will be available once authentication is connected.')}
        />
      </View>
    </BloomScreen>
  );
}

const styles = StyleSheet.create({
  demoNotice: {
    backgroundColor: colors.paleGreen,
    borderRadius: Radii[16],
    padding: 14,
  },
  demoNoticeText: {
    color: colors.deepPlum,
    fontFamily: 'NotoSans_400Regular',
    fontSize: 14,
    lineHeight: 21,
  },
  section: {
    color: colors.deepPlum,
    fontFamily: 'NotoSans_700Bold',
    fontSize: 21,
    lineHeight: 29,
  },
  formCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: Radii[20],
    padding: Spacing.three,
    gap: Spacing.twelve,
  },
  field: { gap: Spacing.one },
  fieldLabel: {
    color: colors.deepPlum,
    fontFamily: 'NotoSans_700Bold',
    fontSize: 15,
    lineHeight: 21,
  },
  input: { backgroundColor: colors.white },
  inputContent: { fontSize: 17 },
  saveButton: { borderRadius: Radii[16] },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: Radii[20],
    overflow: 'hidden',
  },
  toggleRow: {
    minHeight: ControlSize.preferred,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twelve,
  },
  toggleText: { flex: 1, minWidth: 0, gap: Spacing.half },
  rowLabel: {
    color: colors.deepPlum,
    fontFamily: 'NotoSans_700Bold',
    fontSize: 16,
    lineHeight: 21,
  },
  rowDescription: {
    color: colors.leafGreen,
    fontFamily: 'NotoSans_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  switchWrap: {
    width: ControlSize.minimumTouch,
    height: ControlSize.minimumTouch,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { backgroundColor: colors.border },
  helper: {
    color: colors.leafGreen,
    fontFamily: 'NotoSans_400Regular',
    fontSize: 14,
    lineHeight: 22,
  },
});
