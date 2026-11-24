import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Spacing } from '../constants/theme';
import { displayTypography } from '../theme/typography';

const flower = require('../../assets/brand/bloom-flower.png');

export function BloomLogo() {
  return (
    <View accessible accessibilityRole="image" accessibilityLabel="Bloom" style={styles.logo}>
      <Image source={flower} style={styles.flower} contentFit="contain" accessible={false} aria-hidden />
      <Text aria-hidden style={styles.wordmark}>bloom</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: Spacing.two, maxWidth: '100%' },
  flower: { width: 36, aspectRatio: 1 },
  wordmark: { ...displayTypography.wordmark, flexShrink: 1 },
});
