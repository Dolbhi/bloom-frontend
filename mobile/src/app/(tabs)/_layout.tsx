import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import { colors } from '../../theme/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.purple,
        tabBarInactiveTintColor: colors.leafGreen,
        tabBarStyle: { backgroundColor: colors.petalWhite, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: 'NotoSans_700Bold', fontSize: 13 },
        tabBarItemStyle: { minHeight: 48 },
      }}
    >
      <Tabs.Screen name="(map)" options={{ title: 'Map', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="map-marker-radius-outline" size={25} color={typeof color === 'string' ? color : colors.purple} /> }} />
      <Tabs.Screen name="seasons" options={{ title: 'Seasons', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="calendar-month-outline" size={25} color={typeof color === 'string' ? color : colors.purple} /> }} />
      <Tabs.Screen name="submit" options={{ title: 'Submit', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="plus-circle" size={33} color={typeof color === 'string' ? color : colors.purple} /> }} />
      <Tabs.Screen name="alerts" options={{ title: 'Alerts', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="bell-outline" size={25} color={typeof color === 'string' ? color : colors.purple} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-outline" size={25} color={typeof color === 'string' ? color : colors.purple} /> }} />
    </Tabs>
  );
}
