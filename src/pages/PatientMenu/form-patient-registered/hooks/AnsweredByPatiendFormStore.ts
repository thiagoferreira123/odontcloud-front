import { create } from "zustand";
import { AnsweredForm } from "../../../../types/FormBuilder";
import api from "../../../../services/useAxios";
import { QueryClient } from "@tanstack/react-query";
import { notify } from "../../../../components/toast/NotificationIcon";

interface AnsweredByPatiendFormStore {
  // eslint-disable-next-line no-unused-vars
  getPatientAnswers: (id: string) => Promise<AnsweredForm[] | false>;
  // eslint-disable-next-line no-unused-vars
  deletePatientAnswer: (answer: AnsweredForm, queryClient: QueryClient) => Promise<boolean>;
}

export const useAnsweredByPatiendFormStore = create<AnsweredByPatiendFormStore>(() => ({
  getPatientAnswers: async (id) => {
    try {
      const { data } = await api.get<AnsweredForm[]>(`/fpc-cadastrado-pelo-profissional/paciente-id/${id}`);
      return data;
    } catch (error) {
      console.error(error);
      throw new Error('Falha ao buscar respostas do paciente');
    }
  },

  deletePatientAnswer: async (answer, queryClient) => {
    try {
      queryClient.setQueryData(['patient-forms', answer.paciente_id?.toString() ?? '0'], (answers: AnsweredForm[]) => {
        const updatedLaboratories = answers ? answers.filter((form) => form.id !== answer.id) : [];

        return [...updatedLaboratories];
      });

      await api.delete(`/fpc-cadastrado-pelo-profissional/${answer.id}`);

      notify('Formulário deletado com sucesso!', 'Sucesso!', 'bin', 'success');

      return true;
    } catch (error) {
      console.error(error);
      notify('Falha ao deletar resposta do paciente', 'Erro!', 'bin', 'danger');
      throw new Error('Falha ao deletar resposta do paciente');
    }
  }
}));