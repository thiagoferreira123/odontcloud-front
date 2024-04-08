import { create } from "zustand";
import { Anamnesis } from "../../../PatientMenu/anamnesis-patient/hooks/AnamnesisStore/types";
import { AnamnesisTemplate } from "../AnamnesisTemplateStore";
import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { QueryClient } from "@tanstack/react-query";

interface FavoriteAnamnesisModalStore {
  showModal: boolean;

  hideModal: () => void;
  showFavoriteAnamnesisModal: () => void;

  // eslint-disable-next-line no-unused-vars
  parseToAnamnesisTemplate: (titulo: string, anamnesis: Anamnesis, queryClient: QueryClient) => Promise<AnamnesisTemplate | false>;
}

export const useFavoriteAnamnesisModalStore = create<FavoriteAnamnesisModalStore>((set) => ({
  showModal: false,
  selectedAnamnesis: null,

  hideModal: () => {
    set({ showModal: false });
  },

  showFavoriteAnamnesisModal: () => {
    set({ showModal: true });
  },

  parseToAnamnesisTemplate: async (titulo, anamnesis, queryClient) => {
    try {
      const payload: Partial<AnamnesisTemplate> = {
        titulo,
        data: new Date(anamnesis.date),
        modelo: anamnesis.textFromAnamnesis ?? '',
      };

      const { data } = await api.post<AnamnesisTemplate>("/anamnese-modelo", payload);

      queryClient.setQueryData<AnamnesisTemplate[]>(['anamnesis-templates'], (oldData) => [...(oldData || []), data]);

      notify("Anamnese salva como modelo", "Sucesso", "check", "success");
      return data;
    } catch (error) {
      console.error(error);
      notify("Erro ao salvar anamnese como modelo", "Erro", "close", "danger");
      return false;
    }
  }
}));