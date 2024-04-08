import { create } from "zustand";
import { AntropometricAssessmentHistory, Child5to19AntropometricData } from "../../../../types/AntropometricAssessment";
import api from "../../../../services/useAxios";

interface AnthropometricAssessmentComparativeStore {
  assessments: AntropometricAssessmentHistory<Child5to19AntropometricData>[];

  // eslint-disable-next-line no-unused-vars
  getAssessments: (patientId: number) => Promise<AntropometricAssessmentHistory<Child5to19AntropometricData>[] | false>;
}

export const useAnthropometricAssessmentComparativeStore = create<AnthropometricAssessmentComparativeStore>((set) => ({
  assessments: [],

  getAssessments: async (patientId) => {
    try {
      const { data } = await api.get<AntropometricAssessmentHistory<Child5to19AntropometricData>[]>(`/antropometria-historico/paciente/${patientId}/full`);

      set({ assessments: data });

      return data;
    } catch (error) {
      console.error(error);
      return false
    }
  },
}));