import { MultiValue } from "react-select";
import api from "/src/services/useAxios";
import { RecipeCategory } from "/src/types/ReceitaCulinaria";
import { Option } from "/src/types/inputs";
import { create } from "zustand";

interface FilterStore {
  query: string;
  categories: RecipeCategory[];
  selectedCategories: Option[];
  setQuery: (query: string) => void;
  getCategories: () => Promise<RecipeCategory[]>;
  setSelectedCategories: (selectedCategories: MultiValue<Option>) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  // Estado inicial do store de filtros
  query: "",
  categories: [],
  selectedCategories: [],

  // Função para atualizar a query de busca no estado
  setQuery: (query) => set({ query }),

  // Função assíncrona para obter as categorias de receitas disponíveis
  getCategories: async () => {
    try {
      // Realiza a requisição GET para obter as categorias de receitas
      const { data } = await api.get<RecipeCategory[]>('/receita-culinaria-diet-system-categoria-descricao/profissional');
      // Atualiza o estado com as categorias obtidas
      set({ categories: data });
      return data;
    } catch (error) {
      // Trata erros que podem ocorrer durante a requisição
      console.error("Erro ao obter categorias", error);
      // Pode optar por definir categories como vazio ou manter o estado anterior
      return [];
    }
  },

  // Função para atualizar as categorias selecionadas no estado
  setSelectedCategories: (selectedCategories) => set({selectedCategories: [...selectedCategories]}),
}));
