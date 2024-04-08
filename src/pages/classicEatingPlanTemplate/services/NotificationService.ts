import api from "/src/services/useAxios";

export const removeMealNotification = async (mealIds: number[], isPae: boolean) => {
  await api.post(
    'https://push.OdontCloud.com.br/remove-meal-notification',
    {
      meal_id: mealIds,
      isPae,
    },
    {
      withCredentials: false,
    }
  );
}