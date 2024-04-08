import { create } from "zustand";
import { CreateModalStore } from "./types";
import { useModalFoodOptoionsActions } from "./ModalFoodOptoionsActions";
import { useModalSeparateFoodsActions } from "./ModalSeparateFoodsActions";
import { useSelectedMealActions } from "./SelectedMealActions";
import { useModalObservationMealActions } from "./ModalObservationMealActions";
import { useModalPhotoMealActions } from "./ModalPhotoMealActions";
import { useModalShoppingListActions } from "./ModalShoppingListActions";
import { useModalOrientationActions } from "./ModalOrientationActions";
import { useModalFavoritePlanActions } from "./ModalFavoritePlanActions";
import { useModalDeleteMealActions } from "./ModalDeleteMealActions";
import { useModalEmptyListAlertActions } from "./ModalEmptyListAlertActions";
import { useModalReplacementListsActions } from "./ModalReplacementListsActions";
import { useModalSelectPDFActions } from "./ModalSelectPDFActions";
import { useModalSendPDFActions } from "./ModalSendPDFActions";

export const useModalsStore = create<CreateModalStore>((set) => ({
  selectedFood: null,
  selectedMeal: null,

  setSelectedMeal: (selectedMeal) =>
    set(() => {
      return { selectedMeal };
    }),

  setSelectedFood: (selectedFood) =>
    set(() => {
      return { selectedFood };
    }),

  ...useSelectedMealActions(set),
  ...useModalOrientationActions(set),
  ...useModalFoodOptoionsActions(set),
  ...useModalSeparateFoodsActions(set),
  ...useModalObservationMealActions(set),
  ...useModalPhotoMealActions(set),
  ...useModalShoppingListActions(set),
  ...useModalFavoritePlanActions(set),
  ...useModalDeleteMealActions(set),
  ...useModalEmptyListAlertActions(set),
  ...useModalReplacementListsActions(set),
  ...useModalSelectPDFActions(set),
  ...useModalSendPDFActions(set),
}));