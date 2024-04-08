import { CreateModalStore, ModalDeleteMealActions } from "./types";

export const useModalDeleteMealActions = (
  // eslint-disable-next-line no-unused-vars
  set: (partial: (state: CreateModalStore) => Partial<CreateModalStore>) => void
) => (<ModalDeleteMealActions>{
  showModalDeleteMeal: false,
  setShowModalDeleteMeal: (show: boolean) =>
    set(() => {
      return { showModalDeleteMeal: show };
    }),
})