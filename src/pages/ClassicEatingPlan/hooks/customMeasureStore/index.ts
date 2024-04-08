import api from "/src/services/useAxios";
import { create } from "zustand";

export interface CustomMeasure {
  id: number;
  name: string;
  grams: number;
}

interface CustomMeasureStore {
  measurements: CustomMeasure[];
  // eslint-disable-next-line no-unused-vars
  getMeasurements: () => Promise<CustomMeasure[]>;
  // eslint-disable-next-line no-unused-vars
  setMeasurements: (measurement: CustomMeasure[]) => void;
  // eslint-disable-next-line no-unused-vars
  addMeasurement: (measure: CustomMeasure) => void;
  // eslint-disable-next-line no-unused-vars
  removeMeasurement: (measure: CustomMeasure) => void;
}

export const useCustomMeasureStore = create<CustomMeasureStore>((set) => ({
  measurements: [],
  getMeasurements: async () => {

    const { data } = await api.get('/plano-alimentar-classico-medida-caseira-personalizada');

    if (data) {
      set({ measurements: data });
    }

    return data;
  },
  setMeasurements: (measurements) => set({ measurements }),
  addMeasurement: (measure) => set((state) => ({ measurements: [...state.measurements, measure] })),
  removeMeasurement: (measure) => set((state) => ({ measurements: state.measurements.filter((m) => m !== measure) })),
}));