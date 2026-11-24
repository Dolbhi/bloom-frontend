import type { ImageSourcePropType } from 'react-native';

export type PlantCategory = 'Trees' | 'Flowers' | 'Shrubs';
export type PollenLevel = 'Low' | 'Moderate' | 'High';

// Shared UI model. Replace only the API adapter when the backend contract arrives.
export type Plant = {
  id: string;
  name: string;
  scientificName: string;
  category: PlantCategory;
  location: string;
  distanceKm: number; // illustrative until location services/backend are connected
  photo: ImageSourcePropType;
  bloomMonths: number[]; // 1 = January, 12 = December
  bloomWindow: string;
  bloomStatus: string;
  pollenLevel: PollenLevel; // illustrative, not a health forecast
  description: string;
  contributorNote: string;
};
