import { create } from "zustand";
import { ForumTopicAnswer } from "../ForumTopicStore/types";

interface EditAnswerModalStore {
  showModal: boolean;
  selectedComment: ForumTopicAnswer | null;

  handleSelectCommentToEdit: (comment: ForumTopicAnswer) => void;
  hideModal: () => void;
}

export const useEditAnswerModalStore = create<EditAnswerModalStore>((set) => ({
  showModal: false,
  selectedComment: null,

  handleSelectCommentToEdit(comment) {
    set({ selectedComment: comment, showModal: true });
  },

  hideModal() {
    set({ showModal: false, });
  },
}));