import { QueryClient } from "@tanstack/react-query";

export interface Form {
  id: number;
  key: string;
  data: string;
  nome: string;
  form: string;
  status: string;
  tipo: string;
  id_dono: number;
  paciente_id: number;
}

export interface SendReply {
  respostas: string;
  id_formulario: number;
}

export type FormActions = {
  // eslint-disable-next-line no-unused-vars
  addReplyForm: (replyData: SendReply, queryClient: QueryClient) => Promise<number | false>;
};

export type FormStore = {
  // eslint-disable-next-line no-unused-vars
  getForm: (key: string) => Promise<Form[] | false>;
} & FormActions;
