import { create } from "zustand";

interface SendTrackingToWhatsAppModalStore {
  showModal: boolean;

  selectedTrackingKey: string | null;

  // eslint-disable-next-line no-unused-vars
  handleShowSendTrackingToWppModal: (formKey: string) => void;
  hideModal: () => void;
}

export const useSendTrackingToWhatsAppModalStore = create<SendTrackingToWhatsAppModalStore>((set) => ({
  showModal: false,

  selectedTrackingKey: null,

  handleShowSendTrackingToWppModal(selectedTrackingKey) {
    set({ selectedTrackingKey, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedTrackingKey: null });
  },
}));