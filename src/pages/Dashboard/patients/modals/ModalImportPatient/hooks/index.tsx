import { create } from 'zustand';
import { Patient } from '../../../../../../types/Patient';

interface ModalImportPatientStore {
  fileTitles: string[];
  jsonFile: string[][];

  selectedIndexes: string[];
  selectedLocal: number;

  setSelectedLocal: (selectedLocal: number) => void;
  setFileTitles: (fileTitles: string[]) => void;
  setJsonFile: (jsonFile: string[][]) => void;
  setSelectedIndexes: (selectedIndexes: string[]) => void;
}

export interface SuccessResponse {
  message: string;
  data: {
    pacientesCriados: (Patient & { id: number })[];
    registrosIgnorados: number;
    detalhesIgnorados: {
      email: string;
      motivo: string;
    }[];
  };
  error?: boolean;
}

export const useModalImportPatientStore = create<ModalImportPatientStore>((set) => ({
  fileTitles: [],
  jsonFile: [],
  selectedIndexes: Array(11).fill(null),
  selectedLocal: 0,

  setSelectedLocal: (selectedLocal) => set({ selectedLocal }),
  setFileTitles: (fileTitles) => set({ fileTitles }),
  setJsonFile: (jsonFile) => set({ jsonFile }),
  setSelectedIndexes: (selectedIndexes) => set({ selectedIndexes }),
}));
