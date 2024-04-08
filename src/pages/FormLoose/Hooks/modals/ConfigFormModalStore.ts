import { create } from "zustand";
import { Form } from "../../../../types/FormBuilder";

interface ConfigFormModalStore {
  showModal: boolean;
  selectedForm: Form | null;

  handleSelectForm: (form: Form) => void;
  showConfigFormModal: () => void;
  hideModal: () => void;
}

export const useConfigFormModalStore = create<ConfigFormModalStore>((set) => ({
  showModal: false,
  selectedForm: null,

  handleSelectForm(form) {
    set({ selectedForm: form, showModal: true });
  },

  showConfigFormModal() {
    set({ showModal: true });
  },

  hideModal() {
    set({ showModal: false });
  },
}));