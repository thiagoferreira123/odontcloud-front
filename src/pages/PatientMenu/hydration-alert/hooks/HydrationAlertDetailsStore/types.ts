import { QueryClient } from "@tanstack/react-query";

export interface HydrationAlert {
  id?: number;
  patient_id: number;
  professional_id?: number;
  time_zone: string;
  message: string;
  time: string;
  quantity_ml: number;
  total_quantity_ml: string;
}

export interface RemoveHydrationAlertParam {
  id: number;
  patient_id: number;
}

export type HydrationAlertActions = {
  addHydrationAlert: (patientDetailData: HydrationAlert[], queryClient: QueryClient, patientToken: string) => Promise<HydrationAlert[] | false>;
  removeHydrationAlert: (ids: number[], token: string) => Promise<boolean>;
};

export type HydrationAlertStore = {
  getHydrationAlertDetail: (patient_id: number) => Promise<HydrationAlert[] | false>;
} & HydrationAlertActions;
