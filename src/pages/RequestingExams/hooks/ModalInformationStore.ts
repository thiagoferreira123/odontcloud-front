import { Exam } from "/src/types/RequestingExam";
import { create } from "zustand";

interface ModalInformationStore {
  showModal: boolean;
  selectedExam: Exam | null;
  // eslint-disable-next-line no-unused-vars
  hideModal: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectExam: (exam: Exam) => void;
}

export const useModalInformationStore = create<ModalInformationStore>((set) => ({
  showModal: false,
  selectedExam: null,

  hideModal: () => set({ showModal: false }),
  handleSelectExam: (exam) => set({ selectedExam: exam, showModal: true })
}));