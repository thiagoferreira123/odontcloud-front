import { create } from 'zustand';
import api from '../../../services/useAxios';
import { AxiosError } from 'axios';
import { User } from '../../Auth/Login/hook/types';

export type ServiceLocation = {
  id: number;
  cep: string;
  nome: string;
  telefone: string;
  rua: string;
  bairro: string;
  numero: string;
  complemento: string;
  uf: string;
  cidade: string;
  profissional: number;
  cor: string;
  ativo: number;
  logo: string;
  dias_semana: string;
  hora_inicio: string;
  hora_final: string;
  almoco_inicio: string;
  almoco_final: string;
  exibir_agenda: number;
  valor_consulta: string;
  valor_retorno: string;
  exibir_valor: number;
  url_base_logo: string;
  duracao_consulta: string;
  duracao_retorno: string;
  endereco_completo: string;
  agendaSecretarias: [
    {
      id: number;
      nome: string;
      email: string;
      senha: string;
      id_profissional: number;
      id_local: number;
    }
  ];
  userr?: User;
};

interface SchedulesStore {
  getSchedules: (base64LocationId: string) => Promise<Schedule[] | false>;
  getServiceLocation: (base64LocationId: string) => Promise<ServiceLocation | false>;
  createSchedule: (schedule: ScheduleDto) => Promise<boolean>;
}

export interface Schedule {
  profissional_locais_duracao_consulta: string;
  profissional_locais_duracao_retorno: string;
  mes: number;
  dia: number;
  id_consulta: number;
  calendar_start_time: string;
  calendar_end_time: string;
  local_inicio: string;
  local_final: string;
}

export enum TipoConsulta {
  CONSULTA = 'CONSULTA',
  RETORNO = 'RETORNO',
  POSSIVEL_RETORNO = 'POSSIVEL_RETORNO',
  AGENDADO_SITE = 'AGENDADO_SITE',
  OUTROS = 'OUTROS',
}

export interface ScheduleDto {
  calendar_name: string;
  calendar_phone: string;
  calendar_email: string;
  calendar_health_insurance_id: number;
  calendar_date: string;
  calendar_start_time: string;
  calendar_end_time: string;
  calendar_type?: TipoConsulta;
  calendar_observation?: string;
  calendar_status?: 'AGENDADO';
  calendar_professional_id?: number;
  calendar_patient_id?: number;
  calendar_secretary_id?: number;
  calendar_location_id: number;
  calendar_timezone?: string;
  calendar_video_conference?: number;
  calendar_recurrence: 'recorrencia';
  calendar_recurrence_type: 'quantidade';
  calendar_recurrence_quantity: 0;
  calendar_recurrency_type_qnt: 0;
}

export const useSchedulesStore = create<SchedulesStore>((set) => ({
  getSchedules: async (base64LocationId) => {
    try {
      const { data } = await api.get(`/agenda/busyDates/${atob(base64LocationId)}`);

      return data ?? false;
    } catch (error) {
      console.error(error);

      if (error instanceof AxiosError && error.response?.status === 404) return [];

      return false;
    }
  },

  getServiceLocation: async (base64LocationId) => {
    try {
      const { data } = await api.get(`/local-atendimento/${atob(base64LocationId)}`);

      return data ?? false;
    } catch (error) {
      console.error(error);

      return false;
    }
  },

  createSchedule: async (schedule) => {
    try {
      const { data } = await api.post('/agenda', schedule);

      return data ?? false;
    } catch (error) {
      console.error(error);

      return false;
    }
  },
}));
