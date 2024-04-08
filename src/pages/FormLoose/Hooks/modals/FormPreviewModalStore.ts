import { create } from "zustand";
import { AnsweredForm } from "../../../../types/FormBuilder";

export enum AnswerTypes {
  NAO_CADASTRADO = 'NAO_CADASTRADO',
  CADASTRADO = 'CADASTRADO',
}

interface FormPreviewModalStore {
  showModal: boolean;

  selectedAnsweredForm: AnsweredForm | null;

  handlePreviewAnsweredForm: (answer: AnsweredForm) => void;
  hideModal: () => void;
}

export const useFormPreviewModalStore = create<FormPreviewModalStore>((set) => ({
  showModal: false,
  type: AnswerTypes.CADASTRADO,

  selectedAnsweredForm: null,

  handlePreviewAnsweredForm(answer) {
    set({ selectedAnsweredForm: answer, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedAnsweredForm: null });
  },
}));