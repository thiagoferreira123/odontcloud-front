import { create } from "zustand";
import { FormEventModel } from "..";

interface DeleteScheduleConfirmationModalStore {
  showModal: boolean;

  selectedSchedule: FormEventModel | null;

  handleSelectScheduleToRemove: (schedule: FormEventModel) => void;
  hideModal: () => void;
}

export const useDeleteScheduleConfirmationModalStore = create<DeleteScheduleConfirmationModalStore>((set) => ({
  showModal: false,

  selectedSchedule: null,

  handleSelectScheduleToRemove(selectedSchedule) {
    set({ selectedSchedule, showModal: true });
  },

  hideModal() {
    set({ showModal: false });
  },
}));