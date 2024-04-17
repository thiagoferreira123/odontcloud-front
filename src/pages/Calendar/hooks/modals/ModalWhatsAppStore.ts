import { create } from "zustand";

interface ModalWhatsAppStore {
  showModal: boolean;

  checkSession: (userId: string) => Promise<boolean>;
  deleteSession: (userId: string) => Promise<void>;
  openModalWhatsApp: () => void;
  hideModal: () => void;
}

export const useModalWhatsAppStore = create<ModalWhatsAppStore>((set) => ({
  showModal: false,

  checkSession: async (userId) => {
    try {
      const response = await fetch(`http://calendar-alert.dietsystem.com.br/check-session/${userId}`);

      return response.status === 200 ? true : false;
    } catch (error) {
      if (error instanceof Response && error.status === 404) return false;

      console.error(error);

      throw error;
    }
  },
  deleteSession: async (userId) => {
    try {
      await fetch(`http://calendar-alert.dietsystem.com.br/delete-session/${userId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(error);

      throw error;
    }
  },
  openModalWhatsApp() {
    set({ showModal: true });
  },

  hideModal() {
    set({ showModal: false });
  },
}));