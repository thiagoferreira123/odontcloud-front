import { checkIfDateIsValid } from "../helpers/DateHelper";
import { isObject } from "../helpers/Utils";

export type Patient = {
  patient_id: string;
  patient_clinic_id: string;
  patient_last_interaction: string;
  patient_full_name: string;
  patient_photo?: string;
  patient_birth_date: string;
  patient_cpf: string;
  patient_rg?: string;
  patient_issuer?: string;
  patient_sex: number;
  patient_marital_status: string;
  patient_health_insurance?: string;
  patient_health_insurance_number?: string;
  patient_medical_record_number?: string;
  patient_reference?: string;
  patient_mobile_phone?: string;
  patient_phone?: string;
  patient_email?: string;
  patient_extra_contact_full_name?: string;
  patient_extra_contact_cpf?: string;
  patient_extra_contact_mobile_phone?: string;
  patient_extra_contact_relationship: string;
  patient_zip_code?: string;
  patient_number?: string;
  patient_street?: string;
  patient_complement?: string;
  patient_neighborhood?: string;
  patient_city?: string;
  patient_state?: string;
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

