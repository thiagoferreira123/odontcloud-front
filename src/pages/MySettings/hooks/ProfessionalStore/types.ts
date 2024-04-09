import { QueryClient } from "@tanstack/react-query";

export interface Professional {
  professional_id?: string;
  professional_clinic_id?: string;
  professional_email: string;
  professional_full_name: string;
  professional_specialty: string;
  professional_phone: string;
  professional_cro_state: string;
  professional_cro_number: string;
  professional_photo_link?: string;
}

export type ProfessionalActions = {
  addProfessional: (payload: Partial<Professional>, queryClient: QueryClient) => Promise<Professional | false>;
  updateProfessional: (payload: Professional, queryClient: QueryClient) => Promise<boolean>;
  removeProfessional: (certificate: Professional, queryClient: QueryClient) => Promise<boolean>;
};

export type ProfessionalStore = {
  getProfessionals: (professional_clinic_id: string) => Promise<Professional[] | false>;
} & ProfessionalActions;
