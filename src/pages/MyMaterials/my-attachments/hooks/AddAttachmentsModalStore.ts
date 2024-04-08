import { create } from "zustand";
import { Attachment } from ".";

interface AddAttachmentsModalStore {
  selectedAttachment: Attachment | null;
  showModal: boolean;

  // eslint-disable-next-line no-unused-vars
  handleSelectAttachmentToEdit: (meal: Attachment) => void;
  openModal: () => void;
  closeModal: () => void;
}

export const useAddAttachmentsModalStore = create<AddAttachmentsModalStore>(set => ({
  selectedAttachment: null,
  showModal: false,

  handleSelectAttachmentToEdit: (selectedAttachment) => set({ selectedAttachment, showModal: true }),
  openModal: () => set({ showModal: true, selectedAttachment: null }),
  closeModal: () => set({ showModal: false, selectedAttachment: null }),
}))