import { CreateModalStore, ModalSendPDFActions } from "./types";

export const useModalSendPDFActions = (
  // eslint-disable-next-line no-unused-vars
  set: (partial: (state: CreateModalStore) => Partial<CreateModalStore>) => void
) => (<ModalSendPDFActions>{
  showModalSendPDF: false,
  setShowModalSendPDF: (show: boolean) =>
    set(() => {
      return { showModalSendPDF: show };
    }),
})