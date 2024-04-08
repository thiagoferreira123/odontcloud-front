import { create } from "zustand";
import { CommentTemplate } from "./MyCommentStore";

interface ModalStore {
  selectedComment: CommentTemplate | null;
  showDeleteConfirmation: boolean;

  setSelectedComment: (food: CommentTemplate | null) => void;
  setShowDeleteConfirmation: (show: boolean) => void;
  handleShowDeleteConfirmationModal: (food: CommentTemplate) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  selectedComment: null,
  showDeleteConfirmation: false,

  setSelectedComment: (food) => set({ selectedComment: food }),
  setShowDeleteConfirmation: (show) => set({ showDeleteConfirmation: show }),
  handleShowDeleteConfirmationModal: (orientation) => set({ showDeleteConfirmation: true, selectedComment: orientation}),
}));