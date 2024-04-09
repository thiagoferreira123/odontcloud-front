import { create } from "zustand";
import { ClinicProcedure } from "./ClinicProcedureStore/types";

interface DeleteProcedureConfirmationModalStore {
  showModal: boolean;

  selectedClinicProcedure: ClinicProcedure | null;

  handleSelectClinicProcedureToRemove: (expenditure: ClinicProcedure) => void;
  hideModal: () => void;
}

export const useDeleteProcedureConfirmationModalStore = create<DeleteProcedureConfirmationModalStore>((set) => ({
  showModal: false,

  selectedClinicProcedure: null,

  handleSelectClinicProcedureToRemove(expenditure) {
    set({ selectedClinicProcedure: expenditure, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedClinicProcedure: null });
  },
}));