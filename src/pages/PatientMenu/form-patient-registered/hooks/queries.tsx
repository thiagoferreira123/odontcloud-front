import { useQuery } from '@tanstack/react-query';
import api from '/src/services/useAxios';
import { Form, FormModel } from '/src/types/FormBuilder';

async function fetchForm(id: string): Promise<Form> {
  try {
    const { data } = await api.get<Form>(`/fpc-cadastrado-pelo-profissional/${id}`);
    return data;
  } catch (error) {
    throw new Error('Falha ao buscar formulário');
  }
}

async function fetchUserFormModels(): Promise<FormModel[]> {
  try {
    const { data } = await api.get<FormModel[]>(`/fpc-cadastrado-pelo-profissional`);
    return data.filter((item) => item.tipo.trim().toLowerCase() !== 'paciente');
  } catch (error) {
    throw new Error('Falha ao buscar modelos de formulário do usuário');
  }
}

async function fetchSystemForms(): Promise<FormModel[]> {
  try {
    const { data } = await api.get<FormModel[]>(`/fpc-cadastrado-pelo-profissional/software/0`);
    return data;
  } catch (error) {
    throw new Error('Falha ao buscar formulários do sistema');
  }
}


// Hooks com uso das funções assíncronas separadas

export const useFormQuery = (id?: string) => {
  return useQuery({
    queryKey: ['form', id],
    queryFn: () => fetchForm(id!),
    enabled: !!id,
  });
};

export const useUserFormModelsQuery = () => {
  return useQuery({
    queryKey: ['user_forms'],
    queryFn: fetchUserFormModels,
  });
};

export const useSystemFormsQuery = () => {
  return useQuery({
    queryKey: ['system_forms'],
    queryFn: fetchSystemForms,
  });
};
