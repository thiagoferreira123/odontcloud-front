import { create } from "zustand";
import { QueryClient } from "@tanstack/react-query";
import api from "../../../services/useAxios";
import { notify } from "../../../components/toast/NotificationIcon";
import { AnswerObject } from "../../../types/FormBuilder";

interface AnswerStore {
  // eslint-disable-next-line no-unused-vars
  getAnswers: () => Promise<AnswerObject[] | false>;
  // eslint-disable-next-line no-unused-vars
  createAnswer: (payload: AnswerObject, queryClient: QueryClient) => Promise<AnswerObject | false>;
  // eslint-disable-next-line no-unused-vars
  editAnswer: (payload: Partial<AnswerObject>, queryClient: QueryClient) => Promise<AnswerObject | false>;
  // eslint-disable-next-line no-unused-vars
  deleteAnswer: (answer: AnswerObject, queryClient: QueryClient) => Promise<boolean>;
}

export const useAnswerStore = create<AnswerStore>(() => ({
  getAnswers: async () => {
    try {
      const { data } = await api.get<AnswerObject[]>(`/fpc-respondido-paciente-cadastrado/`);
      return data;
    } catch (error) {
      console.error(error);
      throw new Error('Falha ao buscar respostas do paciente');
    }
  },

  createAnswer: async (payload, queryClient) => {
    try {
      const { data } = await api.post<AnswerObject>('/fpc-respondido-paciente-cadastrado/', payload);

      queryClient.setQueryData(['answers'], (answers: AnswerObject[]) => {
        return [...answers, data];
      });

      notify('Resposta criada com sucesso!', 'Sucesso!', 'bin', 'success');

      return data ?? false;
    } catch (error) {
      console.error(error);
      notify('Falha ao criar resposta do paciente', 'Erro!', 'bin', 'danger');
      return false;
    }
  },

  editAnswer: async (form, queryClient) => {
    try {
      const { data } = await api.put<AnswerObject>(`/fpc-respondido-paciente-cadastrado/${form.id}`, form);

      queryClient.setQueryData(['answers'], (answers: AnswerObject[]) => {
        const updatedLaboratories = answers.map((item) => {
          if (item.id === form.id) {
            return form;
          }
          return item;
        });

        return [...updatedLaboratories];
      });

      notify('Resposta editada com sucesso!', 'Sucesso!', 'bin', 'success');

      return data ?? false;
    } catch (error) {
      console.error(error);
      notify('Falha ao editar resposta do paciente', 'Erro!', 'bin', 'danger');
      return false;
    }
  },

  deleteAnswer: async (answer, queryClient) => {
    try {
      queryClient.setQueryData(['answers'], (answers: AnswerObject[]) => {
        const updatedLaboratories = answers.filter((form) => form.id !== answer.id);

        return [...updatedLaboratories];
      });

      await api.delete(`/fpc-respondido-paciente-cadastrado/${answer.id}`);

      notify('Resposta deletada com sucesso!', 'Sucesso!', 'bin', 'success');

      return true;
    } catch (error) {
      console.error(error);
      notify('Falha ao deletar resposta do paciente', 'Erro!', 'bin', 'danger');
      throw new Error('Falha ao deletar resposta do paciente');
    }
  }
}));