import { QueryClient } from "@tanstack/react-query";
import { SendingMaterial } from "../../../types/SendingMaterial";

export type PatientAttachmentMaterialsStore = {
  // eslint-disable-next-line no-unused-vars
  getPatientAttachmentMaterials: (professional_id: number) => Promise<SendingMaterial[] | false>;
} & PatientAttachmentMaterialsActions;

export type PatientAttachmentMaterialsActions = {
  addPatientAttachmentMaterials: (PatientAttachmentMaterialsData: PatientAttachmentMaterials, queryClient: QueryClient) => Promise<number | false>;
  removePatientAttachmentMaterials: (id: number, patientId: number, queryClient: QueryClient) => Promise<boolean>;
  getAllPatientAttachmentMaterialsByPatientId: (patientId: number) => Promise<PatientAttachmentMaterials[] | false>;
};


export interface PatientAttachmentMaterials {
  id: number;
  name: string;
  s3_link: string;
  user_link: string;
  user_text: string;
  professional_id: number;
  patient_id?: number;
}

export interface PatientAttachmentMaterialsPatient {
  id: number;
  patient_id: number;
  materials_id: number;
  active: string;
  professional_id: number;
}

