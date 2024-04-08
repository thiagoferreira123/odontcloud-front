import { QueryClient } from "@tanstack/react-query";

export interface ChecklistConduct {
  id: number;
  identification: string;
  creation_data: Date;
  patient_id: number;
  items: ChecklistConductItem[];
}

export interface ChecklistConductItem {
  id?: number;
  name: string;
  markedAsDone: 'SIM' | 'NAO';
  position: number;
  conduct_list_id?: number;
}


export type ChecklistConductsActions = {
  addChecklistConduct: (checklistData: Partial<ChecklistConduct>, queryClient: QueryClient) => Promise<ChecklistConduct | false>;
  updateChecklistConduct: (checklistData: ChecklistConduct, queryClient: QueryClient) => Promise<boolean>;
  removeChecklistConduct: (checklistData: ChecklistConduct, queryClient: QueryClient) => Promise<boolean>;
};

export type ChecklistConductsStore = {
  getChecklistConduct: (patient_id: number) => Promise<ChecklistConduct[] | false>;
} & ChecklistConductsActions;
