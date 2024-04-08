import { CreateModalStore, ModalReplacementListsActions } from "./types";

export const useModalReplacementListsActions = (
  // eslint-disable-next-line no-unused-vars
  set: (partial: (state: CreateModalStore) => Partial<CreateModalStore>) => void
) => (<ModalReplacementListsActions>{
  showModalReplacementLists: false,
  setShowModalReplacementLists: (show: boolean) =>
    set(() => {
      return { showModalReplacementLists: show };
    }),
})