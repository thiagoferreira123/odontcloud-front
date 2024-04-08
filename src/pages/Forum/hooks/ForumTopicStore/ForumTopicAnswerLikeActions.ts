import { notify } from "../../../../components/toast/NotificationIcon";
import api from "../../../../services/useAxios";
import { ForumTopic, ForumTopicAnswerLike, ForumTopicAnswerLikeActions } from "./types";

const useForumTopicAnswerLikeActions = (): ForumTopicAnswerLikeActions => ({
  addCommentLike: async (like, queryClient, user) => {
    try {
      const { data } = await api.post<ForumTopicAnswerLike>('/forum-nutricional-curtida/', like);

      queryClient.setQueryData<ForumTopic>(['forum-topic', like.pergunta_id], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          respostas: oldData.respostas.map((oldAnswer) => (oldAnswer.id === like.resposta_id ? {
            ...oldAnswer,
            curtidas: oldAnswer.curtidas?.length ? [...oldAnswer.curtidas, { ...data, professional: user }] : [{ ...data, professional: user }],
          } : oldAnswer)),
        };
      });

      notify('Resposta curtida com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      notify('Erro ao curtir resposta', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeCommentLike: async (like, queryClient) => {
    try {
      await api.delete(`/forum-nutricional-curtida/${like.id}`);

      queryClient.setQueryData<ForumTopic>(['forum-topic', like.pergunta_id], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          respostas: oldData.respostas.map((oldAnswer) => (oldAnswer.id === like.resposta_id ? {
            ...oldAnswer,
            curtidas: oldAnswer.curtidas?.filter((oldLike) => oldLike.id !== like.id),
          } : oldAnswer)),
        };
      });

      notify('Resposta descurtida com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao descurtir resposta', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useForumTopicAnswerLikeActions;
