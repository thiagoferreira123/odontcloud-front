import { create } from 'zustand';
import api from '../../../../services/useAxios';

export interface PatientsAnalysis {
  ano: number,
  genero1: number,
  genero0: number,
  meses: PatientsAnalysisMonth[]
}

interface PatientsAnalysisMonth {
  mes: string,
  genero1: number,
  genero0: number
}

interface PatientsAnalysisStore {
  year: string;
  // eslint-disable-next-line no-unused-vars
  getPatientsAnalysis: (year: string) => Promise<PatientsAnalysis | false>;
  // eslint-disable-next-line no-unused-vars
  setYear: (year: string) => void;
}

export const usePatientStoreAnalysisStore = create<PatientsAnalysisStore>((set) => ({
  year: new Date().getFullYear().toString(),

  getPatientsAnalysis: async (year) => {
    try {
      const { data } = await api.get(`/paciente/contagemGeneroPorAnoMes/${year}`);

      return data ?? false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  setYear: (year) => set({ year }),
}));
