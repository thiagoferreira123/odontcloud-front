import { create } from 'zustand';
import { SignsSymptoms, SignsSymptomsStore } from './types';
import { AxiosError } from 'axios';
import api from '../../../../services/useAxios';
import { notify } from '../../../../components/toast/NotificationIcon';

const useSignsSymptomsStore = create<SignsSymptomsStore>((set) => ({
  getSignsSymptom: async (id) => {
    try {
      const response = await api.get(`/sinais-sintomas/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  updateSignsSymptom: async (registerDetails, queryClient) => {
    try {
      await api.put<SignsSymptoms>(`/sinais-sintomas/${registerDetails.id}`, registerDetails);

      queryClient.setQueryData<SignsSymptoms[]>(['sinais-sintomas', registerDetails.patient_id], (oldData) =>
        oldData ? oldData.map(detail => detail.id === registerDetails.id ? { ...detail, ...registerDetails } : detail) : []
      );

      notify('Sinais e sintomas atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar sinais e sintomas ', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
}));

export default useSignsSymptomsStore;
