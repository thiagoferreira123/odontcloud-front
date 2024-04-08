import { create } from "zustand";

interface ModalConfigCalendarStore {
  showModal: boolean;

  openModalConfigCalendar: () => void;
  hideModal: () => void;
}

export const useModalConfigCalendarStore = create<ModalConfigCalendarStore>((set) => ({
  showModal: false,

  openModalConfigCalendar() {
    set({ showModal: true });
  },

  hideModal() {
    set({ showModal: false });
  },
}));