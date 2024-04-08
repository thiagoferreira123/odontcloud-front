import { QueryClient } from "@tanstack/react-query";

export type AnamnesisStore = {
  getAnamnesis: (patient_id: number) => Promise<Anamnesis[] | false>;
} & AnamnesisActions;

export type AnamnesisActions = {
  addAnamnesis: (anamnesisData: Partial<Anamnesis>, queryClient: QueryClient) => Promise<Anamnesis | false>;
  updateAnamnesis: (anamnesisData: Anamnesis, queryClient: QueryClient) => Promise<boolean>;
  removeAnamnesis: (anamnesisData: Anamnesis, queryClient: QueryClient) => Promise<boolean>;
};

export interface Anamnesis {
  id: number;
  date: string;
  identification: string;
  patient_id: number;
  professional_id: number;
  textFromAnamnesis: string | null;
}
