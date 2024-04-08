import { QueryClient } from "@tanstack/react-query";
import { Patient } from "../../../../types/Patient";
import api from "../../../../services/useAxios";
import { create } from "zustand";
import { AxiosError } from "axios";
import { notify } from "../../../../components/toast/NotificationIcon";

type PatientStore = {
  addPatient: (patient: Partial<Patient>, queryClient?: QueryClient) => Promise<boolean>;
  updatePatient: (patient: Partial<Patient> & { patient_id: string }, queryClient: QueryClient, ignoreNotify?: boolean) => Promise<boolean>;
  removePatient: (patient: Patient & { patient_id: string }, queryClient: QueryClient) => Promise<boolean>;
  getPatients: () => Promise<(Patient & { patient_id: string })[]>;
};

const usePatientStore = create<PatientStore>(() => {
  return {
    patients: [],

    getPatients: async () => {
      const { data } = await api.get<(Patient & { patient_id: number })[]>('/clinic-patient/by-clinic')

      return data;
    },

    addPatient: async (payload, queryClient) => {
      try {
        let newPatient: Patient & { patient_id: number };

        if(!payload.patient_id) {
          const { data } = await api.post<Patient & { patient_id: number }>('/clinic-patient', payload);
          newPatient = {...data, patient_full_name: data.patient_full_name || ''}; // Ensure name is not undefined
        } else {
          newPatient = payload as Patient & { patient_id: number };
        }

        const value: (Patient & { patient_id: number, key: string }) = { ...newPatient, key: newPatient.patient_id };

        queryClient && queryClient.setQueryData(['my-patients'], (patients: Patient[]) => {
          return patients?.length ? [value, ...patients] : [value];
        });

        !payload.patient_id && notify('Sucesso', 'Paciente cadastrado com sucesso', 'check', 'success');

        return true;
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 400 && error.response?.data.message) {
          notify(error.response?.data.message, 'Erro', 'close', 'danger');
        } else {
          notify('Erro', 'Erro ao cadastrar paciente', 'close', 'danger');
        }

        console.error(error)
        return false;
      }
    },

    removePatient: async (patient, queryClient) => {
      try {
        const value: (Patient & { key: string }) = { ...patient, key: patient.patient_id };

        queryClient.setQueryData(['my-patients'], (patients: Patient[]) => {
          const updatedExams = patients.filter((e) => e.patient_id !== patient.patient_id);

          return updatedExams?.length ? [...updatedExams] : [];
        });

        await api.delete('/clinic-patient/' + value.patient_id)

        return true;
      } catch (error) {
        console.error(error)
        if (error instanceof AxiosError && error.response?.status != 404) return false;

        console.error(error)
        return false;
      }

    },

    updatePatient: async (payload, queryClient, ignoreNotify) => {
      try {
        queryClient.setQueryData(['my-patients'], (patients: Patient[]) => {
          const updatedExams = patients?.length ? patients.map((e) => {
            if (e.patient_id === payload.patient_id) {
              return {...e, ...payload};
            }

            return e;
          }) : [payload];

          return [...updatedExams];
        });
        await api.put('/clinic-patient/' + payload.patient_id, { ...payload })

        !ignoreNotify && notify('Paciente atualizado com sucesso', 'Sucesso', 'check', 'success');

        return true;

      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 400 && error.response?.data?.message) {
          notify(error.response?.data?.message, 'Erro', 'close', 'danger');
        } else {
          !ignoreNotify && notify('Erro ao atualizar paciente', 'Erro', 'close', 'danger');
        }

        console.error(error)
        return false;
      }
    },
  };
});

export default usePatientStore;