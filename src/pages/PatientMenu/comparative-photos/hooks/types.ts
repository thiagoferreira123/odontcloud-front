import { QueryClient } from "@tanstack/react-query";

export interface ComparativePhotos {
  id: number;
  patient_id: number;
  professional_id: number;
  host: string;
  folder: string;
  filename: string;
  section: SectionType;
  date: string;
  observation: string;
}

export type SectionType = 'UM' | 'DOIS' | 'TRES';

export type ComparativePhotosActions = {
  addComparativePhotosDetail: (patientDetailData: Partial<ComparativePhotos>, queryClient: QueryClient) => Promise<ComparativePhotos | false>;
  removeComparativePhotosDetail: (id: ComparativePhotos, queryClient: QueryClient) => Promise<boolean>;
};

export type ComparativePhotosStore = {
  getComparativePhotosDetail: (patient_id: number) => Promise<ComparativePhotos[] | false>;
} & ComparativePhotosActions;
