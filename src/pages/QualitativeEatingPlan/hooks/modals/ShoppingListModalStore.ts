import { create } from "zustand";

interface ShoppingListModalStore {
  showModal: boolean;

  showShoppingListModal: () => void;
  closeModal: () => void;
}

export const useShoppingListModalStore = create<ShoppingListModalStore>(set => ({
  selectedMeal: null,
  showModal: false,

  showShoppingListModal: () => set({ showModal: true }),
  closeModal: () => set({ showModal: false }),
}))