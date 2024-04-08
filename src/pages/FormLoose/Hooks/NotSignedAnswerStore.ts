import { create } from "zustand";
import { AnsweredForm } from "../../../types/FormBuilder";
import { QueryClient } from "@tanstack/react-query";
import api from "../../../services/useAxios";
import { notify } from "../../../components/toast/NotificationIcon";

interface NotSignedAnswerStoreStore {
  getNotSignedAnswerStores: () => Promise<AnsweredForm[] | false>;
  deleteNotSignedAnswerStore: (answer: AnsweredForm, queryClient: QueryClient) => Promise<void>;
  createFormAnswer: (payload: unknown) => Promise<AnsweredForm | false>;
  updateFormAnswer: (id: number, payload: UploadPayload) => Promise<number | false>;
}

interface UploadPayload {
  respostas: string;
}

export const useNotSignedAnswerStoreStore = create<NotSignedAnswerStoreStore>(() => ({
  getNotSignedAnswerStores: async () => {
    try {
      const { data } = await api.get<AnsweredForm[]>(`/fpc-respondido-paciente-nao-cadastrado/`);
      return data;
    } catch (error) {
      console.error(error);
      throw new Error('Falha ao buscar respostas do paciente');
    }
  },

  deleteNotSignedAnswerStore: async (answer, queryClient) => {
    try {
      queryClient.setQueryData(['answered-forms'], (answers: AnsweredForm[]) => {
        const updatedLaboratories = answers.filter((lab) => lab.id !== answer.id);

        return [...updatedLaboratories];
      });

      await api.delete(`/fpc-respondido-paciente-nao-cadastrado/${answer.id}`);

      notify('Formulário deletado com sucesso!', 'Sucesso!', 'bin', 'success');
    } catch (error) {
      console.error(error);
      notify('Falha ao deletar resposta do paciente', 'Erro!', 'bin', 'danger');
      throw new Error('Falha ao deletar resposta do paciente');
    }
  },

  createFormAnswer: async (payload: unknown) => {
    try {
      const { data } = await api.post('/fpc-respondido-paciente-nao-cadastrado', payload);

      return data ?? false;
    } catch (error) {
      notify('Erro ao enviar resposta', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateFormAnswer: async (id, payload: UploadPayload) => {
    try {
      const { data } = await api.put('/fpc-respondido-paciente-nao-cadastrado/' + id, payload);

      notify('Resposta enviada com sucesso', 'Sucesso', 'check', 'success');

      return data?.id ?? false;
    } catch (error) {
      notify('Erro ao enviar resposta', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
}));