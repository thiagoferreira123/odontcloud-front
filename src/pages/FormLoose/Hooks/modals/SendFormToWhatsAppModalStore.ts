import { create } from "zustand";

interface SendFormToWhatsAppModalStore {
  showModal: boolean;

  selectedFormKey: string | null;

  // eslint-disable-next-line no-unused-vars
  handleSendFormToWhatsApp: (formKey: string) => void;
  hideModal: () => void;
}

export const useSendFormToWhatsAppModalStore = create<SendFormToWhatsAppModalStore>((set) => ({
  showModal: false,

  selectedFormKey: null,

  handleSendFormToWhatsApp(selectedFormKey) {
    set({ selectedFormKey, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedFormKey: null });
  },
}));