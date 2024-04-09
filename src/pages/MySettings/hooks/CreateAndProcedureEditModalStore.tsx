import { create } from "zustand";
import { ClinicProcedure } from "./ClinicProcedureStore/types";

interface CreateAndProcedureEditModalStore {
  showModal: boolean;

  selectedClinicProcedure: ClinicProcedure | null;

  handleSelectClinicProcedureToEdit: (expenditure: ClinicProcedure) => void;
  openCreateAndEditModal: () => void;
  hideModal: () => void;
}

export const useCreateAndProcedureEditModalStore = create<CreateAndProcedureEditModalStore>((set) => ({
  showModal: false,

  selectedClinicProcedure: null,

  handleSelectClinicProcedureToEdit(expenditure) {
    set({ selectedClinicProcedure: expenditure, showModal: true });
  },

  openCreateAndEditModal() {
    set({ showModal: true, selectedClinicProcedure: null });
  },

  hideModal() {
    set({ showModal: false, selectedClinicProcedure: null });
  },
}));