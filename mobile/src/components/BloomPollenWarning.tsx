import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export type BloomPollenWarningProps = {
  title: string;
  body: string;
};

export function BloomPollenWarning({ title, body }: BloomPollenWarningProps) {
  return (
    <View style={styles.card}>
      <Text accessibilityRole="header" style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    minWidth: 0,
    padding: 18,
    gap: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.leafGreen,
    backgroundColor: colors.white,
  },
  title: {
    color: colors.deepPlum,
    fontFamily: 'NotoSans_700Bold',
    fontSize: 18,
    lineHeight: 21.6,
  },
  body: {
    color: colors.deepPlum,
    fontFamily: 'NotoSans_400Regular',
    fontSize: 17,
    lineHeight: 20.4,
  },
});
