import { create } from "zustand";
import { ForumTopic } from "../ForumTopicStore/types";

interface CreateTopicModalStore {
  showModal: boolean;
  selectedTopic:ForumTopic | null;

  handleSelectTopic: (topic: ForumTopic) => void;
  handleShowModal: () => void;
  hideModal: () => void;
}

export const useCreateTopicModalStore = create<CreateTopicModalStore>((set) => ({
  showModal: false,
  selectedTopic: null,

  handleSelectTopic(topic) {
    set({ selectedTopic: topic, showModal: true });
  },

  handleShowModal() {
    set({ showModal: true, selectedTopic: null});
  },

  hideModal() {
    set({ showModal: false, selectedTopic: null});
  },
}));