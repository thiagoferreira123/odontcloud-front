import { create } from "zustand";
import { Attachment } from ".";

interface DeleteAttachmentConfirmationModalStore {
  selectedAttachment: Attachment | null;
  showModal: boolean;

  // eslint-disable-next-line no-unused-vars
  handleSelectAttachmentToDelete: (meal: Attachment) => void;
  closeModal: () => void;
}

export const useDeleteAttachmentConfirmationModal = create<DeleteAttachmentConfirmationModalStore>(set => ({
  selectedAttachment: null,
  showModal: false,

  handleSelectAttachmentToDelete: (selectedAttachment) => set({ selectedAttachment, showModal: true }),
  closeModal: () => set({ showModal: false, selectedAttachment: null }),
}))