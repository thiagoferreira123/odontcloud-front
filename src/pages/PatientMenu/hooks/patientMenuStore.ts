import { create } from 'zustand';
import { Patient } from '../../../types/Patient';
import { calculateYearsDiffByDateISO } from '../../../helpers/DateHelper';
import api from '../../../services/useAxios';
import { notify } from '../../../components/toast/NotificationIcon';
import { AxiosError } from 'axios';
import { NavigateFunction } from 'react-router-dom';

interface createPatientMenuStore {
  patient_id: string;
  patient: Patient | null;
  query: string;

  setQuery: (query: string) => void;
  getPatient: (patient_id: string, navigate: NavigateFunction) => Promise<Patient & { patient_id: string, age: number } | false>;
  setPatientId: (patient_id: string) => void;
  updatePatient: (patient: Partial<Patient>) => void;
  persistUpdatePatient: (PatientData: Partial<Patient> & { patient_id: string }, hideNotification?: boolean) => Promise<boolean>;
}

export function getAvatarByGender(gender: number) {
  if (gender)
    return '/img/profile/avatar_paciente_masc.png'
  else
    return '/img/profile/avatar_paciente_fem.png'
}

const usePatientMenuStore = create<createPatientMenuStore>((set) => ({
  patient_id: '',
  patient: null,
  query: '',

  setQuery: (query) =>
    set((state) => {
      return { ...state, query };
    }),

  getPatient: async (patient_id, navigate) => {
    try {
      const { data } = await api.get<Patient & { patient_id: string, age: number }>(`/clinic-patient/${patient_id}`);

      data.age = calculateYearsDiffByDateISO(data.patient_birth_date);

      data.patient_photo = data.patient_photo ? data.patient_photo : getAvatarByGender(data.patient_sex);

      set((state) => {
        return { ...state, patient: data };
      });

      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        notify('Paciente não encontrado', 'Erro', 'alert-circle', 'danger');
        navigate('/app/');
        return false;
      }
      console.error(error);
      throw error;
    }
  },

  setPatientId: (patient_id) =>
    set((state) => {
      return { patient_id };
    }),

  updatePatient: (patient) =>
    set((state) => {
      if (!state.patient) return { patient: null };

      return { patient: { ...state.patient, ...patient } };
    }),

  persistUpdatePatient: async (PatientData, hideNotification) => {
    try {
      await api.put<Patient>(`/clinic-patient/${PatientData.patient_id}`, PatientData);

      !hideNotification && notify('Paciente atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}));

export default usePatientMenuStore;
