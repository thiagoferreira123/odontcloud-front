/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
/* eslint-disable no-unused-vars */
export enum EventType {
  CONSULTA = 'CONSULTA',
  RETORNO = 'RETORNO',
  POSSIVEL_RETORNO = 'POSSIVEL_RETORNO',
  OUTROS = 'OUTROS',
  AGENDADO_SITE = 'AGENDADO_SITE',
}

export enum EventColor {
  CONSULTA = '#0eb0f2',
  RETORNO = '#ebb71a',
  POSSIVEL_RETORNO = '#cf2637',
  OUTROS = '#558df3',
  AGENDADO_SITE = '#5de3c8',
}

export enum EventStatus {
  CONFIRMADO = 'CONFIRMADO',
  PENDENTE = 'PENDENTE',
  AGENDADO = 'AGENDADO',
  CANCELADO = 'CANCELADO',
  NAO_COMPARECEU = 'NAO_COMPARECEU',
}

export enum EventPrint {
  CONFIRMADO = 'CONFIRMADO',
  PENDENTE = 'PENDENTE',
  AGENDADO = 'AGENDADO',
  CANCELADO = 'CANCELADO',
  NAO_COMPARECEU = 'NÃO COMPARECEU',
}

export enum EventStatusColor {
  CONFIRMADO = '#0eb0f2',
  PENDENTE = '#ebb71a',
  AGENDADO = '#ebb71a',
  CANCELADO = '#cf2637',
  NAO_COMPARECEU = '#558df3',
}

export interface EventStatusColorMap {
  [key: string]: string;
}

export const eventStatusColorMap: EventStatusColorMap = {
  [EventStatus.CONFIRMADO]: EventStatusColor.CONFIRMADO,
  [EventStatus.PENDENTE]: EventStatusColor.PENDENTE,
  [EventStatus.AGENDADO]: EventStatusColor.AGENDADO,
  [EventStatus.CANCELADO]: EventStatusColor.CANCELADO,
  [EventStatus.NAO_COMPARECEU]: EventStatusColor.NAO_COMPARECEU,
};

export type CalendarEvent = {
  id: number;
  nome: string;
  ddiPais: string;
  celular: string;
  email: string;
  convenio: number;
  dataConsulta: string;
  horaInicio: string;
  horaFinal: string;
  tipoConsulta: EventType;
  anotacao: string;
  status: EventStatus;
  idProfissional: number;
  idPaciente: number;
  idColaborador: number | null;
  idLocal: number;
  timezone: string | null;
  videoconferencia: string | number | readonly string[] | undefined;
  recorrencia: string;
  recorrenciaTipo: string;
  recorrenciaQuantidade: number;
  recorrenciaDataFim: string | null;
  recorrenciaTipoQtd: number;
  agendaConvenio: {
    id: number;
    nomeConvenio: string;
    responsavel: string;
    dataInsercao: string;
    status: string;
  };
};

export type Local = {
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
  cor: string;
  ativo: number;
  logo: string;
  url_base_logo: null | string;
  dias_semana: null | string;
  hora_inicio: null | string;
  hora_final: null | string;
  almoco_inicio: null | string;
  almoco_final: null | string;
  exibir_agenda: null | number;
  valor_consulta: null | string;
  valor_retorno: null | string;
  exibir_valor: null | string;
  duracao_consulta: string;
  duracao_retorno: string;
  endereco_completo: null | string;
  profissional: number;
};

export type HealthInsurance = {
  id: number;
  nomeConvenio: string;
  responsavel: string;
  dataInsercao: string;
  status: string;
};

export type WaitingList = {
  id: number;
  nome_paciente: string;
  ddiPais: string;
  celular: string;
  email: string;
  anotacao: string;
  id_convenio: number;
  tipoConsulta: string;
  dataEntradaLista: string;
  idSecretaria: number | null;
  idProfissional: number;
  localId: number;
};

export type EventHistory = {
  id?: number;
  descricao: string;
  data: string;
  ownerType: string;
  ownerId: number;
  idLocal: number;
  idAgendamento: number | null;
  profissional?: {
    id: number;
    nome_completo: string;
  };
};

export type RecurrenceType = 'days' | 'weeks' | 'months';

export const appointmentOptions = [
  { label: 'Consulta', value: EventType.CONSULTA },
  { label: 'Retorno', value: EventType.RETORNO },
  { label: 'Possível Retorno', value: EventType.POSSIVEL_RETORNO },
  { label: 'Outros', value: EventType.OUTROS },
  { label: 'Agendado pelo site', value: EventType.AGENDADO_SITE },
];

export const recurrenceOptions = [
  { label: 'Diário', value: 'days' },
  { label: 'Semanal', value: 'weeks' },
  { label: 'Mensal', value: 'months' },
];

export const statusOptions = [
  { label: 'Pendente', value: 'AGENDADO' },
  { label: 'Desmarcada', value: 'CANCELADO' },
  { label: 'Confirmada', value: 'CONFIRMADO' },
  { label: 'Não compareceu', value: 'NAO_COMPARECEU' },
];
