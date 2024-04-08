import { CreateModalStore, ModalSeparateFoodsActions } from "./types";

export const useModalSeparateFoodsActions = (
  // eslint-disable-next-line no-unused-vars
  set: (partial: (state: CreateModalStore) => Partial<CreateModalStore>) => void
) => (<ModalSeparateFoodsActions>{
  showModalSeparateFoods: false,
  setShowModalSeparateFoods: (show: boolean) =>
    set(() => {
      return { showModalSeparateFoods: show };
    }),
})