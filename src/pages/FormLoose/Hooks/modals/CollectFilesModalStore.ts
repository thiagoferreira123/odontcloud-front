import { create } from "zustand";
import { AnsweredForm } from "../../../../types/FormBuilder";

interface CollectFilesModalStore {
  showModal: boolean;

  selectedForm: AnsweredForm | null;

  // eslint-disable-next-line no-unused-vars
  handleSelectFormToCollectFiles: (formKey: AnsweredForm) => void;
  hideModal: () => void;
}

export const useCollectFilesModalStore = create<CollectFilesModalStore>((set) => ({
  showModal: false,

  selectedForm: null,

  handleSelectFormToCollectFiles(selectedForm) {
    set({ selectedForm, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedForm: null });
  },
}));