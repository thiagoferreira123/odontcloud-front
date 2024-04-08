import { QueryClient } from "@tanstack/react-query";

export interface ConductItem {
  id: number;
  name: string;
  markedAsDone: string;
  position: number;
  conduct_list_id: number;
}

export interface ConductList {
  id: number;
  identification: string;
  creation_data: string;
  patient_id: number;
  items: ConductItem[];
}

export type ConductActions = {
  addConduct: (conductData: Partial<ConductItem>, queryClient: QueryClient) => Promise<number | false>;
  updateConduct: (conductData: ConductItem, queryClient: QueryClient) => Promise<boolean>;
  removeConduct: (conductId: number, queryClient: QueryClient) => Promise<boolean>;
};

export type ConductStore = {
  getConductList: (patient_id: number) => Promise<ConductList[] | false>;
} & ConductActions;
