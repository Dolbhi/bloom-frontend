import { mockPlants } from '../data/mockPlants';
import type { Plant } from '../types/plant';

/** The UI depends on this interface, not fetch() or backend-specific responses. */
export interface PlantApi {
  listPlants(): Promise<Plant[]>;
  getPlantById(id: string): Promise<Plant | null>;
}

const mockPlantApi: PlantApi = {
  async listPlants() {
    return mockPlants;
  },
  async getPlantById(id) {
    return mockPlants.find((plant) => plant.id === id) ?? null;
  },
};

// TODO (backend integration): implement PlantApi using agreed endpoints and
// map backend DTOs to Plant. Change just this export when the API is ready.
export const plantApi: PlantApi = mockPlantApi;
