import { create } from 'zustand';
import { ForumTopic, ForumTopicFindAllResponse, ForumTopicStore } from './types';
import useForumTopicActions from './ForumTopicActions';
import useForumTopicAnswerActions from './ForumTopicAnswerActions';
import useForumTopicAnswerCommentActions from './ForumTopicAnswerCommentActions';
import useForumTopicAnswerLikeActions from './ForumTopicAnswerLikeActions';
import api from '../../../../services/useAxios';
import { handleAxiosArrayContentError } from '../../../../helpers/ErrorHelpers';

const useForumTopicStore = create<ForumTopicStore>((set) => ({
  getForumTopics: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/forum-nutricional/?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return handleAxiosArrayContentError<ForumTopicFindAllResponse | false>(error, 'Erro ao buscar tópicos do fórum');
    }
  },

  getForumTopic: async (id) => {
    try {
      const response = await api.get(`/forum-nutricional/${id}`);
      return response.data;
    } catch (error) {
      return handleAxiosArrayContentError<ForumTopic | false>(error, 'Erro ao buscar tópico');
    }
  },

  ...useForumTopicActions(),
  ...useForumTopicAnswerActions(),
  ...useForumTopicAnswerCommentActions(),
  ...useForumTopicAnswerLikeActions(),
}));

export default useForumTopicStore;
