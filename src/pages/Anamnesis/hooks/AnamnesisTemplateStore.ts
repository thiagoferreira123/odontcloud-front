import { create } from "zustand";
import api from "../../../services/useAxios";
import { notify } from "../../../components/toast/NotificationIcon";

export interface AnamnesisTemplate {
  id: number;
  data: Date;
  titulo: string;
  modelo: string;
  idProfissional: number;
}

type AnamnesisTemplateStore = {
  getAnamnesisTemplates: () => Promise<AnamnesisTemplate[] | false>;
};

export const useAnamnesisTemplateStore = create<AnamnesisTemplateStore>(() => ({
  getAnamnesisTemplates: async () => {
    try {
      const { data } = await api.get<AnamnesisTemplate[]>("/anamnese-modelo");

      return data;
    } catch (error) {
      console.error(error);
      notify("Erro ao buscar modelos de anamnese", "Erro", "close", "danger");
      return false;
    }
  }
}));
