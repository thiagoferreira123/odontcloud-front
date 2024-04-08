import { checkIfDateIsValid } from "../helpers/DateHelper";
import { isObject } from "../helpers/Utils";

export type Patient = {
  id?: number;
  professional?: number;
  name: string;
  photoLink: string;
  email: string;
  gender: number;
  pregnant: number;
  dateOfBirth: string; // ou Date, se você estiver usando objetos Date
  dateOfFirstConsultation: Date; // ou Date, se você estiver usando objetos Date
  dateOfLastConsultation: Date; // ou Date, se você estiver usando objetos Date
  reasonForConsultation: string;
  consultationLocation: number;
  consultationCompletedOrPending: null | 'Finalizada' | 'Pendente'; // Assumindo que pode ser um número ou nulo
  patientActiveOrInactive: number;
  passwordMobileAndWeb: number;
  cpf: null | string; // Assumindo que pode ser um string ou nulo
  ddiCountry: string;
  ddiCountryNumber: string;
  phone: null | string; // Assumindo que pode ser um string ou nulo
  cep: null | string; // Assumindo que pode ser um string ou nulo
  state: null | string; // Assumindo que pode ser um string ou nulo
  city: string;
  neighborhood: null | string; // Assumindo que pode ser um string ou nulo
  street: null | string; // Assumindo que pode ser um string ou nulo
  houseNumber: null | string; // Assumindo que pode ser um string ou nulo
  observation: null | string; // Assumindo que pode ser um string ou nulo
  appPlansOnOrOff: number;
  appAnthropometryOnOrOff: number;
  appGoalsOnOrOff: number;
  appRecipesOnOrOff: number;
  appSuplementationOnOrOff: number;
  appDialyOnOrOff: number;
  inactivateAppDate: null | string; // ou Date, se você estiver usando objetos Date
  deviceToken: null | string; // Assumindo que pode ser um string ou nulo
  age: number;
  localAtendimento?: ConsultationLocationResume;

  key?: string; // Adicionando a chave para uso no IndexedDB

  [key: string]: unknown;
}

export type ReasonForConsultation = {
  id: number,
  idProfissional: number,
  descricao: string,
  dataCadastro: string
}

export type ConsultationLocationResume = {
  id: number,
  nome: string,
}

export function isPatient(patient: unknown): patient is Patient {
  if (!isObject(patient)) return false;

  const requiredStringProperties = [
    'name', 'email', 'dateOfBirth'
  ];
  const requiredNumberProperties = [
    'id', 'gender', 'consultationLocation', 'patientActiveOrInactive', 'appPlansOnOrOff', 'appAnthropometryOnOrOff', 'appGoalsOnOrOff',
    'appRecipesOnOrOff', 'appSuplementationOnOrOff', 'appDialyOnOrOff'
  ];
  const dateProperties = ['dateOfFirstConsultation', 'dateOfLastConsultation'];

  // Verifica propriedades obrigatórias de string
  for (const prop of requiredStringProperties) {
    if (!(prop in patient) || typeof patient[prop] !== 'string') return false;
  }

  // Verifica propriedades obrigatórias de número
  for (const prop of requiredNumberProperties) {
    if (!(prop in patient) || typeof patient[prop] !== 'number') return false;
  }

  // Verifica propriedades de data
  for (const prop of dateProperties) {
    if (!(prop in patient) || !checkIfDateIsValid(new Date(patient[prop] as string))) return false;
  }

  // // Verifica propriedades opcionais que, se presentes, devem ter tipos específicos
  // const optionalStringOrNullProperties = ['cep', 'state', 'neighborhood', 'street', 'houseNumber', 'observation', 'inactivateAppDate', 'deviceToken', 'key'];
  // for (const prop of optionalStringOrNullProperties) {
  //   if (prop in patient && patient[prop] !== null && typeof patient[prop] !== 'string') return false;
  // }

  // if ('localAtendimento' in patient && patient['localAtendimento'] !== undefined && typeof patient['localAtendimento'] !== 'object') return false;

  // Adicione mais verificações conforme necessário para validar todas as propriedades
  return true;
}

