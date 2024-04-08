import api from "/src/services/useAxios";
import { RequestingExam } from "/src/types/RequestingExam";
import { create } from "zustand";

interface ExamComparativeStore {
  exams: RequestingExam[];

  // eslint-disable-next-line no-unused-vars
  getExams: (patientId: number) => Promise<RequestingExam[] | false>;
}

export const useExamComparativeStore = create<ExamComparativeStore>((set) => ({
  exams: [],

  getExams: async (patientId) => {
    try {
      const { data } = await api.get<RequestingExam[]>(`/exames-de-sangue-historico/patient/${patientId}`);

      set({ exams: data });

      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}));