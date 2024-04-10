import { QueryClient } from "@tanstack/react-query";

export type PatientFolderStore = {
  loadingCount: number;
  uploadedFiles: {file: PatientFile, remove: () => void}[];

  increaseLoadingCount: () => void;
  decreaseLoadingCount: () => void;
  addUploadedFile: (uploadedFile: {file: PatientFile, remove: () => void}) => void;
  removeUploadedFile: (uploadedFile: PatientFile) => void;
  getPatientFiles: (documents_patient_id: string) => Promise<PatientFile[] | false>;
} & PatientFileActions;

export type PatientFileActions = {
  addPatientFile: (payload: {file: PatientFile, remove: () => void}, queryClient: QueryClient) => Promise<boolean>;
  updatePatientFile: (payload: PatientFile, queryClient: QueryClient) => Promise<PatientFile | false>;
  removePatientFile: (payload: PatientFile, queryClient: QueryClient) => Promise<boolean>;
};

export interface PatientFile {
  documents_id: string;
  documents_patient_id: string;
  documents_folder_name?: string;
  documents_upload_date?: string;
  documents_aws_link?: string;
}
