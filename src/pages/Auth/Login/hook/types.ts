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

export interface User {
  clinic_id: string;
  clinic_email: string;
  clinic_full_name: string;
  clinic_password: string;
  clinic_phone: string;
  clinic_reset_password_token?: string;
  clinic_reset_password_token_expires?: Date;
  clinic_cnpj_or_cpf?: string;
  clinic_zipcode?: string;
  clinic_state?: string;
  clinic_city?: string;
  clinic_neighborhood?: string;
  clinic_street?: string;
  clinic_number?: number;
  clinic_logo_link: string;
  clinic_signature_link: string;
  subscription: {
    id: number,
    stripeSubscriptionId: string,
    userId: number,
    status: 'active' | 'canceled' | 'trialing' | 'past_due' | 'unpaid',
  }
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