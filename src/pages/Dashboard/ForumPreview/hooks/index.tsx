import { create } from 'zustand';
import api from '../../../../services/useAxios';
import { ForumTopic } from '../../../Forum/hooks/ForumTopicStore/types';

interface ForumPreviewStore {
  getForumPreview: () => Promise<ForumTopic[] | false>;
}

export const useForumPreviewStore = create<ForumPreviewStore>(() => ({
  year: new Date().getFullYear().toString(),

  getForumPreview: async () => {
    try {
      const { data } = await api.get<ForumTopic[]>("/forum-nutricional/last-five");

      return data ?? false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
}));
