import { configureFonts, MD3LightTheme } from 'react-native-paper';
import { colors } from './colors';

export const bloomTheme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: { fontFamily: 'NotoSans_400Regular' } }),
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.purple,
    onPrimary: colors.white,
    primaryContainer: colors.palePurple,
    onPrimaryContainer: colors.deepPlum,
    secondary: colors.leafGreen,
    onSecondary: colors.white,
    secondaryContainer: colors.paleGreen,
    onSecondaryContainer: colors.leafGreen,
    tertiary: colors.petalGreen,
    onTertiary: colors.deepPlum,
    background: colors.petalWhite,
    onBackground: colors.deepPlum,
    surface: colors.white,
    onSurface: colors.deepPlum,
    surfaceVariant: colors.paleGreen,
    onSurfaceVariant: colors.deepPlum,
    outline: colors.leafGreen,
  },
};
