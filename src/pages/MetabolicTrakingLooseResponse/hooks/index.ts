import { create } from 'zustand';
import { MetabolicTracking, MetabolicTrackingStore, MetabolicTrackingSymptom } from './types';
import api from '../../../services/useAxios';
import { notify } from '../../../components/toast/NotificationIcon';

const useMetabolicTrackingStore = create<MetabolicTrackingStore>((set, get) => ({
  professional_id: 0,
  selectedSynptoms: [],

  getMetabolicTracking: async (key) => {
    try {
      const { data } = await api.get<MetabolicTracking>(`/rastreamemto-metabolico/key/${key}`);

      const professional_id = Number(get().professional_id) ? get().professional_id : data.professional_id ?? 0;

      set({ professional_id });

      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  setPatientData: (patientDetailData) => {
    set((state) => ({ ...state, ...patientDetailData }));
  },

  handleChangeSymptomNumber: (symptom) => {
    set((state) => {
      const selectedSynptoms = state.selectedSynptoms.filter((s) => s.id !== symptom.id);

      return { selectedSynptoms: [...selectedSynptoms, symptom] };
    });
  },

  createMetabolicTracking: async (metabolicTracking) => {
    try {

      if(!metabolicTracking.key) throw new Error('chave do rastreamento metabólico não informado');
      if(!metabolicTracking.professional_id) throw new Error('profissional do rastreamento metabólico não informado');

      await api.post<MetabolicTracking>("/rastreamemto-metabolico/", metabolicTracking);

      notify('Rastreamento metabólico respondido com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao responder rastreamento metabólico', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
}));

export default useMetabolicTrackingStore;
