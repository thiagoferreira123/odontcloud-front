import { create } from "zustand";
import api from "../../../../services/useAxios";
import { QueryClient } from "@tanstack/react-query";

export interface ManipulatedFormula {
  id: number;
  nome: string;
  dataCriacao: Date;
  conteudo: string;
  idPaciente: number;
  Compostos: Composto[];
}

interface Composto {
  id: number;
  idFormula: number;
  idSolicitacao: number;
  tipo: string; // Se "tipo" tiver um conjunto limitado de strings válidas, considere usar um tipo literal, como tipo: "FORMULA";
}

interface ManupulatedFormulasState {
  // eslint-disable-next-line no-unused-vars
  getManipulatedFormulas: (patientId: number) => Promise<ManipulatedFormula[] | false>;
  // eslint-disable-next-line no-unused-vars
  addManipulatedFormulas: (payload: Partial<ManipulatedFormula>, queryClient: QueryClient) => Promise<ManipulatedFormula | false>;
  // eslint-disable-next-line no-unused-vars
  updateManipulatedFormulas: (payload: Partial<ManipulatedFormula>, queryClient: QueryClient) => Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  removeManipulatedFormula: (payload: ManipulatedFormula, queryClient: QueryClient) => Promise<boolean>;
}

export const useManipulatedFormulas = create<ManupulatedFormulasState>(() => ({
  getManipulatedFormulas: async (patientId) => {
    try {
      const { data } = await api.get<ManipulatedFormula[]>('/formula-manipulada-prescricao/paciente/' + patientId);

      return data ?? false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  addManipulatedFormulas: async (payload, queryClient) => {
    try {
      const { data } = await api.post<ManipulatedFormula>('/formula-manipulada-prescricao', payload);

      queryClient.setQueryData(['manipulatedFormulas', payload.idPaciente], (formula: ManipulatedFormula[]) => {
        return [...formula, data];
      });

      return data ?? false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  updateManipulatedFormulas: async (payload, queryClient) => {
    try {
      const { data } = await api.patch<ManipulatedFormula>('/formula-manipulada-prescricao/' + payload.id, payload);
      queryClient.setQueryData(['manipulatedFormulas', payload.idPaciente], (formulas: ManipulatedFormula[]) => {
        const updatedExams = formulas.map((e) => {
          if (e.id === data.id) {
            return data;
          }
          return e;
        });
        return updatedExams;
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  removeManipulatedFormula: async (payload, queryClient) => {
    try {
      await api.delete<ManipulatedFormula>('/formula-manipulada-prescricao/' + payload.id);

      queryClient.setQueryData(['manipulatedFormulas', payload.idPaciente], (formulas: ManipulatedFormula[]) => {
        return formulas.filter((e) => e.id !== payload.id);
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
}));