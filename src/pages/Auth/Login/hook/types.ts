import { LocalAtendimento } from "../../../../types/FormBuilder";

export interface LoginValues {
  email: string;
  password: string;
}

export interface ResetPasswordValues {
  password: string;
  passwordConfirm: string;
  token: string;
}

export interface RegisterValues {
  clinic_full_name: string;
  clinic_email: string;
  clinic_password: string;
  clinic_password_confirm: string;
  clinic_phone: string;
  clinic_terms: boolean;
}

export type CreateAuthStore = {
  isLoggedIn: boolean;
  user: User | null;
  login: (values: LoginValues) => Promise<User>;
  register: (values: RegisterValues) => Promise<void>;
  forgotPassword: (values: { email: string }) => Promise<void>;
  resetPassword: (values: ResetPasswordValues) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  getUser: () => User | null;
  setUser: (user: User) => void;
}

export type User = Professional | Secretary;

export interface Professional {
  id: number;
  email: string;
  nome_completo: string;
  image: string;
  crn: string;
  cpf: string;
  endereco: string;
  bairro: string;
  ddi_pais: string;
  ddi: string;
  telefone: string;
  abreviatura_tratamento: string;
  admin: number;
  free: null | number; // Presumindo que pode ser um número ou nulo
  link_reset: string;
  id_cidade: number;
  id_estado: string;
  imagem_assinatura: string;
  token: null | string; // Presumindo que pode ser um string ou nulo
  ativo: number;
  url_base_assinatura: string;
  data_cadastro: string; // Ou Date, se for manipular como objeto Date
  token_app: string;
  especialidades: string;
  zipCode: string;
  locationsService?: LocalAtendimento[];
  subscriptionStatus?: SubscriptionStatus;
  role?: Role;
}

export interface Secretary {
  id: number;
  nome: string;
  email: string;
  senha: string;
  id_profissional: number;
  id_local: number;
  role?: Role;
}

export enum Role {
  PROFESSIONAL = 'profissional',
  SECRETARY = 'secretaria',
}

interface SubscriptionStatus {
  id: number,
  status: string,
  data: string,
  cancellationDate: string
}