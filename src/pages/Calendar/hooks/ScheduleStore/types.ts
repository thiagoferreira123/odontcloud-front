import { QueryClient } from "@tanstack/react-query";
import { RecurrenceType } from "../../../../types/Events";

export enum EventType {
  CONSULTA = 'CONSULTA',
  RETORNO = 'RETORNO',
  POSSIVEL_RETORNO = 'POSSIVEL_RETORNO',
  OUTROS = 'OUTROS',
  AGENDADO_SITE = 'AGENDADO_SITE',
}

export enum EventStatus {
  CONFIRMADO = 'CONFIRMADO',
  PENDENTE = 'PENDENTE',
  AGENDADO = 'AGENDADO',
  CANCELADO = 'CANCELADO',
  NAO_COMPARECEU = 'NAO_COMPARECEU',
}

export type Schedule = {
  id?: number;
  calendar_name: string;
  calendar_phone: string;
  calendar_email: string;
  calendar_date: string;
  calendar_start_time: string;
  calendar_end_time: string;
  calendar_type: EventType;
  calendar_observation: string;
  calendar_status: EventStatus;
  calendar_professional_id?: number;
  calendar_patient_id?: number;
  calendar_health_insurance_id?: number | null;
  calendar_location_id: number;
  calendar_timezone?: string | null;
  calendar_video_conference: string | number | readonly string[] | undefined;
  calendar_recurrence?: string;
  calendar_recurrence_type?: RecurrenceType;
  calendar_recurrence_quantity?: number;
  calendar_recurrence_date_end?: string | null;
  calendar_recurrency_type_qnt?: number;
  calendar_secretary_id?: number;
  // calendar_recurrency_type_start_date?: number;
  calendar_secretary?: {
    calendar_secretary_id: number;
    calendar_secretary_name: string;
    calendar_secretary_responsible: string;
    calendar_secretary_date_insertion: string;
    calendar_secretary_status: string;
  };
  alertas?: {}[];
};

export type ScheduleActions = {
  addSchedule: (scheduleData: Partial<Schedule>, queryClient: QueryClient) => Promise<Schedule | false>;
  buildRecurrencySchedules: (scheduleData: Partial<Schedule>) => Partial<Schedule>[] | false;
  updateSchedule: (scheduleData: Partial<Schedule> & { id: number }, queryClient: QueryClient) => Promise<Schedule | false>;
  removeSchedule: (scheduleId: number, calendar_location_id:number, queryClient: QueryClient) => Promise<boolean>;
};

export type ScheduleStore = {
  getSchedules: (calendar_location_id: number) => Promise<Schedule[] | false>;
} & ScheduleActions;
