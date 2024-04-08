import { create } from "zustand";
import api from "../../../services/useAxios";

interface NutritionalBlade {
  id: string,
  titulo: string,
  descricao: string,
  link_aws?: string,
  imagem_previa: string
}

interface NutritionalBladesState {
  getNutritionalBlades: () => Promise<NutritionalBlade[] | false>;
}


export const useNutritionalBlades = create<NutritionalBladesState>((set) => ({
  getNutritionalBlades: async () => {
    try {
      const { data } = await api.get('/laminas');

      return data;
    } catch (error) {
      console.error('Error fetching nutritional blades:', error);
      return false;
    }
  }
}));