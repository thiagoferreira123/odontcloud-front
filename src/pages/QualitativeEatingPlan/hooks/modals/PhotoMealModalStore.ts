import { create } from "zustand";
import { QualitativeEatingPlanMeal } from "../../../PatientMenu/qualitative-eating-plan/hooks/eating-plan/types";
import api from "../../../../services/useAxios";
import { MealImage } from "../../../../types/ImagemRefeicao";
import { QueryClient } from "@tanstack/react-query";
import { notify } from "../../../../components/toast/NotificationIcon";

interface PhotoMealModalStore {
  selectedMeal: QualitativeEatingPlanMeal | null;
  showModal: boolean;

  // eslint-disable-next-line no-unused-vars
  handleSelectMealForChangeImage: (meal: QualitativeEatingPlanMeal) => void;
  closeModal: () => void;
  getPhotos: () => Promise<MealImage[]>;
  // eslint-disable-next-line no-unused-vars
  addPhoto(file: File, values: { description: string }, queryClient: QueryClient): Promise<MealImage | false>;
  // eslint-disable-next-line no-unused-vars
  updatePhoto(photo: MealImage, queryClient: QueryClient): Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  removePhoto(photo: MealImage, queryClient: QueryClient): Promise<boolean>;
}

export const usePhotoMealModalStore = create<PhotoMealModalStore>(set => ({
  selectedMeal: null,
  showModal: false,

  handleSelectMealForChangeImage: (selectedMeal) => set({ selectedMeal, showModal: true }),

  closeModal: () => set({ showModal: false, selectedMeal: null }),

  getPhotos: async () => {
    const response = await api.get<MealImage[]>('/plano-alimentar-classico-refeicao-foto');

    return response.data;
  },

  addPhoto: async (file, values, queryClient) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('descricao', values.description);

      const { data } = await api.post<MealImage>('/plano-alimentar-classico-refeicao-foto', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      queryClient.setQueryData(['photos'], (photos: MealImage[]) => {
        return [...photos, data];
      });

      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  updatePhoto: async (photo, queryClient) => {
    try {
      const { data } = await api.put<MealImage>('/plano-alimentar-classico-refeicao-foto/' + photo.id, photo);

      queryClient.setQueryData(['photos'], (photos: MealImage[]) => {
        const updatedPhotos = photos.map((e) => {
          if (e.id === data.id) {
            return data;
          }

          return e;
        });

        return [...updatedPhotos];
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  removePhoto: async (photo, queryClient) => {
    try {
      queryClient.setQueryData(['photos'], (photos: MealImage[]) => {
        const updatedPhotos = photos.filter((e) => e.id !== photo.id);

        return [...updatedPhotos];
      });

      await api.delete('/plano-alimentar-classico-refeicao-foto/' + photo.id);

      notify('Foto removida com sucesso', 'Sucesso', 'check', 'success');

      return true;
    } catch (error) {
      notify('Erro ao remover foto', 'Erro', 'close', 'danger');
      console.error(error);
      return false;
    }
  },
}))