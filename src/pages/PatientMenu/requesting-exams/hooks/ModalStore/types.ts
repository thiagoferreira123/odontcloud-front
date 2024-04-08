import { RequestingExam, RequestingExamAttachment } from "/src/types/RequestingExam";

export type ModalStore = {
  showDeleteConfirmationModal: boolean;

  selectedExam: RequestingExam | RequestingExamAttachment | null;

  // eslint-disable-next-line no-unused-vars
  handleSelectExam: (exam: RequestingExam | RequestingExamAttachment) => void;
} & ModalDeleteConfirmationActions;

export type ModalDeleteConfirmationActions = {
  hideDeleteConfirmationModal: () => void;
  // eslint-disable-next-line no-unused-vars
  handleDeleteExam: (exam: RequestingExam | RequestingExamAttachment) => void;
}