import { create } from "zustand";

interface ModalAppointmentDetailsStore {
  showModal: boolean;

  openModalAppointmentDetails: () => void;
  hideModal: () => void;
}

export const useModalAppointmentDetailsStore = create<ModalAppointmentDetailsStore>((set) => ({
  showModal: false,

  openModalAppointmentDetails() {
    set({ showModal: true });
  },

  hideModal() {
    set({ showModal: false });
  },
}));