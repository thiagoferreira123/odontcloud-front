import { create } from "zustand";
import { MetabolicTrackingStore } from "./types";
import api from "../../../../../services/useAxios";
import { AxiosError } from "axios";
import useMetabolicTrackingActions from "./MetabolicTrackingActions";

const useMetabolicTrackingsStore = create<MetabolicTrackingStore>(() => ({
  getMetabolicTrackings: async (patient_id) => {
    try {
      const response = await api.get(`/rastreamemto-metabolico/patient/${patient_id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        console.error(error);
        return false;
      }
      return [];
    }
  },

  ...useMetabolicTrackingActions()
}));

export default useMetabolicTrackingsStore;
