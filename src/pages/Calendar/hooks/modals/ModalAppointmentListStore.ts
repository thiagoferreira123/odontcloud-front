import { create } from "zustand";

interface ModalAppointmentListStore {
  showModal: boolean;

  openModalAppointmentList: () => void;
  hideModal: () => void;
}

export const useModalAppointmentListStore = create<ModalAppointmentListStore>((set) => ({
  showModal: false,

  openModalAppointmentList() {
    set({ showModal: true });
  },

  hideModal() {
    set({ showModal: false });
  },
}));