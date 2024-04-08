import { create } from "zustand";
import api from "../../../services/useAxios";
import { NutritionalGuidance } from "../../PatientMenu/nutritional-guidance/hooks/types";

interface NutricionalGuidanceStore {
  getNutricionalGuidances: () => Promise<(NutritionalGuidance & { id: number })[] | false>;
  // eslint-disable-next-line no-unused-vars
  addNutritionalGuidance: (values: Partial<NutritionalGuidance>) => Promise<NutritionalGuidance | false>;
  // eslint-disable-next-line no-unused-vars
  updateNutritionalGuidance: (values: Partial<NutritionalGuidance> & { id: number } & { id: number }) => Promise<NutritionalGuidance | false>;
}

export const useNutricionalGuidanceStore = create<NutricionalGuidanceStore>(() => ({
  getNutricionalGuidances: async () => {
    try {
      const { data } = await api.get("/orientacao-nutricional/modelos/");
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  addNutritionalGuidance: async (values) => {
    try {
      const { data } = await api.post<NutritionalGuidance>("/orientacao-nutricional/", {...values, belonging_to_patient: 1});
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  updateNutritionalGuidance: async (values) => {
    try {
      const { data } = await api.patch(`/orientacao-nutricional/${values.id}/`, {...values, belonging_to_patient: 1});
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
}));