import { create } from 'zustand';
import api from '../../../../services/useAxios';
import { DiaryFoodRegister } from '../../../../types/FoodDiary';

interface FoodDiaryStore {
  // eslint-disable-next-line no-unused-vars
  getFoodDiary: () => Promise<DiaryFoodRegister[] | false>;
}

export const useFoodDiaryStore = create<FoodDiaryStore>(() => ({
  year: new Date().getFullYear().toString(),

  getFoodDiary: async () => {
    try {
      const { data } = await api.get("/registro-alimentar/7dias/");

      return data ?? false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
}));
