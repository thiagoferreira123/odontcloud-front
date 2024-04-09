import { create } from "zustand";
import { Procedure } from "./CarePlanStore/types";

interface ModalNewProcedureStore {
  showModal: boolean;
  showOnlyClinicProcedures: boolean;

  selectedProcedure: Procedure | null;

  setShowOnlyClinicProcedures: (showOnlyClinicProcedures: boolean) => void;
  hideModal: () => void;
  handleSelectProcedureToEdit: (Procedure: Procedure) => void;
  handleChangeProcedure: (Procedure: Partial<Procedure>) => void;
  handleShowModalNewProcedure: () => void;
}

export const useModalNewProcedureStore = create<ModalNewProcedureStore>((set) => ({
  showModal: false,
  selectedProcedure: null,
  showOnlyClinicProcedures: false,

  setShowOnlyClinicProcedures: (showOnlyClinicProcedures) => {
    set({ showOnlyClinicProcedures });
  },
  hideModal: () => {
    set({ showModal: false, selectedProcedure: null });
  },

  handleSelectProcedureToEdit: (Procedure) => {
    set({ selectedProcedure: Procedure, showModal: true });
  },

  handleChangeProcedure: (Procedure) => {
    set(state => {
      if (!state.selectedProcedure) return state;
      return { selectedProcedure: { ...state.selectedProcedure, ...Procedure } }
    });
  },

  handleShowModalNewProcedure: () => {
    set({ showModal: true, selectedProcedure: null });
  },
}));