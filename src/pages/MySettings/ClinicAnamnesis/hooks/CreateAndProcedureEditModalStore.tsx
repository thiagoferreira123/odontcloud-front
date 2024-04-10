import { create } from "zustand";
import { ClinicAnamnesis } from "./ClinicAnamnesisStore/types";

interface CreateAndAnamnesisEditModalStore {
  showModal: boolean;

  selectedClinicAnamnesis: ClinicAnamnesis | null;

  handleSelectClinicAnamnesisToEdit: (expenditure: ClinicAnamnesis) => void;
  openCreateAndEditModal: () => void;
  handleChangeAnamnesis: (anamnesis: Partial<ClinicAnamnesis>) => void;
  hideModal: () => void;
}

export const useCreateAndAnamnesisEditModalStore = create<CreateAndAnamnesisEditModalStore>((set) => ({
  showModal: false,

  selectedClinicAnamnesis: null,

  handleSelectClinicAnamnesisToEdit(expenditure) {
    set({ selectedClinicAnamnesis: expenditure, showModal: true });
  },

  openCreateAndEditModal() {
    set({ showModal: true, selectedClinicAnamnesis: null });
  },

  handleChangeAnamnesis: (anamnesis) => {
    set(state => {
      if (!state.selectedClinicAnamnesis) return state;
      return { selectedClinicAnamnesis: { ...state.selectedClinicAnamnesis, ...anamnesis } }
    });
  },

  hideModal() {
    set({ showModal: false, selectedClinicAnamnesis: null });
  },
}));