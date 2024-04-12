import { SingleValue } from 'react-select';
import { create } from 'zustand';
import { Local, appointmentOptions } from '../../../types/Events';
import { Option } from '../../../types/inputs';
import { ScheduleStatus, ScheduleType } from './ScheduleStore/types';

type CalendarStore = {
  event: FormEventModel;
  selectedLocal: SingleValue<Local> | null;
  setLocal: (local: SingleValue<Local>) => void;
  setEvent: (event: Partial<FormEventModel>) => void;
  resetEvent: () => void;
};

export type FormEventModel = {
  calendar_id?: string;
  calendar_name: SingleValue<Option>;
  calendar_status: ScheduleStatus | '';
  calendar_type: SingleValue<{ value: ScheduleType, label: string }>;
  calendar_professional_id: string;
  calendar_email: string;
  calendar_phone: string;
  calendar_date: string;
  calendar_start_time?: string;
  calendar_end_time?: string;
  calendar_medical_insurance: string;
  calendar_observation: string;
  calendar_recurrence?: SingleValue<{ value: string; label: string }>;
  calendar_recurrence_type?: string;
  calendar_recurrence_quantity?: string;
  calendar_recurrency_type_qnt?: string;
  calendar_recurrence_date_end?: string;
  calendar_agreement?: string;
  calendar_patient_id?: string;
}

const initialState: FormEventModel = {
  calendar_name: null,
  calendar_status: '',
  calendar_type: appointmentOptions[0],
  calendar_professional_id: '',
  calendar_email: '',
  calendar_phone: '',
  calendar_date: '',
  calendar_start_time: '',
  calendar_end_time: '',
  calendar_medical_insurance: '',
  calendar_observation: '',
  calendar_recurrence: null,
  calendar_recurrence_type: '',
  calendar_recurrence_date_end: '',
  calendar_recurrence_quantity: '',
  calendar_recurrency_type_qnt: '',
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
