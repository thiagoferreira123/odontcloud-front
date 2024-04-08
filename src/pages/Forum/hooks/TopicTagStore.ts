import { create } from 'zustand';
import api from '../../../services/useAxios';
import { handleAxiosArrayContentError } from '../../../helpers/ErrorHelpers';

interface TopicTagStore {
  getTopicTags: () => Promise<ForumTopicTag[] | false>;
}

export interface ForumTopicTag{
  id: number;
  nome: string;
}

const useTopicTagStore = create<TopicTagStore>(() => ({
  getTopicTags: async () => {
    try {
      const response = await api.get('/forum-nutricional-tag/');
      return response.data;
    } catch (error) {
      return handleAxiosArrayContentError<ForumTopicTag[] | false>(error, 'Erro ao buscar tags');
    }
  },
}));

export default useTopicTagStore;
