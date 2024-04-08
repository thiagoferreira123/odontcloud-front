import { create } from 'zustand';
import api from '/src/services/useAxios';
import { FormStore } from './types';
import { AxiosError } from 'axios';
import useFormReplyActions from './FormReplyActions';

const useFormStore = create<FormStore>(() => ({
  getForm: async (key) => {
    try {
      const response = await api.get(`/fpc-cadastrado-pelo-profissional/${key}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return false;
    }
  },

  ...useFormReplyActions()

}));

export default useFormStore;
