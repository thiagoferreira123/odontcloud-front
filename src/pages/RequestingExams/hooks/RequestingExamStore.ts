import { MultiValue } from "react-select";
import { create } from "zustand";
import { RequestingExam, SelectedExam } from "../../../types/RequestingExam";
import { Patient } from "../../../types/Patient";
import { Option } from "../../../types/inputs";
import api from "../../../services/useAxios";

interface RequestingExamStore {
  selectedExams: SelectedExam[];
  selectedExamOptions: Option[];

  patient: Patient | null;

  // eslint-disable-next-line no-unused-vars
  getRequestingExam: (id: string) => Promise<RequestingExam | false>;

  // eslint-disable-next-line no-unused-vars
  setSelectedExamOptions: (selectedExamOptions: MultiValue<Option>) => void;
  // eslint-disable-next-line no-unused-vars
  setSelectedExams: (selectedExams: SelectedExam[]) => void;
  // eslint-disable-next-line no-unused-vars
  addSelectedExams: (exam: SelectedExam[]) => void;
  // eslint-disable-next-line no-unused-vars
  updateSelectedExam: (exam: SelectedExam) => void;
  // eslint-disable-next-line no-unused-vars
  removeSelectedExam: (exam: SelectedExam) => void;
}

export const useRequestingExamStore = create<RequestingExamStore>((set, get) => ({
  selectedExamOptions: [],
  selectedExams: [],

  patient: null,

  getRequestingExam: async (id) => {
    try {


      const { data } = await api.get<RequestingExam>(`/exames-de-sangue-historico/${id}`);

      const selectedExams: SelectedExam[] = get().selectedExams.length ? get().selectedExams : data.examsSelected;

      const selectedExamOptions = get().selectedExamOptions.length ? get().selectedExamOptions : selectedExams.reduce((acc: Option[], exam) => {
        const option = { value: exam.exam.examName, label: exam.exam.examName };
        if (!acc.find((opt) => opt.value === option.value)) acc.push(option);
        return acc;
      }, []);

      set({ selectedExams: selectedExams.map(exam => ({ ...exam, id: btoa(Math.random().toString()) })), selectedExamOptions, patient: data.patient });

      return data;
    } catch (error) {
      console.error(error)
      return false;
    }
  },

  setSelectedExamOptions: (selectedExamOptions) => set({ selectedExamOptions: selectedExamOptions as Option[] }),
  setSelectedExams: (selectedExams) => {
    set({ selectedExams })
  },
  addSelectedExams: (exams) => {
    set((state) => {
      return {
        selectedExams: [...state.selectedExams, ...exams],
        selectedExamOptions: [
          ...state.selectedExamOptions, ...exams.reduce((acc: Option[], exam) => {
            const option = { value: exam.exam.examName, label: exam.exam.examName };
            if (!acc.find((opt) => opt.value === option.value)) acc.push(option);
            return acc;
          }, [])
        ]
      }
    });
  },
  updateSelectedExam: (exam) => {
    set((state) => {
      return { selectedExams: state.selectedExams.map((selectedExam) => selectedExam.id === exam.id ? exam : selectedExam) }
    });
  },

  removeSelectedExam: (exam) => {
    set((state) => {
      return {
        selectedExams: state.selectedExams.filter((selectedExam) => selectedExam.id !== exam.id), selectedExamOptions: state.selectedExamOptions.filter((option) => option.value !== exam.exam.examName)
      }
    });
  }
}));