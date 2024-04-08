import { Exam } from "/src/types/RequestingExam";
import { create } from "zustand";


interface ModalAddExamBloodStore {
  showModal: boolean;
  selectedExam: Exam | null;

  handleShowModal: () => void;
  handleHideModal: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectExam: (exam: Exam) => void;
}

export const useModalAddExamBloodStore = create<ModalAddExamBloodStore>((set) => ({
  showModal: false,
  selectedExam: null,

  handleShowModal: () => set({ showModal: true, selectedExam: null }),
  handleHideModal: () => set({ showModal: false, selectedExam: null }),
  handleSelectExam: (exam) => set({ selectedExam: exam, showModal: true}),
}));