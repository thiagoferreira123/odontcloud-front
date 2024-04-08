import { create } from "zustand";
import { AnsweredForm } from "../../../../types/FormBuilder";

export enum AnswerTypes {
  // eslint-disable-next-line no-unused-vars
  NAO_CADASTRADO = 'NAO_CADASTRADO',
  // eslint-disable-next-line no-unused-vars
  CADASTRADO = 'CADASTRADO',
}

interface ConfirmDeleteAnswerModalStore {
  showModal: boolean;
  type: AnswerTypes;

  selectedAnsweredForm: AnsweredForm | null;

  // eslint-disable-next-line no-unused-vars
  handleDeleteAnsweredForm: (expenditure: AnsweredForm, type: AnswerTypes) => void;
  hideModal: () => void;
}

export const useConfirmDeleteAnswerModalStore = create<ConfirmDeleteAnswerModalStore>((set) => ({
  showModal: false,
  type: AnswerTypes.CADASTRADO,

  selectedAnsweredForm: null,

  handleDeleteAnsweredForm(expenditure, type) {
    set({ selectedAnsweredForm: expenditure, type, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedAnsweredForm: null });
  },
}));