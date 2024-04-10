import { create } from "zustand";
import { PatientFile } from "../PatientFolderStore/types";

interface EditFileNameModalStore {
  showModal: boolean;
  selectedFile: PatientFile | null;

  // eslint-disable-next-line no-unused-vars
  handleSelectFile: (file: PatientFile) => void;
  hideModal: () => void;
}

export const useEditFileNameModalStore = create<EditFileNameModalStore>((set) => ({
  showModal: false,
  selectedFile: null,

  handleSelectFile: (file) => {
    set({ showModal: true, selectedFile: file });
  },
  hideModal: () => {
    set({ showModal: false, selectedFile: null });
  },
}));