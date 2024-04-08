import { CreateModalStore, ModalOrientationActions } from "./types";

export const useModalOrientationActions = (
  // eslint-disable-next-line no-unused-vars
  set: (partial: (state: CreateModalStore) => Partial<CreateModalStore>) => void
) => (<ModalOrientationActions>{
  showModalOrientation: false,
  setShowModalOrientation: (show: boolean) =>
    set(() => {
      return { showModalOrientation: show };
    }),
})