import { create } from "zustand";

interface WebcamPermissionModalStore {
  showModal: boolean;

  showWebcamPermissionModal: () => void;
  hideModal: () => void;
}

export const useWebcamPermissionModalStore = create<WebcamPermissionModalStore>((set) => ({
  showModal: false,

  showWebcamPermissionModal: () => set({ showModal: true }),
  hideModal: () => set({ showModal: false }),
}));