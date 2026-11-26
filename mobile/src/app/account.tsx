import { useCallback, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useFocusEffect } from 'expo-router';
import { BloomButton } from '../components/BloomButton';
import { BloomFilterChip } from '../components/BloomFilterChip';
import { BloomLogo } from '../components/BloomLogo';
import { BloomScreen } from '../components/BloomScreen';
import { ControlSize, Radii, Spacing } from '../constants/theme';
import { colors } from '../theme/colors';
import { displayTypography } from '../theme/typography';

const modes = ['Sign in', 'Create account'] as const;
type Mode = (typeof modes)[number];

function PasswordField({ label, value, visible, error, onChangeText, onToggle }: {
  label: string;
  value: string;
  visible: boolean;
  error?: string;
  onChangeText: (value: string) => void;
  onToggle: () => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.passwordRow}>
        <TextInput
          mode="outlined"
          accessibilityLabel={`${label}, required`}
          accessibilityHint={error}
          autoCapitalize="none"
          autoComplete="off"
          importantForAutofill="no"
          autoCorrect={false}
          spellCheck={false}
          secureTextEntry={!visible}
          value={value}
          onChangeText={onChangeText}
          error={Boolean(error)}
          outlineStyle={styles.outline}
          style={[styles.input, styles.passwordInput]}
          contentStyle={styles.inputContent}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
          onPress={onToggle}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.visibility, focused && styles.focused]}
        >
          <MaterialCommunityIcons name={visible ? 'eye-off-outline' : 'eye-outline'} size={23} color={colors.leafGreen} aria-hidden />
        </Pressable>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

export default function AccountScreen() {
  const [mode, setMode] = useState<Mode>('Sign in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [feedback, setFeedback] = useState<'invalid' | 'checked' | null>(null);
  const registering = mode === 'Create account';

  const clearPasswords = useCallback(() => {
    setPassword('');
    setConfirmation('');
    setPasswordVisible(false);
    setConfirmationVisible(false);
  }, []);

  useFocusEffect(useCallback(() => () => {
    clearPasswords();
    setEmail('');
    setAttempted(false);
    setFeedback(null);
  }, [clearPasswords]));

  const emailError = !email.trim() ? 'Enter a demonstration email address.'
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? 'Enter an email address in the form name@example.com.'
      : undefined;
  const passwordError = !password.trim() ? 'Enter a demonstration password.' : undefined;
  const confirmationError = !registering ? undefined
    : !confirmation.trim() ? 'Confirm the demonstration password.'
      : password !== confirmation ? 'The passwords do not match.' : undefined;

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    clearPasswords();
    setMode(next);
    setAttempted(false);
    setFeedback(null);
  };

  const validatePreview = () => {
    Keyboard.dismiss();
    if (emailError || passwordError || confirmationError) {
      setAttempted(true);
      setFeedback('invalid');
      return;
    }
    setAttempted(false);
    setFeedback('checked');
    clearPasswords();
  };

  const exploreAsGuest = () => {
    clearPasswords();
    router.dismissTo('/');
  };

  return (
    <KeyboardAvoidingView style={styles.screen} enabled={Platform.OS === 'ios'} behavior="padding">
      <BloomScreen
        botanical
        insetTop={false}
        contentContainerStyle={styles.content}
        header={
          <View style={styles.header}>
            <BloomLogo />
            <Text accessibilityRole="header" style={displayTypography.screenHeading}>{mode} preview</Text>
            <Text style={styles.body}>Use demonstration credentials only. This preview checks fields locally.</Text>
          </View>
        }
      >
        <View style={styles.form}>
          <View style={styles.modes}>
            {modes.map((item) => (
              <BloomFilterChip key={item} label={mode === item ? `✓ ${item}` : item} accessibilityLabel={item}
                selected={mode === item} selectedTreatment="solid" onPress={() => switchMode(item)} />
            ))}
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              mode="outlined"
              accessibilityLabel="Email address, required"
              accessibilityHint={attempted ? emailError : undefined}
              autoCapitalize="none"
              autoComplete="off"
              importantForAutofill="no"
              autoCorrect={false}
              keyboardType="email-address"
              value={email}
              onChangeText={(value) => { setEmail(value); setFeedback(null); }}
              placeholder="name@example.com"
              error={attempted && Boolean(emailError)}
              outlineStyle={styles.outline}
              style={styles.input}
              contentStyle={styles.inputContent}
            />
            {attempted && emailError && <Text style={styles.error}>{emailError}</Text>}
          </View>
          <PasswordField
            label="Password"
            value={password}
            visible={passwordVisible}
            error={attempted ? passwordError : undefined}
            onChangeText={(value) => { setPassword(value); setFeedback(null); }}
            onToggle={() => setPasswordVisible(!passwordVisible)}
          />
          {registering && (
            <PasswordField
              label="Confirm password"
              value={confirmation}
              visible={confirmationVisible}
              error={attempted ? confirmationError : undefined}
              onChangeText={(value) => { setConfirmation(value); setFeedback(null); }}
              onToggle={() => setConfirmationVisible(!confirmationVisible)}
            />
          )}
          <BloomButton label={registering ? 'Check account creation form' : 'Check sign-in form'} width="100%" onPress={validatePreview} />
          {feedback && (
            <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={feedback === 'invalid' ? styles.error : styles.helper}>
              {feedback === 'invalid'
                ? 'Check the fields marked above.'
                : 'Form checked locally. No account was created, no sign-in occurred, and nothing was saved or sent.'}
            </Text>
          )}
          <BloomButton variant="secondary" label="Explore the map as a guest" width="100%" onPress={exploreAsGuest} />
        </View>
      </BloomScreen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingTop: Spacing.three, paddingBottom: Spacing.five },
  header: { gap: Spacing.twelve },
  body: { color: colors.deepPlum, fontSize: 16, lineHeight: 24 },
  form: { gap: Spacing.three, marginTop: Spacing.four },
  modes: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  field: { gap: Spacing.two },
  label: { color: colors.leafGreen, fontFamily: 'NotoSans_700Bold', fontSize: 16 },
  outline: { borderRadius: Radii[16] },
  input: { minHeight: ControlSize.minimumTouch, backgroundColor: colors.white },
  inputContent: { fontFamily: 'NotoSans_400Regular', fontSize: 17 },
  passwordRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  passwordInput: { flex: 1, minWidth: 0 },
  visibility: {
    width: ControlSize.minimumTouch, minHeight: ControlSize.minimumTouch, borderRadius: Radii[24],
    backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  focused: { outlineColor: colors.deepPlum, outlineWidth: 2, outlineStyle: 'solid' },
  error: { color: colors.pollenText, fontFamily: 'NotoSans_700Bold', fontSize: 14, lineHeight: 21 },
  helper: { color: colors.leafGreen, fontSize: 14, lineHeight: 22 },
});
