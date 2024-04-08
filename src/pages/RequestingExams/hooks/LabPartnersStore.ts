import { QueryClient } from "@tanstack/react-query";
import api from "/src/services/useAxios";
import { Laboratory } from "/src/types/LabPartners";
import { create } from "zustand";

interface LabPartnersStore {

  selectedPartner: Laboratory | null;
  showModal: boolean;

  // eslint-disable-next-line no-unused-vars
  handleSelectPartner: (partner: Laboratory) => void;
  handleOpenModal: () => void;
  handleCloseModal: () => void;

  getPartners: () => Promise<Laboratory[] | false>;
  // eslint-disable-next-line no-unused-vars
  addPartner: (partner: Partial<Laboratory>, queryClient: QueryClient) => Promise<Laboratory | false>;
  // eslint-disable-next-line no-unused-vars
  updatePartner: (partner: Partial<Laboratory>, queryClient: QueryClient) => Promise<Laboratory | false>;
  // eslint-disable-next-line no-unused-vars
  removePartner: (partner: Laboratory, queryClient: QueryClient) => Promise<boolean>;
}

export const useLabPartnersStore = create<LabPartnersStore>((set) => ({

  selectedPartner: null,
  showModal: false,

  handleSelectPartner: (selectedPartner) => {
    set({ selectedPartner, showModal: true });
  },

  handleOpenModal: () => {
    set({ showModal: true, selectedPartner: null });
  },

  handleCloseModal: () => {
    set({ showModal: false, selectedPartner: null });
  },

  getPartners: async () => {
    try {
      const { data } = await api.get<Laboratory[]>('/exame-de-sangue-laboratorio');

      return data ?? false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  addPartner: async (partner, queryClient) => {
    try {
      const { data } = await api.post<Laboratory>('/exame-de-sangue-laboratorio', partner);

      queryClient.setQueryData(['requesting-exams-lab-partners'], (laboratories: Laboratory[]) => [data, ...laboratories])

      return data ?? false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  updatePartner: async (partner, queryClient) => {
    try {
      const { data } = await api.put<Laboratory>('/exame-de-sangue-laboratorio/' + partner.id, partner);

      queryClient.setQueryData(['requesting-exams-lab-partners'], (laboratories: Laboratory[]) => {
        const index = laboratories.findIndex((lab) => lab.id === data.id);

        laboratories[index] = data;

        return [...laboratories];
      });

      return data ?? false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  removePartner: async (partner, queryClient) => {
    try {
      queryClient.setQueryData(['requesting-exams-lab-partners'], (laboratories: Laboratory[]) => {
        const updatedLaboratories = laboratories.filter((lab) => lab.id !== partner.id);

        return [...updatedLaboratories];
      });

      await api.delete('/exame-de-sangue-laboratorio/' + partner.id);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
}));