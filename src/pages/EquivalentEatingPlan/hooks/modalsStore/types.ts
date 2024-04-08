import { EquivalentEatingPlanMeal, EquivalentEatingPlanMealFood } from "/src/types/PlanoAlimentarEquivalente";

export type CreateModalStore = {
  selectedFood: EquivalentEatingPlanMealFood | null;
  selectedMeal: EquivalentEatingPlanMeal | null;

  // eslint-disable-next-line no-unused-vars
  setSelectedMeal: (selectedMeal: EquivalentEatingPlanMeal | null) => void;

  // eslint-disable-next-line no-unused-vars
  setSelectedFood: (selectedFood: EquivalentEatingPlanMealFood | null) => void;
} & SelectedMealActions
  & ModalFoodOptoionsActions
  & ModalSeparateFoodsActions
  & ModalObservationMealActions
  & ModalPhotoMealActions
  & ModalShoppingListActions
  & ModalOrientationActions
  & ModalFavoritePlanActions
  & ModalDeleteMealActions
  & ModalEmptyListAlertActions
  & ModalReplacementListsActions
  & ModalSelectPDFActions
  & ModalSendPDFActions;

export type ModalFoodOptoionsActions = {
  showModalFoodOptions: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowModalFoodOptions: (show: boolean) => void;
}

export type ModalSeparateFoodsActions = {
  showModalSeparateFoods: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowModalSeparateFoods: (show: boolean) => void;
}

export type ModalObservationMealActions = {
  showModalObservationMeal: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowModalObservationMeal: (show: boolean) => void;
}

export type ModalPhotoMealActions = {
  showModalPhotoMeal: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowModalPhotoMeal: (show: boolean) => void;
}

export type ModalShoppingListActions = {
  showModalShoppingList: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowModalShoppingList: (show: boolean) => void;
}

export type ModalOrientationActions = {
  showModalOrientation: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowModalOrientation: (show: boolean) => void;
}

export type ModalFavoritePlanActions = {
  showModalFavoritePlan: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowModalFavoritePlan: (show: boolean) => void;
}

export type ModalDeleteMealActions = {
  showModalDeleteMeal: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowModalDeleteMeal: (show: boolean) => void;
}

export type ModalEmptyListAlertActions = {
  showModalEmptyListAlert: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowModalEmptyListAlert: (show: boolean) => void;
}

export type ModalReplacementListsActions = {
  showModalReplacementLists: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowModalReplacementLists: (show: boolean) => void;
}

export type ModalSelectPDFActions = {
  showModalSelectPDF: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowModalSelectPDF: (show: boolean) => void;
}

export type ModalSendPDFActions = {
  showModalSendPDF: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowModalSendPDF: (show: boolean) => void;
}

export type SelectedMealActions = {
  // eslint-disable-next-line no-unused-vars
  updateSelectedMealFood: (food: Partial<EquivalentEatingPlanMealFood>) => void;
  // eslint-disable-next-line no-unused-vars
  updateSelectedMealFoodMacros: (food: Partial<EquivalentEatingPlanMealFood>) => void;
  // eslint-disable-next-line no-unused-vars
  addSelectedMealFood: (food: EquivalentEatingPlanMealFood) => void;
}