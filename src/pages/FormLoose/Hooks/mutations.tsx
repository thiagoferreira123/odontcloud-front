import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notify } from '../../../components/toast/NotificationIcon';
import api from '../../../services/useAxios';
import { Form, FormPayload } from '../../../types/FormBuilder';

export const useCreateForm = () => {
  const cache = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<FormPayload>) => {
      return api.post('/fpc-cadastrado-pelo-profissional/', payload);
    },
    onSuccess: () => {
      cache.invalidateQueries({ queryKey: ['forms'] });
    },
  });
};

export const useEditForm = () => {
  const cache = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Form>) => {
      return api.put(`/fpc-cadastrado-pelo-profissional/${payload.id}`, payload);
    },
    onSuccess: () => {
      cache.invalidateQueries({ queryKey: ['forms'] });
    },
  });
};

export const useCreatePatientFormAnswer = () => {
  const cache = useQueryClient();
  return useMutation({
    mutationFn: (payload: unknown) => {
      return api.post('/fpc-respondido-paciente-nao-cadastrado', payload);
    },
    onSuccess: () => {
      cache.invalidateQueries({ queryKey: ['answered_forms'] });
    },
  });
};

export const useEditPatientFormAnswer = () => {
  const cache = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: unknown }) => {
      const { id, ...rest } = payload;
      return api.put(`/fpc-respondido-paciente-nao-cadastrado/${id}`, rest);
    },
    onSuccess: () => {
      notify('Formulário enviado com sucesso!', 'Sucesso!', 'bin', 'success');
      cache.invalidateQueries({ queryKey: ['answered_forms'] });
    },
  });
};

export const useDeleteFile = () => {
  return useMutation({
    mutationFn: (id: string) => {
      return api.delete(`/fpc-anexo-paciente-nao-cadastrado/${id}`);
    },
  });
};
