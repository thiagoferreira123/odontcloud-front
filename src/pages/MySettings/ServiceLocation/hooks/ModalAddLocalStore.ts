import { create } from "zustand";
import { Local } from "../../../../types/Events";

interface ModalAddLocalStore {
  showModal: boolean;
  selectedLocaltion: Local | null;

  // eslint-disable-next-line no-unused-vars
  handleShowModalAddLocalStore: () => void;
  handleHideModal: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectLocal: (local: Local) => void;
}

export const useModalAddLocalStore = create<ModalAddLocalStore>((set) => ({
  showModal: false,
  selectedLocaltion: null,

  handleShowModalAddLocalStore: () => set({ showModal: true, selectedLocaltion: null }),
  handleHideModal: () => set({ showModal: false, selectedLocaltion: null }),
  handleSelectLocal: (local) => set({ selectedLocaltion: local, showModal: true}),
}));