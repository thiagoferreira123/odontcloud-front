import { create } from "zustand";
import { QueryClient } from "@tanstack/react-query";
import api from "../../../services/useAxios";
import { notify } from "../../../components/toast/NotificationIcon";
import { Form, FormPayload } from "../../../types/FormBuilder";

interface FormStore {
  // eslint-disable-next-line no-unused-vars
  getForms: () => Promise<Form[] | false>;
  // eslint-disable-next-line no-unused-vars
  getForm: (id: string) => Promise<Form | false>;
  // eslint-disable-next-line no-unused-vars
  createForm: (payload: Partial<FormPayload>, queryClient: QueryClient) => Promise<Form | false>;
  // eslint-disable-next-line no-unused-vars
  editForm: (payload: Partial<Form>, queryClient: QueryClient) => Promise<Form | false>;
  // eslint-disable-next-line no-unused-vars
  deleteForm: (form: Form, queryClient: QueryClient) => Promise<boolean>;
}

export const useFormStore = create<FormStore>(() => ({
  getForms: async () => {
    try {
      const { data } = await api.get<Form[]>(`/fpc-cadastrado-pelo-profissional/`);
      const models = data.filter((item) => item.tipo.trim().toLowerCase() !== 'paciente');
      return models;
    } catch (error) {
      console.error(error);
      throw new Error('Falha ao buscar formulários');
    }
  },

  getForm: async (id) => {
    try {
      const { data } = await api.get<Form>(`/fpc-cadastrado-pelo-profissional/${id}`);
      return data;
    } catch (error) {
      console.error(error);
      throw new Error('Falha ao buscar formulário');
    }
  },

  createForm: async (payload, queryClient) => {
    try {
      const queryKey = payload.paciente_id ? ['patient-forms', payload.paciente_id.toString()] : ['forms'];

      const { data } = await api.post<Form>('/fpc-cadastrado-pelo-profissional/', payload);

      queryClient.setQueryData(queryKey, (forms: Form[]) => {
        return [...forms ?? [], data];
      });

      notify('Formulário criado com sucesso!', 'Sucesso!', 'bin', 'success');

      return data ?? false;
    } catch (error) {
      console.error(error);
      notify('Falha ao criar formulário', 'Erro!', 'bin', 'danger');
      return false;
    }
  },

  editForm: async (form, queryClient) => {
    try {
      const queryKey = form.paciente_id ? ['patient-forms', form.paciente_id.toString()] : ['forms'];

      const { data } = await api.put<Form>(`/fpc-cadastrado-pelo-profissional/${form.id}`, form);

      queryClient.setQueryData(queryKey, (forms: Form[]) => {
        const updatedLaboratories = forms?.map((item) => {
          if (item.id === form.id) {
            return form;
          }
          return item;
        }) ?? [];

        return [...updatedLaboratories];
      });

      notify('Formulário editado com sucesso!', 'Sucesso!', 'bin', 'success');

      return data ?? false;
    } catch (error) {
      console.error(error);
      notify('Falha ao editar formulário', 'Erro!', 'bin', 'danger');
      return false;
    }
  },

  deleteForm: async (form, queryClient) => {
    try {
      const queryKey = form.paciente_id ? ['patient-forms', form.paciente_id.toString()] : ['forms'];

      queryClient.setQueryData(queryKey, (forms: Form[]) => {
        console.log('forms', forms, forms.filter((f) => f.id !== form.id));
        return forms ? forms.filter((f) => f.id !== form.id) : [];
      });

      await api.delete(`/fpc-cadastrado-pelo-profissional/${form.id}`);

      notify('Formulário deletado com sucesso!', 'Sucesso!', 'bin', 'success');

      return true;
    } catch (error) {
      console.error(error);
      notify('Falha ao deletar formulário', 'Erro!', 'bin', 'danger');
      throw new Error('Falha ao deletar formulário');
    }
  }
}));