import api from "/src/services/useAxios";
import { SendingMaterial } from "/src/types/SendingMaterial";
import { create } from "zustand";

interface SendingMaterialsStore {
  materials: SendingMaterial[];

  // eslint-disable-next-line no-unused-vars
  getMaterials: (patientId: number, year: string, month: string) => Promise<SendingMaterial[]>;
  // eslint-disable-next-line no-unused-vars
  setMaterials: (materials: SendingMaterial[]) => void;
}

export const useSendingMaterialsStore = create<SendingMaterialsStore>((set) => ({
  materials: [],

  getMaterials: async (patientId, year, month) => {
    const { data } = await api.post(`/materiail-entregavel/period/patient`, {
      idPaciente: patientId,
      mes: month,
      ano: year,
    });
    set({ materials: data });
    return data;
  },

  setMaterials: (materials) => set({ materials }),
}));