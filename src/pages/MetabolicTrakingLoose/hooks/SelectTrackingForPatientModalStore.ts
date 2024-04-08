import { create } from "zustand";
import { MetabolicTracking } from "../../MetabolicTrakingLooseResponse/hooks/types";
import { Patient } from "../../../types/Patient";
import api from "../../../services/useAxios";
import { notify } from "../../../components/toast/NotificationIcon";
import { QueryClient } from "@tanstack/react-query";

interface SelectTrackingForPatientModalStore {
  query: string;
  showModal: boolean;

  selectedTracking: MetabolicTracking | null;

  // eslint-disable-next-line no-unused-vars
  setQuery: (query: string) => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectTracking: (tracking: MetabolicTracking) => void;
  hideModal: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectPatient: (patient: Patient, tracking: MetabolicTracking, queryClient: QueryClient) => Promise<boolean>;
}

export const useSelectTrackingForPatientModalStore = create<SelectTrackingForPatientModalStore>((set) => ({
  query: '',
  showModal: false,

  selectedTracking: null,

  setQuery: (query) => {
    set({ query });
  },
  handleSelectTracking: (tracking) => {
    set({ selectedTracking: tracking, showModal: true });
  },
  hideModal: () => {
    set({ selectedTracking: null, showModal: false });
  },
  handleSelectPatient: async (patient, tracking, queryClient) => {
    try {
      const payload: Partial<MetabolicTracking> = {
        tracking_full: tracking.tracking_full,
        patient_id: patient.id,
        key: null,
      }

      await api.put<MetabolicTracking>(`/rastreamemto-metabolico/${tracking.id}`, payload);

      queryClient.setQueryData<MetabolicTracking[]>(['metabolic-tracking-loose'], (oldData) => {
        if (!oldData) return [];

        return oldData.filter((item) => item.id !== tracking.id);
      });

      notify('Reastreamento coletado com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      console.error(error);
      notify('Erro ao coletar rastreamento', 'Erro', 'close', 'danger');
      return false;
    }
  }
}));