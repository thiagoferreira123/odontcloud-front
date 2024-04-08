import { create } from "zustand";
import { ExamAnalyse } from "..";

interface ModalSendPDFStore {
  showModal: boolean;
  selectedExams: Array<string | undefined>;

  // eslint-disable-next-line no-unused-vars
  setShowModalSendPdfEmail: (showModal: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  handleShowModal: (selectedExams: Array<ExamAnalyse | null>) => void;
}

export const useModalSendPDFStore = create<ModalSendPDFStore>((set) => ({
  showModal: false,
  selectedExams: [],

  setShowModalSendPdfEmail: (showModal) => set({ showModal }),
  handleShowModal: (selectedExams) => set((state) => ({
    showModal: !state.showModal,
    selectedExams: selectedExams.map((exam) => exam?.id)
  })),
}));