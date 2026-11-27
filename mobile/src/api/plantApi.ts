import { mockPlants } from '../data/mockPlants';
import type { Plant } from '../types/plant';

/** The UI depends on this interface, not fetch() or backend-specific responses. */
export interface PlantApi {
  listPlants(): Promise<Plant[]>;
  getPlantById(id: string): Promise<Plant | null>;
}

type PlantRecord = {
  id: number;
  common_name: string;
  scientific_name: string | null;
  description: string;
};

type PlantDetailRecord = PlantRecord & {
  hero_photo_url: string | null;
  prediction: {
    summary: string;
    bloom_status: string;
  } | null;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const plantsUrl = `${API_URL.replace(/\/+$/, "")}/plants`;

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Plant API request failed (${response.status})`);
  }
  return (await response.json()) as T;
}

function toPlant(
  record: PlantRecord,
  details?: Pick<PlantDetailRecord, "hero_photo_url" | "prediction">,
): Plant {
  return {
    id: String(record.id),
    name: record.common_name,
    scientificName: record.scientific_name ?? "Scientific name unavailable",
    description: record.description,
    category: 'Trees',
    location: "Location unavailable",
    distanceKm: 0,
    photo: require('../../assets/mock/cherry.jpg'),
    bloomMonths: [],
    bloomWindow: details?.prediction?.summary ?? "No bloom data available",
    bloomStatus: details?.prediction?.bloom_status ?? "Unknown",
    pollenLevel: 'High',
    contributorNote: "No contributor notes available",
  };
}


export const plantApi: PlantApi = {
  async listPlants() {
    const records = await getJson<PlantRecord[]>(plantsUrl);
    return records.map((record) => toPlant(record));
  },

  async getPlantById(id) {
    const response = await fetch(`${plantsUrl}/${encodeURIComponent(id)}`);
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`Plant API request failed (${response.status})`);
    }

    const record = (await response.json()) as PlantDetailRecord;
    return toPlant(record, record);
  },
};