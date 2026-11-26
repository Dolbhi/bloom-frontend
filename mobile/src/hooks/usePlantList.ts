import { useEffect, useState } from 'react';
import { plantApi } from '../api/plantApi';
import type { Plant } from '../types/plant';

type PlantListState =
  | { status: 'loading' | 'empty' | 'error'; plants?: never }
  | { status: 'success'; plants: Plant[] };

export function usePlantList() {
  const [state, setState] = useState<PlantListState>({ status: 'loading' });
  const { status } = state;

  useEffect(() => {
    if (status !== 'loading') return;
    let active = true;

    async function load() {
      try {
        const plants = await plantApi.listPlants();
        if (active) setState(plants.length ? { status: 'success', plants } : { status: 'empty' });
      } catch {
        if (active) setState({ status: 'error' });
      }
    }

    void load();
    return () => { active = false; };
  }, [status]);

  function retry() {
    setState((current) => current.status === 'error' ? { status: 'loading' } : current);
  }

  return { ...state, retry };
}
