import { create } from "zustand";
import api from "../../../../services/useAxios";
import { QueryClient } from "@tanstack/react-query";
import { notify } from "../../../../components/toast/NotificationIcon";

export interface CommentTemplate {
  id?: number,
  nome: string,
  comentario: string,
  id_usuario?: number
}

interface MyCommentStore {
  selectedComment: CommentTemplate | null;

  showModal: boolean;

  query: string;

  getComments: () => Promise<CommentTemplate[] | false>;
  handleSelectComment: (comment: CommentTemplate) => void;
  setShowModal: (showModal: boolean) => void;
  updateComment: (comment: CommentTemplate, queryClient: QueryClient) => Promise<boolean>;
  removeComment: (comment: CommentTemplate, queryClient: QueryClient) => Promise<boolean>;
  addComment: (comment: Partial<CommentTemplate>, queryClient: QueryClient) => Promise<CommentTemplate | false>;
  setQuery: (query: string) => void;
}

export const useMyCommentStore = create<MyCommentStore>(set => ({
  selectedComment: null,
  showModal: false,
  query: "",

  getComments: async () => {
    try {
      const { data } = await api.get("/comentario-refeicao/professional")

      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  handleSelectComment: (comment) => {
    set({ selectedComment: comment, showModal: true });
  },

  setShowModal: (showModal) => {
    set({ showModal });
  },

  updateComment: async (comment, queryClient) => {
    try {
      queryClient.setQueryData(['my-comments'], (oldData: CommentTemplate[] | undefined) => {
        if (oldData) {
          return oldData.map((c) => c.id === comment.id ? comment : c);
        }
        return [];
      });

      await api.patch(`/comentario-refeicao/${comment.id}`, comment);

      notify('Comentário atualizado com sucesso!', 'Sucesso', 'check', 'success')

      return true;
    } catch (error) {
      notify('Erro ao atualizar comentário', 'Erro', 'close', 'danger')
      console.error(error);
      return false;
    }
  },

  removeComment: async (comment, queryClient) => {
    try {
      queryClient.setQueryData(['my-comments'], (oldData: CommentTemplate[] | undefined) => {
        if (oldData) {
          return oldData.filter((c) => c.id !== comment.id);
        }
        return [];
      });

      await api.delete(`/comentario-refeicao/${comment.id}`);

      return true;
    } catch (error) {
      notify('Erro ao deletar comentário', 'Erro', 'close', 'danger')
      console.error(error);
      return false;
    }
  },

  addComment: async (comment, queryClient) => {
    try {
      const { data } = await api.post('/comentario-refeicao/', comment);

      queryClient.setQueryData(['my-comments'], (oldData: CommentTemplate[] | undefined) => {
        if (oldData) {
          return [data, ...oldData];
        }
        return [data];
      });

      notify('Comentário salvo com sucesso!', 'Sucesso', 'check', 'success')

      return data;
    } catch (error) {
      notify('Erro ao salvar comentário', 'Erro', 'close', 'danger')
      console.error(error);
      return false;
    }
  },

  setQuery: (query: string) => {
    set({ query });
  }
}));