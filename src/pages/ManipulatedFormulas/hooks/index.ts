import { create } from "zustand";
import { ManipulatedFormula } from "../../PatientMenu/manipulated-formulas/hooks";
import api from "../../../services/useAxios";
import { ITemplate } from "./TemplateStore";
import { QueryClient } from "@tanstack/react-query";

interface ManipuledFormulaStore {

  content: string;

  // eslint-disable-next-line no-unused-vars
  getManipuledFormula: (id: number) => Promise<ManipulatedFormula | false>;
  // eslint-disable-next-line no-unused-vars
  handleSelectTemplate: (template: ITemplate, queryClient: QueryClient, id: string) => void;
  // eslint-disable-next-line no-unused-vars
  persistManipuledFormula: (id: string, queryClient: QueryClient) => Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  changeContent: (content: string, id: string, queryClient: QueryClient) => void;
}

export const useManipuledFormulaStore = create<ManipuledFormulaStore>((set) => ({

  content: '',

  getManipuledFormula: async (id: number) => {
    try {
      const { data } = await api.get(`/formula-manipulada-prescricao/${id}`);

      set({ content: data.conteudo });

      return data ?? false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  handleSelectTemplate: (template, queryClient, id) => {
    queryClient.setQueryData(['manipulated-formula', id], (prescription: ManipulatedFormula) => {
      const content = prescription.conteudo.length ? `${prescription.conteudo} <br> ${template.texto}` : template.texto
      set({ content });
      return { ...prescription, conteudo: content };
    });
  },
  persistManipuledFormula: async (id, queryClient) => {
    try {
      const prescription = queryClient.getQueryData(['manipulated-formula', id]) as ManipulatedFormula;

      await api.patch(`/formula-manipulada-prescricao/${id}`, { conteudo: prescription.conteudo });

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  },

  changeContent: (content, id, queryClient) => {
    queryClient.setQueryData(['manipulated-formula', id], (prescription: ManipulatedFormula) => {
      set({ content });
      return { ...prescription, conteudo: content };
    });
  }
}));