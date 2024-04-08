import { create } from 'zustand';
import api from '../../../../services/useAxios';
import { QueryClient } from '@tanstack/react-query';
import { notify } from '../../../../components/toast/NotificationIcon';
import { handleAxiosErrorVoid } from '../../../../helpers/ErrorHelpers';
import { MaterialTag } from './MaterialTagStore';

export interface Attachment {
  id: number;
  name: string;
  s3_link: string;
  user_link: string;
  user_text: string;
  professional_id: number;
  tags: MaterialTag[];
  selecoesPaciente: AttachmentPatient[]
}

interface AttachmentPatient {
  id: number;
  patient_id: number;
  materials_id: number;
  active: string;
  professional_id: number;
}

interface MyAttachmentStore {
  query: string;

  // eslint-disable-next-line no-unused-vars
  setQuery: (query: string) => void;

  getAttachments: () => Promise<Attachment[] | false>;
  // eslint-disable-next-line no-unused-vars
  addAttachment: (attachment: Partial<Attachment>, queryClient: QueryClient) => Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  removeAttachment: (attachment: Attachment, queryClient: QueryClient) => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  updateAttachment: (attachment: Attachment, queryClient: QueryClient) => Promise<boolean>;
}

export const useMyAttachmentStore = create<MyAttachmentStore>((set) => ({
  query: '',

  myAttachments: [],

  setQuery: (query: string) => set(() => ({ query })),

  getAttachments: async () => {
    try {
      const { data } = await api.get<Attachment[]>('/material-cadastrado-pelo-profissional/by-professional');

      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  addAttachment: async (attachment, queryClient) => {
    try {
      const { data } = await api.post<Attachment>('/material-cadastrado-pelo-profissional', attachment);

      queryClient.setQueryData(['my-attachments'], (old: Attachment[] | undefined) => {
        return old ? [data, ...old] : [data];
      });

      notify('Material cadastrado com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao cadastrar material', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  updateAttachment: async (attachment, queryClient) => {
    try {
      const { data } = await api.put<Attachment>(`/material-cadastrado-pelo-profissional/${attachment.id}`, attachment);

      queryClient.setQueryData(['my-attachments'], (old: Attachment[] | undefined) => {
        return old ? old.map((a) => (a.id === attachment.id ? data : a)) : [];
      });

      return true;

    } catch (error) {
      notify('Erro ao cadastrar material', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },

  removeAttachment: async (attachment, queryClient) => {
    try {
      queryClient.setQueryData(['my-attachments'], (old: Attachment[] | undefined) => {
        return old ? old.filter((a) => a.id !== attachment.id) : [];
      });
      await api.delete(`/material-cadastrado-pelo-profissional/${attachment.id}`);
    } catch (error) {
      handleAxiosErrorVoid(error, 'Erro ao deletar material');
      queryClient.setQueryData(['my-attachments'], (old: Attachment[] | undefined) => {
        return old ? [attachment, ...old] : [attachment];
      });

      console.error(error)
    }
  },
}));
