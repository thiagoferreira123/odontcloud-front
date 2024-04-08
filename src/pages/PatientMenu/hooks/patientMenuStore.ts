import { create } from 'zustand';
import { Patient } from '../../../types/Patient';
import { calculateYearsDiffByDateISO } from '../../../helpers/DateHelper';
import api from '../../../services/useAxios';
import { notify } from '../../../components/toast/NotificationIcon';
import { AxiosError } from 'axios';
import { NavigateFunction } from 'react-router-dom';

interface createPatientMenuStore {
  patientId: number;
  patient: Patient | null;
  query: string;

  setQuery: (query: string) => void;
  getPatient: (patientId: number, navigate: NavigateFunction) => Promise<Patient & { id: number } | false>;
  setPatientId: (patientId: number) => void;
  updatePatient: (patient: Partial<Patient>) => void;
  persistUpdatePatient: (PatientData: Partial<Patient> & { id: number }, hideNotification?: boolean) => Promise<boolean>;
}

export function getAvatarByGender(gender: number) {
  if (gender)
    return '/img/profile/avatar_paciente_masc.png'
  else
    return '/img/profile/avatar_paciente_fem.png'
}

const usePatientMenuStore = create<createPatientMenuStore>((set) => ({
  patientId: 0,
  patient: null,
  query: '',

  setQuery: (query) =>
    set((state) => {
      return { ...state, query };
    }),

  getPatient: async (id, navigate) => {
    try {
      const { data } = await api.get<Patient & { id: number }>(`/paciente/${id}`);

      data.age = calculateYearsDiffByDateISO(data.dateOfBirth);

      data.photoLink = data.photoLink ? data.photoLink : getAvatarByGender(data.gender);

      set((state) => {
        return { ...state, patient: data };
      });

      return data;
    } catch (error) {
      if(error instanceof AxiosError && error.response?.status === 404) {
        notify('Paciente não encontrado', 'Erro', 'alert-circle', 'danger');
        navigate('/app/');
        return false;
      }
      console.error(error);
      throw error;
    }
  },

  setPatientId: (patientId) =>
    set((state) => {
      return { patientId };
    }),

  updatePatient: (patient) =>
    set((state) => {
      if(!state.patient) return { patient: null };

      return { patient: { ...state.patient, ...patient } };
    }),

  persistUpdatePatient: async (PatientData, hideNotification) => {
    try {
      await api.patch<Patient>(`/paciente/${PatientData.id}`, PatientData);

      !hideNotification && notify('Paciente atualizado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}));

export default usePatientMenuStore;
