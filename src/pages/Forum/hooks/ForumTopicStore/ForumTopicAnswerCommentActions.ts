import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { ForumTopic, ForumTopicAnswerComment, ForumTopicAnswerCommentActions } from "./types";

const useForumTopicAnswerCommentActions = (): ForumTopicAnswerCommentActions => ({
  addCommentAnswer: async (answer, queryClient, user) => {
    try {
      const { data } = await api.post<ForumTopicAnswerComment>('/forum-nutricional-comentario/', answer);

      queryClient.setQueryData<ForumTopic>(['forum-topic', answer.pergunta_id], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          respostas: oldData.respostas.map((oldAnswer) => (oldAnswer.id === answer.resposta_id ? {
            ...oldAnswer,
            comentarios: [...oldAnswer.comentarios, { ...data, professional: user, }],
          } : oldAnswer)),
        };
      });

      notify('Resposta adicionada com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao adicionar resposta', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateCommentAnswer: async (answer, queryClient) => {
    try {
      const { data } = await api.put<ForumTopicAnswerComment>(`/forum-nutricional-comentario/${answer.id}`, answer);

      queryClient.setQueryData<ForumTopic>(['forum-topic', answer.pergunta_id], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          respostas: oldData.respostas.map((oldAnswer) => (oldAnswer.id === answer.resposta_id ? {
            ...oldAnswer,
            comentarios: oldAnswer.comentarios.map((oldComment) => (oldComment.id === answer.id ? {...oldComment, ...data} : oldComment)),
          } : oldAnswer)),
        };
      });

      notify('Resposta atualizada com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar resposta', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeCommentAnswer: async (answer, queryClient) => {
    try {
      await api.delete(`/forum-nutricional-comentario/${answer.id}`);

      queryClient.setQueryData<ForumTopic>(['forum-topic', answer.pergunta_id], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          respostas: oldData.respostas.map((oldAnswer) => (oldAnswer.id === answer.resposta_id ? {
            ...oldAnswer,
            comentarios: oldAnswer.comentarios.filter((oldComment) => oldComment.id !== answer.id),
          } : oldAnswer)),
        };
      });

      notify('Resposta removida com sucesso', 'Sucesso', 'check', 'success');
      return true;
    } catch (error) {
      notify('Erro ao remover resposta', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useForumTopicAnswerCommentActions;
