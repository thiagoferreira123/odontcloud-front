import { CreateModalStore, ModalShoppingListActions } from "./types";

export const useModalShoppingListActions = (
  // eslint-disable-next-line no-unused-vars
  set: (partial: (state: CreateModalStore) => Partial<CreateModalStore>) => void
) => (<ModalShoppingListActions>{
  showModalShoppingList: false,
  setShowModalShoppingList: (show: boolean) =>
    set(() => {
      return { showModalShoppingList: show };
    }),
})