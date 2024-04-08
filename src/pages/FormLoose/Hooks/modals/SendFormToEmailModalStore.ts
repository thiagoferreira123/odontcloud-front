import { create } from "zustand";

interface SendFormToEmailModalStore {
  showModal: boolean;

  selectedFormKey: string | null;

  // eslint-disable-next-line no-unused-vars
  handleSendFormToEmail: (formKey: string) => void;
  hideModal: () => void;
}

export const useSendFormToEmailModalStore = create<SendFormToEmailModalStore>((set) => ({
  showModal: false,

  selectedFormKey: null,

  handleSendFormToEmail(selectedFormKey) {
    set({ selectedFormKey, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedFormKey: null });
  },
}));