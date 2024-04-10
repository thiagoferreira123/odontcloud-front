import { QueryClient } from "@tanstack/react-query";

export type AnamnesisStore = {
  getAnamnesis: (anamnesis_patient_id: string) => Promise<Anamnesis[] | false>;
} & AnamnesisActions;

export type AnamnesisActions = {
  addAnamnesis: (payload: Partial<Anamnesis>, queryClient: QueryClient) => Promise<Anamnesis | false>;
  updateAnamnesis: (payload: Anamnesis, queryClient: QueryClient) => Promise<boolean>;
  removeAnamnesis: (payload: Anamnesis, queryClient: QueryClient) => Promise<boolean>;
};

export interface Anamnesis {
  anamnesis_id: string;
  anamnesis_date_creation: string;
  anamnesis_status: string;
  anamnesis_text: string;
  anamnesis_identification: string;
  anamnesis_patient_id: string;
}
