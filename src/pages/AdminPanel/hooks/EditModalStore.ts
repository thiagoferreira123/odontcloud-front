import { create } from "zustand";
import { Adminpanel } from "./AdminpanelStore/types";

interface CreateAdminpanelModalStore {
  showModal: boolean;

  selectedAdminpanel: Adminpanel | null;

  hideModal: () => void;
  handleSelectAdminpanelToEdit: (adminpanel : Adminpanel) => void;
  handleChangeAdminpanel: (adminpanel : Partial<Adminpanel>) => void;
  handleShowCreateAdminpanelModal: () => void;
}

export const useCreateAdminpanelModalStore = create<CreateAdminpanelModalStore>((set) => ({
  showModal: false,
  selectedAdminpanel: null,

  hideModal: () => {
    set({ showModal: false, selectedAdminpanel: null });
  },

  handleSelectAdminpanelToEdit: (adminpanel ) => {
    set({ selectedAdminpanel: adminpanel , showModal: true });
  },

  handleChangeAdminpanel: (adminpanel ) => {
    set(state => {
      if (!state.selectedAdminpanel) return state;
      return { selectedAdminpanel: { ...state.selectedAdminpanel, ...adminpanel  } }
    });
  },

  handleShowCreateAdminpanelModal: () => {
    set({ showModal: true, selectedAdminpanel: null });
  },
}));