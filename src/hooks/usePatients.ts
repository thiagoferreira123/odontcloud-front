import { QueryClient } from "@tanstack/react-query";
import { Patient, isPatient } from "../types/Patient";
import api from "../services/useAxios";
import { create } from "zustand";
import { AxiosError } from "axios";
import { notify } from "../components/toast/NotificationIcon";

type createPatients = {
  addPatient: (patient: Partial<Patient>, queryClient?: QueryClient) => Promise<boolean>;
  updatePatient: (patient: Partial<Patient> & { id: number }, queryClient: QueryClient, ignoreNotify?: boolean) => Promise<boolean>;
  removePatient: (patient: Patient & { id: number }, queryClient: QueryClient) => Promise<boolean>;
  getPatients: () => Promise<(Patient & { id: number })[]>;
};

const usePatients = create<createPatients>(() => {
  return {
    patients: [],

    getPatients: async () => {
      const { data } = await api.get<(Patient & { id: number })[]>('/paciente')

      return data;
    },

    addPatient: async (payload, queryClient) => {
      try {
        let newPatient: Patient & { id: number };

        if(!payload.id) {
          const { data } = await api.post<Patient & { id: number }>('/paciente', payload);
          newPatient = {...data, name: data.name || ''}; // Ensure name is not undefined
        } else {
          newPatient = payload as Patient & { id: number };
        }

        if (!isPatient(newPatient)) throw new Error('Invalid patient');

        const value: (Patient & { id: number, key: string }) = { ...newPatient, key: newPatient.id.toString() };

        queryClient && queryClient.setQueryData(['my-patients'], (patients: Patient[]) => {
          return patients?.length ? [value, ...patients] : [value];
        });

        !payload.id && notify('Sucesso', 'Paciente cadastrado com sucesso', 'check', 'success');

        return true;
      } catch (error) {
        // console.log(error.response?.data.message);
        if (error instanceof AxiosError && error.response?.status === 400 && error.response?.data.message) {
          notify(error.response?.data.message, 'Erro', 'close', 'danger');
        } else {
          notify('Erro', 'Erro ao cadastrar paciente', 'close', 'danger');
        }

        console.error(error)
        return false;
      }
    },

    removePatient: async (patient: Patient & { id: number }, queryClient) => {
      try {
        const value: (Patient & { key: string }) = { ...patient, key: patient.id.toString() };

        queryClient.setQueryData(['my-patients'], (patients: Patient[]) => {
          const updatedExams = patients.filter((e) => e.id !== patient.id);

          return updatedExams?.length ? [...updatedExams] : [];
        });

        await api.delete('/paciente/' + value.id)

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
            if (e.id === payload.id) {
              return {...e, ...payload};
            }

            return e;
          }) : [payload];

          return [...updatedExams];
        });
        await api.patch('/paciente/' + payload.id, { ...payload })

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

export default usePatients;