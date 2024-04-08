import { RecipeHistory } from "/src/types/ReceitaCulinaria";

export type ModalStore = {
  showConfigurationModalRecipe: boolean;
  showDeleteConfirmationModal: boolean;

  selectedRecipe: RecipeHistory | null;

  // eslint-disable-next-line no-unused-vars
  handleSelectRecipe: (recipe: RecipeHistory) => void;
} & ModalConfigurationActions & ModalDeleteConfirmationActions;

export type ModalConfigurationActions = {
  hideConfigurationModalRecipe: () => void;
}

export type ModalDeleteConfirmationActions = {
  hideDeleteConfirmationModal: () => void;
  // eslint-disable-next-line no-unused-vars
  handleDeleteRecipe: (recipe: RecipeHistory) => void;
}