import { QueryClient } from "@tanstack/react-query";

export interface WaitingList {
  calendar_waiting_list_id: number,
  calendar_waiting_list_name: string,
  calendar_waiting_list_email: string,
  calendar_waiting_list_phone: string,
  calendar_waiting_list_annotation: string,
  calendar_waiting_list_health_insurance_id: number,
  calendar_waiting_list_schedule_type: string,
  calendar_waiting_list_date_entry_list: string,
  calendar_waiting_list_secretary_id: number,
  calendar_waiting_list_professional_id: number,
  calendar_waiting_list_location_id: number,
}

export type WaitingListActions = {
  addWaitingList: (waitinglistDetailData: Partial<WaitingList>, queryClient: QueryClient) => Promise<WaitingList | false>;
  removeWaitingList: (waitinglist: WaitingList, queryClient: QueryClient) => Promise<boolean>;
};

export type WaitingListStore = {
  getWaitingList: () => Promise<WaitingList[] | false>;
} & WaitingListActions;
