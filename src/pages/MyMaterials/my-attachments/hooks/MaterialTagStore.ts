import { create } from "zustand";
import api from "../../../../services/useAxios";

export interface MaterialTag {
  id?: number,
  tag: string,
  professional_id?: number
}

interface MaterialTagStore {
  getMaterialTags: () => Promise<MaterialTag[] | false>;
}

export const useMaterialTagStore = create<MaterialTagStore>(() => ({
  getMaterialTags: async () => {
    try {
      const { data } = await api.get<MaterialTag[]>('/material-cadastrado-pelo-profissional-tag');

      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
}));