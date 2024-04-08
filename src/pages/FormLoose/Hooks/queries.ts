import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import api from '/src/services/useAxios';
import { AnsweredForm, Form } from '/src/types/FormBuilder';

export const useFormQuery = (id?: string) => {
  return useQuery({
    queryKey: ['form', id],
    queryFn: async () => {
      const { data }: AxiosResponse<Form> = await api.get(`/fpc-cadastrado-pelo-profissional/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useFormQueryByKey = (key?: string) => {
  return useQuery({
    queryKey: ['form', key],
    queryFn: async () => {
      const { data }: AxiosResponse<Form> = await api.get(`/fpc-cadastrado-pelo-profissional/k/${key}`);
      return data;
    },
    enabled: !!key,
  });
};

export const useAnsweredFormsFilesQuery = () => {
  return useQuery({
    queryKey: ['answered_forms'],
    queryFn: async () => {
      const { data }: AxiosResponse<AnsweredForm[]> = await api.get(`/fpc-anexo-paciente-nao-cadastrado/66881f32-b986-44a4-8c28-9e7b21bed469`);
      return data;
    },
  });
};
