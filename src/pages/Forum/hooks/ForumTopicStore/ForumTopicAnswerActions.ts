import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { ForumTopic, ForumTopicAnswer, ForumTopicAnswerActions } from "./types";

const useForumTopicAnswerActions = (): ForumTopicAnswerActions => ({
  addAnswer: async (answer, queryClient, user) => {
    try {
      const { data } = await api.post<ForumTopicAnswer>('/forum-nutricional-reposta/', answer);

      queryClient.setQueryData<ForumTopic>(['forum-topic', answer.pergunta_id], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          respostas: [...oldData.respostas, { ...data, professional: user, comentarios: [], curtidas: [] }],
        };
      });

      notify('Comentário adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar resposta', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateAnswer: async (answer, queryClient) => {
    try {
      const { data } = await api.patch<ForumTopicAnswer>(`/forum-nutricional-reposta/${answer.id}`, answer);

      queryClient.setQueryData<ForumTopic>(['forum-topic', answer.pergunta_id], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          respostas: oldData.respostas.map((oldAnswer) => (oldAnswer.id === answer.id ? {...oldAnswer, ...data} : oldAnswer)),
        };
      });

      notify('Comentário atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar resposta', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeAnswer: async (answer, queryClient) => {
    try {
      await api.delete(`/forum-nutricional-reposta/${answer.id}`);

      queryClient.setQueryData<ForumTopic>(['forum-topic', answer.pergunta_id], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          respostas: oldData.respostas.filter((oldAnswer) => oldAnswer.id !== answer.id),
        };
      });

      notify('Comentário removido com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover resposta', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useForumTopicAnswerActions;
