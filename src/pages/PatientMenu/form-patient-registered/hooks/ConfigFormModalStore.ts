import { create } from "zustand";
import { AnsweredForm } from "../../../../types/FormBuilder";

interface ConfigFormModalStore {
  showModal: boolean;
  selectedForm: AnsweredForm | null;

  handleSelectForm: (form: AnsweredForm) => void;
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