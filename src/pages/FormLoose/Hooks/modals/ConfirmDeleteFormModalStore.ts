import { create } from "zustand";
import { Form } from "../../../../types/FormBuilder";

interface ConfirmDeleteFormModalStore {
  showModal: boolean;

  selectedForm: Form | null;

  // eslint-disable-next-line no-unused-vars
  handleDeleteForm: (form: Form) => void;
  hideModal: () => void;
}

export const useConfirmDeleteFormModalStore = create<ConfirmDeleteFormModalStore>((set) => ({
  showModal: false,

  selectedForm: null,

  handleDeleteForm(selectedForm) {
    set({ selectedForm, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedForm: null });
  },
}));