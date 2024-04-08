import { ModalConfigurationActions, ModalStore } from "./types";

// eslint-disable-next-line no-unused-vars
export const useModalConfigurationActions = (set: (partial: (state: ModalStore) => Partial<ModalStore>) => void) => (<ModalConfigurationActions>{
  hideConfigurationModalRecipe: () =>
    set(() => {
      return { showConfigurationModalRecipe: false };
    }),
})