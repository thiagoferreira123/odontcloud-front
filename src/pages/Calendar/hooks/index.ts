import { SingleValue } from 'react-select';
import { create } from 'zustand';
import { EventStatus, EventType, Local, appointmentOptions } from '../../../types/Events';
import { Option } from '../../../types/inputs';
import { HealthInsurance } from './HealthInsuranceStore/types';

type CalendarStore = {
  event: FormEventModel;
  selectedLocal: SingleValue<Local> | null;
  setLocal: (local: SingleValue<Local>) => void;
  setEvent: (event: Partial<FormEventModel>) => void;
  resetEvent: () => void;
};

export type FormEventModel = {
  calendar_status: EventStatus | '';
  calendar_name: SingleValue<Option>;
  calendar_type: SingleValue<{ value: EventType; label: string }>;
  calendar_video_conference: number;
  calendar_email: string;
  calendar_phone: string;
  calendar_date: string;
  calendar_start_time: string | undefined;
  calendar_end_time: string | undefined;
  calendar_health_insurance_id?: SingleValue<HealthInsurance>;
  calendar_timezone: SingleValue<{ value: string; label: string }>;
  calendar_recurrence?: SingleValue<{ value: string; label: string }>;
  calendar_recurrence_type?: string;
  calendar_recurrence_date_end?: string;
  calendar_recurrence_quantity?: string;
  calendar_recurrency_type_qnt?: string;
  calendar_observation: string;
  id?: number;
};

const initialState: FormEventModel = {
  calendar_name: null,
  calendar_type: appointmentOptions[0],
  calendar_video_conference: 0,
  calendar_email: '',
  calendar_phone: '',
  calendar_date: '',
  calendar_start_time: '',
  calendar_end_time: '',
  calendar_health_insurance_id: null,
  calendar_timezone: null,
  calendar_observation: '',
  calendar_recurrence: null,
  calendar_recurrence_type: '',
  calendar_recurrence_date_end: '',
  calendar_recurrence_quantity: '',
  calendar_recurrency_type_qnt: '',
  calendar_status: '',
};

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  event: initialState,
  selectedLocal: null,
  setLocal: (selectedLocal) => set({ selectedLocal }),
  resetEvent: () => set({ event: initialState }),
  setEvent: (model) => {
    const { event } = get();
    set({ event: { ...event, ...model } });
  },
}));
