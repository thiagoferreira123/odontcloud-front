import { create } from 'zustand';
import api from '../../../../services/useAxios';

export interface PatientsAnalysis {
  year: number;
  patient_sex1: number;
  patient_sex0: number;
  months: PatientsAnalysisMonth[];
}

interface PatientsAnalysisMonth {
  month: string;
  patient_sex1: number;
  patient_sex0: number;
}

interface PatientsAnalysisStore {
  year: string;
  getPatientsAnalysis: (year: string) => Promise<PatientsAnalysis | false>;
  setYear: (year: string) => void;
}

export const usePatientStoreAnalysisStore = create<PatientsAnalysisStore>((set) => ({
  year: new Date().getFullYear().toString(),

  getPatientsAnalysis: async (year) => {
    try {
      const { data } = await api.get(`/clinic-patient/gender-statistics-by-month-and-year/${year}`);

      return data ?? false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  setYear: (year) => set({ year }),
}));
