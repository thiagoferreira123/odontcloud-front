import { create } from "zustand";
import api from "../../../services/useAxios";
import { QueryClient } from "@tanstack/react-query";
import { notify } from "../../../components/toast/NotificationIcon";

interface ITemplateStore {
  getMyTemplates: () => Promise<ITemplate[] | false>;
  getTemplates: () => Promise<ITemplate[] | false>;
  // eslint-disable-next-line no-unused-vars
  removeTemplate: (template: ITemplate, queryClient: QueryClient) => Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  addTemplate: (template: Partial<ITemplate>, queryClient: QueryClient) => Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  updateTemplate: (template: Partial<ITemplate> & {id: number}, queryClient: QueryClient) => Promise<boolean>;
}

export interface ITemplate {
  id: number,
  nome: string,
  texto: string,
  categoria: string,
  id_profissional: number,
  cor: string
}

export const useTemplateStore = create<ITemplateStore>(() => ({
  getMyTemplates: async () => {
    try {
      const { data } = await api.get<ITemplate[]>('/formula-manipulada-modelo/professional');

      return data ?? false;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  getTemplates: async () => {
    try {
      const { data } = await api.get<ITemplate[]>('/formula-manipulada-modelo');

      return data ?? false;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  removeTemplate: async (template, queryClient) => {
    try {
      queryClient.setQueryData(['manipulated-formula-templates'], (templates: ITemplate[]) => {
        return templates ? templates.filter((t) => t.id !== template.id) : [];
      });
      queryClient.setQueryData(['my-manipulated-formula-templates'], (templates: ITemplate[]) => {
        return templates ? templates.filter((t) => t.id !== template.id) : [];
      });

      await api.delete('/formula-manipulada-modelo/' + template.id);

      return true;
    } catch (error) {
      notify('Erro ao remover formulação', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
  addTemplate: async (template, queryClient) => {
    try {
      const { data } = await api.post<ITemplate>('/formula-manipulada-modelo', template);

      queryClient.setQueryData(['manipulated-formula-templates'], (templates: ITemplate[]) => {
        return templates ? [...templates, data] : [];
      });

      queryClient.setQueryData(['my-manipulated-formula-templates'], (templates: ITemplate[]) => {
        return templates ? [...templates, data] : [];
      });

      notify('Formulação adicionada com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao adicionar formulação', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
  updateTemplate: async (template, queryClient) => {
    try {
      const { data } = await api.put<ITemplate>('/formula-manipulada-modelo/' + template.id, template);

      queryClient.setQueryData(['manipulated-formula-templates'], (templates: ITemplate[]) => {
        return templates ?  templates.map((t) => (t.id === template.id ? data : t)) : [];
      });

      queryClient.setQueryData(['my-manipulated-formula-templates'], (templates: ITemplate[]) => {
        return templates ?  templates.map((t) => (t.id === template.id ? data : t)) : [];
      });

      notify('Formulação atualizada com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao atualizar formulação', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
}));