import { QueryClient } from "@tanstack/react-query";
import { User } from "../../../Auth/Login/hook/types";
import { ForumTopicTag } from "../TopicTagStore";
import { TopicCategory } from "../TopicCategoryStore";

export interface ForumTopicAnswerLike {
  id: number;
  tipo: string;
  pergunta_id: number;
  resposta_id: number;
  profissional_id: number;
}

export interface ForumTopicAnswer {
  id: number;
  pergunta_id: number;
  corpo: string;
  data_criacao: string;
  data_modificacao: string;
  profissional_id: number;
  comentarios: ForumTopicAnswerComment[];
  curtidas: ForumTopicAnswerLike[];
  professional?: User;
}

export interface ForumTopicAnswerComment {
  id: number;
  mensagem: string;
  data_criacao: string;
  resposta_id: number;
  pergunta_id: number;
  comentario_id: number | null;
  data_modificacao: string | null;
  profissional_id: number;
  professional?: User;
}

export interface ForumTopic {
  id: number;
  titulo: string;
  mensagem: string;
  data_criacao: string;
  data_modificacao: string;
  profissional_id: number;
  categories: TopicCategory[];
  tags: ForumTopicTag[];
  respostas: ForumTopicAnswer[];
  professional?: User;
}

export interface ForumTopicFindAllResponse {
  data: ForumTopic[];
  pagination: {
    totalPages: number;
    currentPage: number;
    pageSize: number;
    totalRecords: number;
  };
}

export type ForumTopicActions = {
  addForum: (topic: Partial<ForumTopic>, queryClient: QueryClient, user: User) => Promise<ForumTopic | false>;
  updateForum: (topic: Partial<ForumTopic>, queryClient: QueryClient) => Promise<boolean>;
  removeForum: (topic: ForumTopic, queryClient: QueryClient) => Promise<boolean>;
};

export type ForumTopicAnswerActions = {
  addAnswer: (answer: Partial<ForumTopicAnswer>, queryClient: QueryClient, user: User) => Promise<ForumTopicAnswer | false>;
  updateAnswer: (answer: Partial<ForumTopicAnswer>, queryClient: QueryClient) => Promise<boolean>;
  removeAnswer: (answer: ForumTopicAnswer, queryClient: QueryClient) => Promise<boolean>;
};

export type ForumTopicAnswerCommentActions = {
  addCommentAnswer: (answer: Partial<ForumTopicAnswerComment>, queryClient: QueryClient, user: User) => Promise<ForumTopicAnswerComment | false>;
  updateCommentAnswer: (answer: Partial<ForumTopicAnswerComment>, queryClient: QueryClient) => Promise<boolean>;
  removeCommentAnswer: (answer: ForumTopicAnswerComment, queryClient: QueryClient) => Promise<boolean>;
};

export type ForumTopicAnswerLikeActions = {
  addCommentLike: (answer: Partial<ForumTopicAnswerLike>, queryClient: QueryClient, user: User) => Promise<ForumTopicAnswerLike | false>;
  removeCommentLike: (answer: ForumTopicAnswerLike, queryClient: QueryClient) => Promise<boolean>;
};

export type ForumTopicStore = {
  getForumTopics: (page?: number, limit?: number) => Promise<ForumTopicFindAllResponse | false>;
  getForumTopic: (id: number) => Promise<ForumTopic | false>;
} & ForumTopicActions & ForumTopicAnswerActions & ForumTopicAnswerCommentActions & ForumTopicAnswerLikeActions;
