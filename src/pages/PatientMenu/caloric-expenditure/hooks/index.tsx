import { create } from "zustand";
import api from "../../../../services/useAxios";
import { CaloricExpenditure } from "../../../../types/CaloricExpenditure";
import { QueryClient } from "@tanstack/react-query";

interface CaloricExpenditureStore {
  // eslint-disable-next-line no-unused-vars
  getExpenditures(patientId: number): Promise<CaloricExpenditure[] | false>;
  // eslint-disable-next-line no-unused-vars
  addExpediture(expenditure: Partial<CaloricExpenditure>, queryClient: QueryClient): Promise<CaloricExpenditure | false>;
  // eslint-disable-next-line no-unused-vars
  updateExpediture(expenditure: Partial<CaloricExpenditure>, queryClient: QueryClient): Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  removeExpediture(expenditure: CaloricExpenditure, queryClient: QueryClient): Promise<boolean>;
}

export const useCaloricExpenditureStore = create<CaloricExpenditureStore>(() => ({
  getExpenditures: async (patientId) => {
    try {
      const { data } = await api.get<CaloricExpenditure[]>('/gasto-calorico-historico/paciente/' + patientId);
      return data ?? false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  addExpediture: async (expenditure, queryClient) => {
    try {
      const { data } = await api.post<CaloricExpenditure>('/gasto-calorico-historico', expenditure);

      queryClient.setQueryData(['caloricExpenditures', expenditure.id_paciente], (caloricExpenditures: CaloricExpenditure[]) => {
        return [...caloricExpenditures, data];
      });

      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  updateExpediture: async (expenditure, queryClient) => {
    try {
      const { data } = await api.patch<CaloricExpenditure>('/gasto-calorico-historico/' + expenditure.id, expenditure);
      queryClient.setQueryData(['caloricExpenditures', expenditure.id_paciente], (expenditures: CaloricExpenditure[]) => {
        const updatedExams = expenditures.map((e) => {
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

  removeExpediture: async (expenditure, queryClient) => {
    try {
      await api.delete('/gasto-calorico-historico/' + expenditure.id);
      queryClient.setQueryData(['caloricExpenditures', expenditure.id_paciente], (expenditures: CaloricExpenditure[]) => {
        return expenditures.filter((e) => e.id !== expenditure.id);
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
}));