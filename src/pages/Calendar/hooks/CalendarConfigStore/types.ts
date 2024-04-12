import { QueryClient } from "@tanstack/react-query";

export type CalendarConfig = {
  calendar_config_id?: string;
  calendar_config_clinic_id?: string;
  calendar_config_time_start: string;
  calendar_config_time_end: string;
  calendar_config_interval_start: string;
  calendar_config_interval_end: string;
  calendar_config_service_days: string | null;
};

export type CalendarConfigActions = {
  addCalendarConfig: (payload: Partial<CalendarConfig>, queryClient: QueryClient) => Promise<CalendarConfig | false>;
  updateCalendarConfig: (payload: Partial<CalendarConfig> & { calendar_config_id: string }, queryClient: QueryClient) => Promise<CalendarConfig | false>;
  removeCalendarConfig: (scheduleId: string, queryClient: QueryClient) => Promise<boolean>;
};

export type CalendarConfigStore = {
  getCalendarConfigs: () => Promise<CalendarConfig | false>;
} & CalendarConfigActions;
