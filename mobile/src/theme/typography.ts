import type { TextStyle } from 'react-native';
import { colors } from './colors';

export const displayTypography = {
  wordmark: {
    fontFamily: 'Lora_500Medium',
    fontSize: 36,
    lineHeight: 43,
    color: colors.purple,
  },
  screenHeading: {
    fontFamily: 'Lora_600SemiBold',
    fontSize: 29,
    lineHeight: 36,
    color: colors.deepPlum,
  },
  sectionHeading: {
    fontFamily: 'Lora_600SemiBold',
    fontSize: 24,
    lineHeight: 30,
    color: colors.deepPlum,
  },
} satisfies Record<'wordmark' | 'screenHeading' | 'sectionHeading', TextStyle>;
