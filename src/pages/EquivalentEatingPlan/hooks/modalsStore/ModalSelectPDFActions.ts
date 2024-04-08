import { CreateModalStore, ModalSelectPDFActions } from "./types";

export const useModalSelectPDFActions = (
  // eslint-disable-next-line no-unused-vars
  set: (partial: (state: CreateModalStore) => Partial<CreateModalStore>) => void
) => (<ModalSelectPDFActions>{
  showModalSelectPDF: false,
  setShowModalSelectPDF: (show: boolean) =>
    set(() => {
      return { showModalSelectPDF: show };
    }),
})