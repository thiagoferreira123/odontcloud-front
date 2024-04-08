import { create } from "zustand";
import { DiaryFoodRegister } from "../../../../types/FoodDiary";
import api from "../../../../services/useAxios";
import { QueryClient } from "@tanstack/react-query";

interface ModalIPreviewStore {
  selectedRegister: DiaryFoodRegister | null;
  showModal: boolean;

  // eslint-disable-next-line no-unused-vars
  handleSelectRegister: (register: DiaryFoodRegister) => void;
  // eslint-disable-next-line no-unused-vars
  handleUpdateComment: (comment: string) => void;
  // eslint-disable-next-line no-unused-vars
  persistComment: (queryClient: QueryClient) => Promise<boolean>;
  handleCloseModal: () => void;
}

export const useModalIPreviewStore = create<ModalIPreviewStore>((set) => ({
  selectedRegister: null,
  showModal: false,

  handleSelectRegister: (register) => {
    set({ selectedRegister: register, showModal: true });
  },
  handleUpdateComment: (comentario_nutricionista) => {

    set((state) => {
      if (!state.selectedRegister) return state;

      return { selectedRegister: { ...state.selectedRegister, comentario_nutricionista } }
    });
  },
  persistComment: async (queryClient) => {
    return new Promise<boolean>((resolve) => {
      try {
        set(state => {
          queryClient.setQueryData(['getFoodDiary'], (registers: DiaryFoodRegister[]) => {
            const updatedExams = registers.map((e) => {
              if (e.id === state.selectedRegister?.id) {
                return state.selectedRegister;
              }

              return e;
            });

            return [...updatedExams];
          });

          api.put(`/registro-alimentar/${state.selectedRegister?.id}`, { comentario_nutricionista: state.selectedRegister?.comentario_nutricionista }).then(() => {
            return resolve(true);
          }).catch(() => {
            return resolve(false);
          });
          return state;
        });

        return;
      } catch (error) {
        console.error(error);
        return resolve(false);
      }
    });
  },

  handleCloseModal: () => {
    set({ selectedRegister: null, showModal: false });
  },
}));