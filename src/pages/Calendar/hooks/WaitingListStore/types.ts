import { QueryClient } from "@tanstack/react-query";

export interface WaitingList {
  calendar_waiting_list_id: string;
  calendar_waiting_list_clinic_id: string;
  calendar_waiting_list_patient_name: string;
  calendar_waiting_list_email: string;
  calendar_waiting_list_contact: string;
  calendar_waiting_list_health_insurance: string;
  calendar_waiting_list_appointment_type: string;
  calendar_waiting_list_observation: string;
  calendar_waiting_list_scheduling_date: string;
}

export type WaitingListActions = {
  addWaitingList: (payload: Partial<WaitingList>, queryClient: QueryClient) => Promise<WaitingList | false>;
  removeWaitingList: (waitinglist: WaitingList, queryClient: QueryClient) => Promise<boolean>;
};

export type WaitingListStore = {
  getWaitingList: () => Promise<WaitingList[] | false>;
} & WaitingListActions;
