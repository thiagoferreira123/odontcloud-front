import { create } from "zustand";
import { AntropometricAssessmentData, AntropometricAssessmentHistory } from "../../../../types/AntropometricAssessment";
import api from "../../../../services/useAxios";

interface AntropometricAssessmentStore {
  assessments: AntropometricAssessmentHistory<unknown>[];

  query: string;

  // eslint-disable-next-line no-unused-vars
  getAssessments: (patientId: number) => Promise<AntropometricAssessmentHistory<unknown>[] | false>;

  // eslint-disable-next-line no-unused-vars
  getAssessmentsWithData: (patientId: number) => Promise<AntropometricAssessmentHistory<AntropometricAssessmentData>[] | false>;

  // eslint-disable-next-line no-unused-vars
  updateAssessment: (id:number, assessment: Partial<AntropometricAssessmentHistory<unknown>>) => Promise<void | false>;
  // eslint-disable-next-line no-unused-vars
  addAssessment: (assessment: Partial<AntropometricAssessmentHistory<unknown>>) => Promise<AntropometricAssessmentHistory<unknown> | false>;
  // eslint-disable-next-line no-unused-vars
  removeAssessment: (assessment: AntropometricAssessmentHistory<unknown>) => Promise<void | false>;

  // eslint-disable-next-line no-unused-vars
  setQuery: (query: string) => void;
}

export const useAntropometricAssessmentStore = create<AntropometricAssessmentStore>((set) => ({
  assessments: [],

  query: "",

  getAssessments: async (patientId) => {
    try {
      const { data } = await api.get<AntropometricAssessmentHistory<unknown>[]>(`/antropometria-historico/paciente/${patientId}`);

      set({ assessments: data });

      return data;
    } catch (error) {
      console.error(error);
      return false
    }
  },

  getAssessmentsWithData: async (patientId) => {
    try {
      const { data } = await api.get<AntropometricAssessmentHistory<AntropometricAssessmentData>[]>(`/antropometria-historico/paciente/${patientId}/withData`);

      set({ assessments: data });

      return data;
    } catch (error) {
      console.error(error);
      return false
    }
  },

  updateAssessment: async (id, payload) => {
    try {
      const { data } = await api.patch<AntropometricAssessmentHistory<unknown>>('/antropometria-historico/' + id, payload);

      set((state) => ({ assessments: state.assessments.map((assessment) => (assessment.dados_geral_id === id ? data : assessment)) }));
    } catch (error) {
      console.error(error);
      return false
    }
  },

  addAssessment: async (payload) => {
    try {
      const { data } = await api.post<AntropometricAssessmentHistory<unknown>>('/antropometria-historico', payload);

      set((state) => ({ assessments: [data, ...state.assessments] }));

      return data.dados_geral_id ? data : false;
    } catch (error) {
      console.error(error);
      return false
    }
  },

  setQuery: (query) => {
    set({ query });
  },

  removeAssessment: async (assessment) => {
    try {
      await api.delete(`/antropometria-historico/${assessment.dados_geral_id}`);

      set((state) => ({ assessments: state.assessments.filter((a) => a.dados_geral_id !== assessment.dados_geral_id) }));
    } catch (error) {
      console.error(error);
      return false
    }
  },
}));