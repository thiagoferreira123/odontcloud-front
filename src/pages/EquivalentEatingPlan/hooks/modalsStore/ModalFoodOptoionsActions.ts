import { CreateModalStore, ModalFoodOptoionsActions } from "./types";

export const useModalFoodOptoionsActions = (
  // eslint-disable-next-line no-unused-vars
  set: (partial: (state: CreateModalStore) => Partial<CreateModalStore>) => void
) => (<ModalFoodOptoionsActions>{
  showModalFoodOptions: false,
  setShowModalFoodOptions: (show: boolean) =>
    set(() => {
      return { showModalFoodOptions: show };
    }),
})