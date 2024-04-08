import { create } from "zustand";
import { Recipe, RecipeHistory, RecipeHistoryRecipe } from "../../../types/ReceitaCulinaria";
import api from "../../../services/useAxios";

interface RecipeStore {
  recipes: Recipe[];
  prescription: RecipeHistory;

  getRecipes: () => Promise<Recipe[]>;
  // eslint-disable-next-line no-unused-vars
  getPrescription: (id: number) => Promise<RecipeHistory>;

  // eslint-disable-next-line no-unused-vars
  addRecipe: (recipe: Recipe) => void;

  // eslint-disable-next-line no-unused-vars
  addPrescriptionRecipe: (recipe: RecipeHistoryRecipe) => void;
  // eslint-disable-next-line no-unused-vars
  updatePrescriptionRecipe: (recipe: RecipeHistoryRecipe, id?: string | number) => void;
  // eslint-disable-next-line no-unused-vars
  removePrescriptionRecipe: (recipe: RecipeHistoryRecipe) => Promise<void>;
}

export const useRecipeStore = create<RecipeStore>((set) => ({
  // Estado inicial do store
  recipes: [],
  prescription: {} as RecipeHistory,

  // Função assíncrona para obter todas as receitas compartilhadas
  getRecipes: async () => {
    try {
      // Realiza a requisição GET para obter as receitas
      const { data } = await api.get<Recipe[]>("/receita-culinaria-diet-system/shared");
      // Atualiza o estado com as receitas obtidas
      set({ recipes: data });
      return data;
    } catch (error) {
      // Trata erros que podem ocorrer durante a requisição
      console.error("Erro ao obter receitas", error);
      return [];
    }
  },

  // Função assíncrona para obter a prescrição pelo ID
  getPrescription: async (id: number) => {
    try {
      // Realiza a requisição GET para obter a prescrição específica
      const { data } = await api.get<RecipeHistory>(`/receita-culinaria-historico/${id}`);
      // Tenta recuperar uma prescrição salva no localStorage
      const localStoragePrescription = window.localStorage.getItem('prescription');
      const localStoragePrescriptionObj = localStoragePrescription ? JSON.parse(localStoragePrescription) : {};
      // Mescla a prescrição da API com a prescrição do localStorage se os IDs coincidirem
      const prescription = localStoragePrescriptionObj.id && localStoragePrescriptionObj.id === id ? { ...data, ...localStoragePrescriptionObj } : data;
      // Atualiza o estado com a prescrição obtida
      set({ prescription });
      return data;
    } catch (error) {
      // Trata erros que podem ocorrer durante a requisição
      console.error(`Erro ao obter a prescrição de id ${id}`, error);
      return {} as RecipeHistory;
    }
  },

  // Função para adicionar uma nova receita ao estado
  addRecipe: (recipe) => {
    set((state) => {
      const { recipes } = state;
      recipes.push(recipe);
      return { recipes };
    });
  },

  // Função para adicionar uma receita à prescrição atual
  addPrescriptionRecipe: (recipe) => {
    set((state) => {
      const { prescription } = state;
      prescription.receitas.push(recipe);
      return { prescription };
    });
  },

  // Função para atualizar uma receita específica na prescrição
  updatePrescriptionRecipe: (recipe, id) => {
    set((state) => {
      const { prescription } = state;
      // Encontra o índice da receita a ser atualizada
      const recipeIndex = prescription.receitas.findIndex((r) => r.id === (id ?? recipe.id));
      // Atualiza a receita no índice encontrado
      prescription.receitas[recipeIndex] = recipe;
      return { prescription };
    });
  },

  // Função assíncrona para remover uma receita da prescrição e da API
  removePrescriptionRecipe: async (recipe) => {
    try {
      // Verifica se o ID da receita é um número e realiza a requisição DELETE
      if (typeof recipe.id === 'number') {
        await api.delete(`/receita-culinaria-historico-paciente/${recipe.id}`);
      }
    } catch (error) {
      // Trata erros que podem ocorrer durante a requisição
      console.error(`Erro ao remover a receita de id ${recipe.id}`, error);
    }

    // Atualiza o estado removendo a receita independentemente do sucesso da operação de DELETE
    set((state) => {
      const { prescription } = state;
      // Encontra o índice da receita a ser removida
      const recipeIndex = prescription.receitas.findIndex((r) => r.id === recipe.id);
      // Remove a receita do índice encontrado
      prescription.receitas.splice(recipeIndex, 1);
      return { prescription };
    });
  }
}));
