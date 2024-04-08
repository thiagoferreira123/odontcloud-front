import { create } from 'zustand';
import { MetabolicTracking, MetabolicTrackingStore, MetabolicTrackingSymptom } from './types';
import api from '../../../services/useAxios';
import { notify } from '../../../components/toast/NotificationIcon';

type AlertVariant = 'success' | 'warning' | 'danger' | 'primary';
type AlertMessage = string;
type AlertInfo = {
  variant: AlertVariant;
  message: AlertMessage;
};

export const getPontuationCount = (selectedSynptoms: MetabolicTrackingSymptom[]) => {
  return selectedSynptoms.reduce((acc, curr) => acc + curr.number, 0);
}

export function getAlertInfo(score: number): AlertInfo {
  const conditions: [number, number, AlertVariant, AlertMessage][] = [
    [0, 30, 'success', 'Saudável, com chances baixas de ter hipersensibilidade'],
    [31, 40, 'warning', 'Indicativo de existência de hipersensibilidade'],
    [41, 100, 'danger', 'Absoluta certeza de existência de hipersensibilidade'],
    [101, Infinity, 'danger', 'Pessoas com saúde muito ruim – alta dificuldade para executar tarefas diárias, pode estar associada à presença de outras doenças crônicas e degenerativas.'],
  ];

  const condition = conditions.find(([min, max]) => score >= min && score <= max);

  return condition
    ? { variant: condition[2], message: condition[3] }
    : { variant: 'primary', message: 'Valor não especificado corretamente.' };
}

const useMetabolicTrackingStore = create<MetabolicTrackingStore>((set, get) => ({
  selectedSynptoms: [],
  selectedId: 0,

  getMetabolicTracking: async (id) => {
    try {
      const { data } = await api.get<MetabolicTracking>(`/rastreamemto-metabolico/${id}`);

      const selectedSynptoms = get().selectedId == id && get().selectedSynptoms.length ? get().selectedSynptoms : data.tracking_full ? JSON.parse(data.tracking_full) : [];

      set({ selectedId: data.id, selectedSynptoms });

      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  handleChangeSymptomNumber: (symptom) => {
    set((state) => {
      const selectedSynptoms = state.selectedSynptoms.filter((s) => s.id !== symptom.id);

      return { selectedSynptoms: [...selectedSynptoms, symptom] };
    });
  },

  updateMetabolicTracking: async (metabolicTracking, queryClient) => {
    try {

      if(!metabolicTracking.id) throw new Error('ID do rastreamento metabólico não informado');

      const { data } = await api.put<MetabolicTracking>(`/rastreamemto-metabolico/${metabolicTracking.id}`, metabolicTracking);

      queryClient.setQueryData<MetabolicTracking>(['metabolic-tracking', metabolicTracking.id.toString()], (oldData) =>
        oldData ? { ...oldData, ...data } : data);

      notify('Rastreamento metabólico atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar rastreamento metabólico', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
}));

export default useMetabolicTrackingStore;
