import api from "/src/services/useAxios";
import { AntropometricAssessmentHistory, Child0to5AntropometricData } from "/src/types/AntropometricAssessment";
import { Patient } from "/src/types/Patient";
import { create } from "zustand";

interface AnthropometricAssessmentComparativeStore {
  assessments: AntropometricAssessmentHistory<Child0to5AntropometricData>[];
  patient: Patient | null;

  // eslint-disable-next-line no-unused-vars
  getAssessments: (patientId: number) => Promise<AntropometricAssessmentHistory<Child0to5AntropometricData>[] | false>;
}

export const useAnthropometricAssessmentComparativeStore = create<AnthropometricAssessmentComparativeStore>((set) => ({
  assessments: [],
  patient: null,

  getAssessments: async (patientId) => {
    try {
      const response = await api.get<AntropometricAssessmentHistory<Child0to5AntropometricData>[]>(`/antropometria-historico/paciente/${patientId}/full`);

      set({ assessments: response.data });

      if(response.data.length) {
        const response = await api.get<Patient>(`/paciente/${patientId}`);

        set({ patient: response.data });
      }

      return response.data;
    } catch (error) {
      console.error(error);
      return false
    }
  },
}));