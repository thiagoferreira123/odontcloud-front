import { create } from "zustand";
import { ForumTopicAnswer, ForumTopicAnswerComment } from "../ForumTopicStore/types";

interface CommentAnswerModalStore {
  showModal: boolean;
  selectedCommentAnswer: ForumTopicAnswerComment | null;
  selectedComment: ForumTopicAnswer | null;

  handleSelectCommentAnswer: (answer: ForumTopicAnswerComment | null, comment: ForumTopicAnswer) => void;
  handleSelectComment: (comment: ForumTopicAnswer) => void;
  handleShowModal: () => void;
  hideModal: () => void;
}

export const useCommentAnswerModalStore = create<CommentAnswerModalStore>((set) => ({
  showModal: false,
  selectedCommentAnswer: null,
  selectedComment: null,

  handleSelectCommentAnswer(answer, comment) {
    set({ selectedCommentAnswer: answer, selectedComment: comment, showModal: true });
  },

  handleSelectComment(comment) {
    set({ selectedCommentAnswer: null, selectedComment: comment, showModal: true });
  },

  handleShowModal() {
    set({ showModal: true, selectedCommentAnswer: null });
  },

  hideModal() {
    set({ showModal: false, selectedCommentAnswer: null });
  },
}));