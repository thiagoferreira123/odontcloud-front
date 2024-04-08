import api from "/src/services/useAxios";
import { AntropometricAssessmentHistory } from "/src/types/AntropometricAssessment";
import { create } from "zustand";

interface AnthropometricAssessmentComparativeStore {
  assessments: AntropometricAssessmentHistory[];

  // eslint-disable-next-line no-unused-vars
  getAssessments: (patientId: number) => Promise<AntropometricAssessmentHistory[] | false>;
}

export const useAnthropometricAssessmentComparativeStore = create<AnthropometricAssessmentComparativeStore>((set) => ({
  assessments: [],

  getAssessments: async (patientId) => {
    try {
      const { data } = await api.get<AntropometricAssessmentHistory[]>(`/antropometria-historico/paciente/${patientId}/full`);

      set({ assessments: data });

      return data;
    } catch (error) {
      console.error(error);
      return false
    }
  },
}));