import { QueryClient } from "@tanstack/react-query";
import { Professional } from "../../../MySettings/hooks/ProfessionalStore/types";

export enum ScheduleType {
  CONSULTA = 'CONSULTATION',
  RETORNO = 'RETURN',
  POSSIVEL_RETORNO = 'POSSIBLE_RETURN',
  OUTROS = 'OTHER',
  AGENDADO_SITE = 'SCHEDULED_WEBSITE',
}

export enum ScheduleStatus {
  AGENDADO = 'SCHEDULED',
  CONFIRMADO = 'CONFIRMED',
  CANCELADO = 'CANCELLED',
  PENDENTE = 'PENDING',
  NAO_COMPARECEU = 'NO_SHOW',
}

export type Schedule = {
  calendar_id?: string;
  calendar_clinic_id?: string;
  calendar_name: string;
  calendar_type: ScheduleType;
  calendar_professional_id: string;
  calendar_patient_id?: string;
  calendar_phone?: string;
  calendar_email?: string;
  calendar_agreement?: string;
  calendar_date: string;
  calendar_start_time: string;
  calendar_end_time: string;
  calendar_medical_insurance: string;
  calendar_observation: string;
  calendar_status: ScheduleStatus;
  calendar_recurrence?: string;
  calendar_recurrence_type?: string;
  calendar_recurrence_quantity?: string;
  calendar_recurrency_type_qnt?: string;
  calendar_recurrence_date_end?: string;
};

export type ScheduleActions = {
  addSchedule: (payload: Partial<Schedule>, queryClient: QueryClient) => Promise<Schedule | false>;
  buildRecurrencySchedules: (payload: Partial<Schedule>) => Partial<Schedule>[] | false;
  updateSchedule: (payload: Partial<Schedule> & { calendar_id: string }, queryClient: QueryClient) => Promise<Schedule | false>;
  removeSchedule: (scheduleId: string, queryClient: QueryClient) => Promise<boolean>;
};

export type ScheduleStore = {
  getSchedules: () => Promise<Schedule[] | false>;
} & ScheduleActions;
