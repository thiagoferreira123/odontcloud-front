import { create } from "zustand";
import api from "../../../services/useAxios";
import { notify } from "../../../components/toast/NotificationIcon";
import { ClinicAnamnesis } from "../../MySettings/ClinicAnamnesis/hooks/ClinicAnamnesisStore/types";


type ClinicAnamnesisStore = {
  getClinicAnamnesis: (anamnesis_clinic_id: string) => Promise<ClinicAnamnesis[] | false>;
};

export const useClinicAnamnesisStore = create<ClinicAnamnesisStore>(() => ({
  getClinicAnamnesis: async (anamnesis_clinic_id) => {
    try {
      const { data } = await api.get<ClinicAnamnesis[]>(`/clinic-anamnesis/shared/${anamnesis_clinic_id}`);

      return data;
    } catch (error) {
      console.error(error);
      notify("Erro ao buscar modelos de anamnese", "Erro", "close", "danger");
      return false;
    }
  }
}));
