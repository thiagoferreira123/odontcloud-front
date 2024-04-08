import { CreateModalStore, ModalPhotoMealActions } from "./types";

export const useModalPhotoMealActions = (
  // eslint-disable-next-line no-unused-vars
  set: (partial: (state: CreateModalStore) => Partial<CreateModalStore>) => void
) => (<ModalPhotoMealActions>{
  showModalPhotoMeal: false,
  setShowModalPhotoMeal: (show: boolean) =>
    set(() => {
      return { showModalPhotoMeal: show };
    }),
})