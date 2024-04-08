import { create } from 'zustand';
import api from '../../../services/useAxios';
import { handleAxiosArrayContentError } from '../../../helpers/ErrorHelpers';

interface TopicCategoryStore {
  getTopicCategorys: () => Promise<TopicCategory[] | false>;
}

export interface TopicCategory{
  id: number;
  nome: string;
}

const useTopicCategoryStore = create<TopicCategoryStore>(() => ({
  getTopicCategorys: async () => {
    try {
      const response = await api.get('/forum-nutricional-categoria/');
      return response.data;
    } catch (error) {
      return handleAxiosArrayContentError<TopicCategory[] | false>(error, 'Erro ao buscar tags');
    }
  },
}));

export default useTopicCategoryStore;
