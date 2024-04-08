export type FormPatientNotRegisteredFilesStore = {
  loadingCount: number;
  uploadedFiles: {file: FormFile, remove: () => void}[];

  removeFormFile: (FormFileData: FormFile) => Promise<boolean>;
}

export interface FormFile {
  id: number,
  formulario_id: number,
  file_name: string,
  aws_file_name: string
}
