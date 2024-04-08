import { create } from "zustand";
import api from "../../../../services/useAxios";
import { RequestingExam, RequestingExamAttachment, isRequestingExam } from "../../../../types/RequestingExam";

interface RequestingExamsStore {
  exams: (RequestingExam | RequestingExamAttachment)[];

  // eslint-disable-next-line no-unused-vars
  getExams: (patientId: number) => Promise<(RequestingExam | RequestingExamAttachment)[] | false>;
  // eslint-disable-next-line no-unused-vars
  updateExam: (id: string, exam: Partial<RequestingExam>) => Promise<void | false>;
  // eslint-disable-next-line no-unused-vars
  addExam: (exam: Partial<RequestingExam | RequestingExamAttachment>) => Promise<string | false>;
  // eslint-disable-next-line no-unused-vars
  duplicateExam: (exam: RequestingExam) => Promise<RequestingExam | false>;
  // eslint-disable-next-line no-unused-vars
  removeExam: (exam: RequestingExam | RequestingExamAttachment) => Promise<void | false>;
}

export const useRequestingExamsStore = create<RequestingExamsStore>((set) => ({
  exams: [],

  getExams: async (patientId) => {
    try {
      const response = await api.get<RequestingExam[]>(`/exames-de-sangue-historico/patient/${patientId}`);
      const responseAttachments = await api.get<RequestingExamAttachment[]>(`/exame-de-sangue-anexo/paciente/${patientId}`);

      const data = [...response.data, ...responseAttachments.data];

      set({ exams: data });

      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  updateExam: async (id, payload) => {
    try {
      const { data } = await api.patch<RequestingExam>(`/exames-de-sangue-historico/${id}`, payload);

      set((state) => ({ exams: state.exams.map((exam) => (exam.id === id ? data : exam)) }));
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  addExam: async (payload) => {
    try {
      const { data } = isRequestingExam(payload) ?
        await api.post<RequestingExam>('/exames-de-sangue-historico', payload) :
        await api.post<RequestingExamAttachment>('/exame-de-sangue-anexo', payload);

      set((state) => ({ exams: [data, ...state.exams] }));

      return data.id as string ?? false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  duplicateExam: async (exam) => {
    try {
      const { data } = await api.get<RequestingExam>('/exames-de-sangue-historico/clone/' + exam.id);

      set((state) => ({ exams: [data, ...state.exams] }));

      return data ?? false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  removeExam: async (exam) => {
    try {
      set((state) => ({ exams: state.exams.filter((e) => e.id !== exam.id) }));

      isRequestingExam(exam) ? await api.delete(`/exames-de-sangue-historico/${exam.id}`) : await api.delete(`/exame-de-sangue-anexo/${exam.id}`)
    } catch (error) {
      console.error(error);
      return false;
    }
  },
}));