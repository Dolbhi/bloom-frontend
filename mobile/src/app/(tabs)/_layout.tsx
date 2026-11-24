import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs, type BottomTabNavigationOptions } from 'expo-router/js-tabs';
import type { ComponentProps } from 'react';

import { BloomBottomNavigation } from '@/components/BloomBottomNavigation';
import { colors } from '@/theme/colors';

function tabIcon(
  name: ComponentProps<typeof MaterialCommunityIcons>['name'],
): NonNullable<BottomTabNavigationOptions['tabBarIcon']> {
  return ({ color, size }) => (
    <MaterialCommunityIcons name={name} color={typeof color === 'string' ? color : colors.purple} size={size} />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BloomBottomNavigation {...props} />}
    >
      <Tabs.Screen name="(map)" options={{ title: 'Map', tabBarIcon: tabIcon('map-marker-radius-outline') }} />
      <Tabs.Screen name="seasons" options={{ title: 'Seasons', tabBarIcon: tabIcon('calendar-month-outline') }} />
      <Tabs.Screen name="submit" options={{ title: 'Submit', tabBarIcon: tabIcon('plus') }} />
      <Tabs.Screen name="alerts" options={{ title: 'Alerts', tabBarIcon: tabIcon('bell-outline') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: tabIcon('account-outline') }} />
    </Tabs>
  );
}
