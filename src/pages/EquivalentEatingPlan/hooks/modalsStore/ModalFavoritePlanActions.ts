import { CreateModalStore, ModalFavoritePlanActions } from "./types";

export const useModalFavoritePlanActions = (
  // eslint-disable-next-line no-unused-vars
  set: (partial: (state: CreateModalStore) => Partial<CreateModalStore>) => void
) => (<ModalFavoritePlanActions>{
  showModalFavoritePlan: false,
  setShowModalFavoritePlan: (show: boolean) =>
    set(() => {
      return { showModalFavoritePlan: show };
    }),
})