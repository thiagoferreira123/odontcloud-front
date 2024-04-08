import { QueryClient } from "@tanstack/react-query";
import { Attachment } from "../../../../MyMaterials/my-attachments/hooks";

export type AttachmentMaterialsStore = {
  query: string;

  setQuery: (query: string) => void;
  // eslint-disable-next-line no-unused-vars
  getAttachmentMaterials: (id: number) => Promise<Attachment[] | false>;
} & AttachmentMaterialsActions;

export type AttachmentMaterialsActions = {
  postMaterialToPatient: (attachment: Attachment, patient_id: number, queryClient: QueryClient) => Promise<boolean>;
  deleteMaterialFromPatient: (attachment: Attachment, queryClient: QueryClient) => Promise<boolean>;
};

export interface AttachmentMaterialsPatient {
  id: number;
  patient_id: number;
  materials_id: number;
  active: string;
  professional_id: number;
}

