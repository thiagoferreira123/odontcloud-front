import { create } from "zustand";
import { ForumTopic } from "../ForumTopicStore/types";

interface DeleteConfirmationModalStore {
  showModal: boolean;

  selectedForum: ForumTopic | null;

  // eslint-disable-next-line no-unused-vars
  handleSelectForumToRemove: (expenditure: ForumTopic) => void;
  hideModal: () => void;
}

export const useDeleteConfirmationModalStore = create<DeleteConfirmationModalStore>((set) => ({
  showModal: false,

  selectedForum: null,

  handleSelectForumToRemove(expenditure) {
    set({ selectedForum: expenditure, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedForum: null });
  },
}));