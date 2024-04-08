import { QueryClient } from "@tanstack/react-query";

export type PatientFolderStore = {
  loadingCount: number;
  uploadedFiles: {file: PatientFile, remove: () => void}[];

  increaseLoadingCount: () => void;
  decreaseLoadingCount: () => void;
  // eslint-disable-next-line no-unused-vars
  addUploadedFile: (uploadedFile: {file: PatientFile, remove: () => void}) => void;
  // eslint-disable-next-line no-unused-vars
  removeUploadedFile: (uploadedFile: PatientFile) => void;
  // eslint-disable-next-line no-unused-vars
  getPatientFiles: (patient_id: number) => Promise<PatientFile[] | false>;
} & PatientFileActions;

export type PatientFileActions = {
  // eslint-disable-next-line no-unused-vars
  addPatientFile: (PatientFileData: {file: PatientFile, remove: () => void}, queryClient: QueryClient) => Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  updatePatientFile: (PatientFileData: PatientFile, queryClient: QueryClient) => Promise<PatientFile | false>;
  // eslint-disable-next-line no-unused-vars
  removePatientFile: (PatientFileData: PatientFile, queryClient: QueryClient) => Promise<boolean>;
};

export interface PatientFile {
  id: number,
  pacienteId: number,
  fileName: string,
  awsFileName: string,
  createdAt: string
}
