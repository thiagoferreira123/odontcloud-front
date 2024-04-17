import { create } from "zustand";

interface ModalWhatsAppStore {
  showModal: boolean;

  checkSession: (clinicId: string) => Promise<boolean>;
  deleteSession: (clinicId: string) => Promise<void>;
  openModalWhatsApp: () => void;
  hideModal: () => void;
}

export const useModalWhatsAppStore = create<ModalWhatsAppStore>((set) => ({
  showModal: false,

  checkSession: async (clinicId) => {
    try {
      const response = await fetch(`http://localhost:3002/check-session/${clinicId}`);

      return response.status === 200 ? true : false;
    } catch (error) {
      if (error instanceof Response && error.status === 404) return false;

      console.error(error);

      throw error;
    }
  },
  deleteSession: async (clinicId) => {
    try {
      await fetch(`http://localhost:3002/delete-session/${clinicId}`, {
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