import { MetabolicTracking } from '../../MetabolicTrakingLooseResponse/hooks/types';
import { create } from "zustand";

interface ConfirmDeleteTrackingModalStore {
  showModal: boolean;

  selectedMetabolicTracking: MetabolicTracking | null;

  // eslint-disable-next-line no-unused-vars
  handleDeleteMetabolicTracking: (MetabolicTracking: MetabolicTracking) => void;
  hideModal: () => void;
}

export const useConfirmDeleteTrackingModalStore = create<ConfirmDeleteTrackingModalStore>((set) => ({
  showModal: false,

  selectedMetabolicTracking: null,

  handleDeleteMetabolicTracking(selectedMetabolicTracking) {
    set({ selectedMetabolicTracking, showModal: true });
  },

  hideModal() {
    set({ showModal: false, selectedMetabolicTracking: null });
  },
}));