import { AdultAntropometricData, AntropometricAssessmentHistory } from "/src/types/AntropometricAssessment";
import { create } from "zustand";

interface ModalSendPDFStore {
  showModal: boolean;
  selectedAssessments: Array<number | undefined>;

  // eslint-disable-next-line no-unused-vars
  setShowModalSendPdfEmail: (showModal: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  handleShowModal: (selectedAssessments: Array<AntropometricAssessmentHistory<AdultAntropometricData> | null>) => void;
}

export const useModalSendPDFStore = create<ModalSendPDFStore>((set) => ({
  showModal: false,
  selectedAssessments: [],

  setShowModalSendPdfEmail: (showModal) => set({ showModal }),
  handleShowModal: (selectedAssessments) => set((state) => ({
    showModal: !state.showModal,
    selectedAssessments: selectedAssessments.map((assessment) => assessment?.dados_geral_id)
  })),
}));