import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Chip, Text, TextInput } from 'react-native-paper';
import { BloomScreen } from '../components/BloomScreen';
import { colors } from '../theme/colors';

export default function AccountScreen() {
  const [mode, setMode] = useState<'Sign in' | 'Create account'>('Sign in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const preview = () => Alert.alert('Authentication not connected', 'This is only the account screen layout. Please do not enter a real password. No sign-in or account creation has occurred.');
  return <BloomScreen title="Welcome to Bloom" eyebrow="YOUR GARDEN COMMUNITY" subtitle="Sign in to share sightings and keep track of the blooms you love.">
    <View style={styles.hero}><Text style={styles.flower}>✿</Text><Text style={styles.heroText}>Nature is better together</Text></View>
    <View style={styles.tabs}>{(['Sign in', 'Create account'] as const).map((value) => <Chip key={value} style={styles.tab} textStyle={styles.tabText} selected={mode === value} onPress={() => setMode(value)}>{value}</Chip>)}</View>
    <Text style={styles.label}>Email address</Text>
    <TextInput mode="outlined" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} placeholder="name@example.com" accessibilityLabel="Email address" style={styles.input} contentStyle={styles.inputContent} />
    <Text style={styles.label}>Password</Text>
    <TextInput mode="outlined" secureTextEntry value={password} onChangeText={setPassword} placeholder="Password" accessibilityLabel="Password" style={styles.input} contentStyle={styles.inputContent} />
    <Text style={styles.warning}>Demo only: use dummy credentials. This screen does not connect to an authentication service.</Text>
    <Button mode="contained" contentStyle={{ minHeight: 54 }} style={styles.button} onPress={preview}>{mode}</Button>
    <Text style={styles.footer}>You can explore plants without signing in.</Text>
  </BloomScreen>;
}
const styles = StyleSheet.create({
  hero: { backgroundColor: colors.paleGreen, borderRadius: 23, padding: 20, flexDirection: 'row', gap: 13, alignItems: 'center' },
  flower: { fontSize: 55, color: colors.purple },
  heroText: { fontSize: 20, lineHeight: 30, color: colors.leafGreen, fontFamily: 'NotoSans_700Bold', flex: 1 },
  tabs: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  tab: { backgroundColor: colors.white, minHeight: 48, justifyContent: 'center' },
  tabText: { color: colors.deepPlum, fontSize: 16 },
  label: { fontSize: 16, color: colors.deepPlum, fontFamily: 'NotoSans_700Bold' },
  input: { backgroundColor: colors.white, marginTop: -8 },
  inputContent: { fontSize: 17 },
  warning: { fontSize: 15, color: colors.leafGreen, lineHeight: 23 },
  button: { borderRadius: 18 },
  footer: { color: colors.deepPlum, fontSize: 16, lineHeight: 25 },
});
