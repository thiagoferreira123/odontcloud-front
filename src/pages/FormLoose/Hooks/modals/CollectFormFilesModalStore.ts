import { create } from "zustand";
import { AnsweredForm } from "../../../../types/FormBuilder";
import { Patient } from "../../../../types/Patient";
import api from "../../../../services/useAxios";
import { PatientFile } from "../../../PatientMenu/patient-folder/hooks/types";
import { notify } from "../../../../components/toast/NotificationIcon";

interface CollectFormFilesModalStore {
  query: string;
  showModal: boolean;

  selectedForm: AnsweredForm | null;

  // eslint-disable-next-line no-unused-vars
  setQuery: (query: string) => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectForm: (form: AnsweredForm) => void;
  hideModal: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectPatient: (patient: Patient, form: AnsweredForm) => Promise<PatientFile[]>;
}

export const useCollectFormFilesModalStore = create<CollectFormFilesModalStore>((set) => ({
  query: '',
  showModal: false,

  selectedForm: null,

  setQuery: (query) => {
    set({ query });
  },
  handleSelectForm: (form) => {
    set({ selectedForm: form, showModal: true });
  },
  hideModal: () => {
    set({ selectedForm: null, showModal: false });
  },
  handleSelectPatient: async (patient, form) => {
    try {
      const payload = {
        pacienteId: patient.id,
        fileNames: form.arquivosAnexados.map((file) => file.aws_file_name.split('/').splice(3, 5).join('/')),
      }

      const { data } = await api.post('/pasta-do-paciente/multiple', payload);

      notify('Arquivos coletados com sucesso', 'Sucesso', 'check', 'success');
      return data;
    } catch (error) {
      console.error(error);
      notify('Erro ao selecionar paciente', 'Erro', 'close', 'danger');
      return [];
    }
  }
}));