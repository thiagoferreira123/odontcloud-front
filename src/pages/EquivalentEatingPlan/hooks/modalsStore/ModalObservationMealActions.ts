import { CreateModalStore, ModalObservationMealActions } from "./types";

export const useModalObservationMealActions = (
  // eslint-disable-next-line no-unused-vars
  set: (partial: (state: CreateModalStore) => Partial<CreateModalStore>) => void
) => (<ModalObservationMealActions>{
  showModalObservationMeal: false,
  setShowModalObservationMeal: (show: boolean) =>
    set(() => {
      return { showModalObservationMeal: show };
    }),
})