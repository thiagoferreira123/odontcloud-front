import { create } from "zustand";
import { Secretary } from "../../../../hooks/professional/SecretaryStore";

interface ModalAddSecretaryStore {
  showModal: boolean;
  selectedSecretary: Secretary | null;

  // eslint-disable-next-line no-unused-vars
  handleShowModalAddSecretaryStore: () => void;
  handleHideModal: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectSecretary: (local: Secretary) => void;
}

export const useModalAddSecretaryStore = create<ModalAddSecretaryStore>((set) => ({
  showModal: false,
  selectedSecretary: null,

  handleShowModalAddSecretaryStore: () => set({ showModal: true, selectedSecretary: null }),
  handleHideModal: () => set({ showModal: false, selectedSecretary: null }),
  handleSelectSecretary: (local) => set({ selectedSecretary: local, showModal: true}),
}));