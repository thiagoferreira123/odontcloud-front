import { Exam } from "/src/types/RequestingExam";
import { create } from "zustand";

interface ModalDeleteConfirmationStore {
  selectedExam: Exam | null;
  showModal: boolean;

  // eslint-disable-next-line no-unused-vars
  handleDeleteExamConfirm: (exam: Exam) => void;
  // eslint-disable-next-line no-unused-vars
  setSelectedExam: (exam: Exam | null) => void;
  hideModal: () => void;
}

export const useModalDeleteConfirmationStore = create<ModalDeleteConfirmationStore>((set) => ({
  selectedExam: null,
  showModal: false,

  handleDeleteExamConfirm: (exam) => {
    set({ selectedExam: exam, showModal: true });
  },
  setSelectedExam: (exam) => {
    set({ selectedExam: exam });
  },

  hideModal: () => {
    set({ showModal: false });
  }
}));