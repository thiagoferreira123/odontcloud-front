import { QueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import { Exam } from "../../../../types/RequestingExam";
import api from "../../../../services/useAxios";

interface MyExamsStore {

  query: string;

  // eslint-disable-next-line no-unused-vars
  setQuery: (query: string) => void;

  getExams(): Promise<Exam[] | false>;
  // eslint-disable-next-line no-unused-vars
  addExam(exam: Exam, queryClient: QueryClient): Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  updateExam(exam: Exam, queryClient: QueryClient): Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  removeExam(exam: Exam, queryClient: QueryClient): Promise<boolean>;
}

export const useMyExamsStore = create<MyExamsStore>((set) => ({
  query: '',

  setQuery: (query) => set({ query }),

  getExams: async () => {
    try {
      const { data } = await api.get<Exam[]>('/exames-de-sangue/professional');

      return data ?? false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  addExam: async (exam, queryClient) => {
    try {
      const { data } = await api.post<Exam>('/exames-de-sangue', exam);

      queryClient.setQueryData(['my-exams'], (exams: Exam[]) => {
        return exams ? [...exams, data] : [data];
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  updateExam: async (exam, queryClient) => {
    try {
      const { data } = await api.put<Exam>('/exames-de-sangue/' + exam.id, exam);

      queryClient.setQueryData(['my-exams'], (exams: Exam[]) => {
        const updatedExams = exams.map((e) => {
          if (e.id === data.id) {
            return data;
          }

          return e;
        });

        return [...updatedExams];
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  removeExam: async (exam, queryClient) => {
    try {
      queryClient.setQueryData(['my-exams'], (exams: Exam[]) => {
        const updatedExams = exams.filter((e) => e.id !== exam.id);

        return [...updatedExams];
      });

      await api.delete('/exames-de-sangue/' + exam.id);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
}));