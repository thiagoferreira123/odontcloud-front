import { CreateModalStore, ModalEmptyListAlertActions } from "./types";

export const useModalEmptyListAlertActions = (
  // eslint-disable-next-line no-unused-vars
  set: (partial: (state: CreateModalStore) => Partial<CreateModalStore>) => void
) => (<ModalEmptyListAlertActions>{
  showModalEmptyListAlert: false,
  setShowModalEmptyListAlert: (show: boolean) =>
    set(() => {
      return { showModalEmptyListAlert: show };
    }),
})