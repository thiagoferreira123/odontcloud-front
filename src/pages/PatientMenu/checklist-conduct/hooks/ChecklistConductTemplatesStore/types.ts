import { QueryClient } from "@tanstack/react-query";

export interface ChecklistConductTemplate {
  id: number;
  identification: string;
  creation_data: Date;
  patient_id: number;
  items: ChecklistConductTemplateItem[];
}

export interface ChecklistConductTemplateItem {
  id?: number;
  name: string;
  markedAsDone: 'SIM' | 'NAO';
  position: number;
  conduct_list_id?: number;
}

export type ChecklistConductTemplatesActions = {
  addChecklistConductTemplate: (checklistData: Partial<ChecklistConductTemplate>, queryClient: QueryClient) => Promise<ChecklistConductTemplate | false>;
  updateChecklistConductTemplate: (checklistData: ChecklistConductTemplate, queryClient: QueryClient) => Promise<boolean>;
  removeChecklistConductTemplate: (checklistData: ChecklistConductTemplate, queryClient: QueryClient) => Promise<boolean>;
};

export type ChecklistConductTemplatesStore = {
  getMyChecklistConduct: () => Promise<ChecklistConductTemplate[] | false>;
  getChecklistConductTemplates: () => Promise<ChecklistConductTemplate[] | false>;
} & ChecklistConductTemplatesActions;
