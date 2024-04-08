import api from "/src/services/useAxios";
import { AntropometricAssessmentHistory, PregnantAntropometricData } from "/src/types/AntropometricAssessment";
import { Patient } from "/src/types/Patient";
import { create } from "zustand";

interface AnthropometricAssessmentComparativeStore {
  assessments: AntropometricAssessmentHistory<PregnantAntropometricData>[];
  patient: Patient | null;

  // eslint-disable-next-line no-unused-vars
  getAssessments: (patientId: number) => Promise<AntropometricAssessmentHistory<PregnantAntropometricData>[] | false>;
}

export const useAnthropometricAssessmentComparativeStore = create<AnthropometricAssessmentComparativeStore>((set) => ({
  assessments: [],
  patient: null,

  getAssessments: async (patientId) => {
    try {
      const response = await api.get<AntropometricAssessmentHistory<PregnantAntropometricData>[]>(`/antropometria-historico/paciente/${patientId}/full`);

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