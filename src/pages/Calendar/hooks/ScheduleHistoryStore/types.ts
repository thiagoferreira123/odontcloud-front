import { QueryClient } from "@tanstack/react-query";
import { Professional, Secretary, User } from "../../../Auth/Login/hook/types";

export enum ScheduleHistoryOwnerType {
  PROFISSIONAL = 'PROFISSIONAL', COLABORADOR = 'COLABORADOR'
}

export type ScheduleHistory = {
  calendar_history_id?: number;
  calendar_history_description: string;
  calendar_history_date: string;
  calendar_history_owner_type: ScheduleHistoryOwnerType;
  calendar_history_owner_id: number;
  calendar_history_location_id: number;
  calendar_history_schedule_id: number | null;
  calendar_history_professional?: Professional;
  calendar_history_colaborator?: Secretary;
};

export type ScheduleHistoryActions = {
  addScheduleHistory: (scheduleData: Partial<ScheduleHistory>, queryClient: QueryClient) => Promise<ScheduleHistory | false>;
};

export type ScheduleHistoryStore = {
  getScheduleHistorys: (idLocal: number) => Promise<ScheduleHistory[] | false>;
} & ScheduleHistoryActions;
