import { QueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import { Exam, ExamTemplate } from "../../../types/RequestingExam";
import api from "../../../services/useAxios";

interface ExamsSelectStore {
  exams: Exam[];
  templates: ExamTemplate[];

  getExams: () => Promise<Exam[] | false>;
  getExamTemplates: () => Promise<ExamTemplate[] | false>;
  // eslint-disable-next-line no-unused-vars
  addExam: (exam: Exam, queryClient?: QueryClient) => Promise<ExamTemplate | false>;
  // eslint-disable-next-line no-unused-vars
  addTemplate: (template: ExamTemplate) => void;
}

export const useExamsSelectStore = create<ExamsSelectStore>((set) => ({
  exams: [],
  templates: [],

  getExams: async () => {
    try {
      const { data } = await api.get<Exam[]>("/exames-de-sangue");

      set({ exams: data });

      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  getExamTemplates: async () => {
    try {
      const { data } = await api.get<ExamTemplate[]>("/exames-de-sangue-modelo/profissional");
      set({ templates: data });

      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  addExam: async (payload, queryClient) => {

    try {
      const { data } = await api.post('/exames-de-sangue', payload);

      set((state) => {
        return { exams: [data, ...state.exams] };
      });

      queryClient && queryClient.setQueryData(['my-exams'], (exams: Exam[]) => {
        return exams ? [data, ...exams] : [data];
      });

      return data;
    } catch (error) {
      console.error(error);
      return false;
    }

  },

  addTemplate: (template) => {
    set((state) => {
      return { templates: [...state.templates, template] };
    });
  },
}));