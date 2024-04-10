import { create } from "zustand";
import { Anamnesis } from "../../PatientMenu/anamnesis-patient/hooks/AnamnesisStore/types";

interface EditModalStore {
  showModal: boolean;

  selectedAnamnesis: Anamnesis | null;

  hideModal: () => void;
  handleSelectAnamnesisToEdit: (anamnesis: Anamnesis) => void;
  handleChangeAnamnesis: (anamnesis: Partial<Anamnesis>) => void;
  handleShowModal: () => void;
}

export const useEditModalStore = create<EditModalStore>((set) => ({
  showModal: false,
  selectedAnamnesis: null,

  hideModal: () => {
    set({ showModal: false, selectedAnamnesis: null });
  },

  handleSelectAnamnesisToEdit: (anamnesis) => {
    set({ selectedAnamnesis: anamnesis, showModal: true });
  },

  handleChangeAnamnesis: (anamnesis) => {
    set(state => {
      if (!state.selectedAnamnesis) return state;
      return { selectedAnamnesis: { ...state.selectedAnamnesis, ...anamnesis } }
    });
  },

  handleShowModal: () => {
    set({ showModal: true, selectedAnamnesis: null });
  },
}));