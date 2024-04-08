import api from "/src/services/useAxios";
import { QueryClient } from "@tanstack/react-query";
import { notify } from "/src/components/toast/NotificationIcon";
import { SendReply } from "./types";

const useFormReplyActions = () => ({
  addReplyForm: async (replyData: SendReply, queryClient: QueryClient) => {
    try {
      const { data } = await api.post('/fpc-respondido-paciente-cadastrado/', replyData);

      queryClient.invalidateQueries({ queryKey: ['formulários'] });

      notify('Resposta enviada com sucesso', 'Sucesso', 'check', 'success');

      return data?.id ?? false;
    } catch (error) {
      notify('Erro ao enviar resposta', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
});

export default useFormReplyActions;
