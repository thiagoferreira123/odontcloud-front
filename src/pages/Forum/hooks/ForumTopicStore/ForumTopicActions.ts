import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { ForumTopic, ForumTopicActions, ForumTopicFindAllResponse } from "./types";

const useForumTopicActions = (): ForumTopicActions => ({
  addForum: async (topic, queryClient, user) => {
    try {
      const { data } = await api.post<ForumTopic>('/forum-nutricional/', topic);

      queryClient.setQueryData<ForumTopicFindAllResponse>(['forum-topics', 1, 10], (oldContent) => {
        const dataContent = [{ ...data, professional: user }, ...(oldContent?.data || [])];

        return {
          ...oldContent,
          data: dataContent,
          pagination: {
            ...oldContent?.pagination, totalRecords: (oldContent?.pagination.totalRecords ?? 0) + 1,
            totalPages: Math.ceil((oldContent?.pagination.totalRecords ?? 0) / 10),
            currentPage: 1,
            pageSize: 10,
          },
        };
      });

      notify('Tópico adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar atestado', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateForum: async (topic, queryClient) => {
    try {
      const { data } = await api.patch<ForumTopic>(`/forum-nutricional/${topic.id}`, topic);

      queryClient.setQueryData<ForumTopicFindAllResponse>(['forum-topics', 1, 10], (oldContent) => {
        const dataContent = oldContent?.data.map((topic) => (topic.id === data.id ? { ...data, ...topic } : topic)) ?? [data];

        return {
          ...oldContent,
          data: dataContent,
          pagination: {
            ...oldContent?.pagination, totalRecords: (oldContent?.pagination.totalRecords ?? 0) + 1,
            totalPages: Math.ceil((oldContent?.pagination.totalRecords ?? 0) / 10),
            currentPage: 1,
            pageSize: 10,
          },
        };
      });

      queryClient.setQueryData<ForumTopic>(['forum-topic', data.id], (oldData) =>
        oldData ? { ...oldData, ...data } : data
      );

      notify('Tópico atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar tópico', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeForum: async (topic, queryClient) => {
    try {
      await api.delete(`/forum-nutricional/${topic.id}`);

      queryClient.setQueryData<ForumTopicFindAllResponse>(['forum-topics', 1, 10], (oldContent) => {
        const dataContent = oldContent?.data.filter((topic) => topic.id !== topic.id) ?? [];

        return {
          ...oldContent,
          data: dataContent,
          pagination: {
            ...oldContent?.pagination, totalRecords: (oldContent?.pagination.totalRecords ?? 0) - 1,
            totalPages: Math.ceil((oldContent?.pagination.totalRecords ?? 0) / 10),
            currentPage: 1,
            pageSize: 10,
          },
        };
      });

      notify('Tópico removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover tópico', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useForumTopicActions;
