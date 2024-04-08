import { QueryClient } from "@tanstack/react-query";
import api from "/src/services/useAxios";
import { create } from "zustand";
import { notify } from "../../../components/toast/NotificationIcon";

export interface PharmacyPartner {
  id: number,
  name: string,
  email: string,
  dateCreation: string,
  professional: number
}

interface PharmacyPartnersStore {

  selectedPartner: PharmacyPartner | null;
  showModal: boolean;

  // eslint-disable-next-line no-unused-vars
  handleSelectPartner: (partner: PharmacyPartner) => void;
  handleOpenModal: () => void;
  handleCloseModal: () => void;

  getPartners: () => Promise<PharmacyPartner[] | false>;
  // eslint-disable-next-line no-unused-vars
  addPartner: (partner: Partial<PharmacyPartner>, queryClient: QueryClient) => Promise<PharmacyPartner | false>;
  // eslint-disable-next-line no-unused-vars
  updatePartner: (partner: Partial<PharmacyPartner>, queryClient: QueryClient) => Promise<PharmacyPartner | false>;
  // eslint-disable-next-line no-unused-vars
  removePartner: (partner: PharmacyPartner, queryClient: QueryClient) => Promise<boolean>;
}

export const usePharmacyPartnersStore = create<PharmacyPartnersStore>((set) => ({

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
      const { data } = await api.get<PharmacyPartner[]>('/formula-manipulada-farmacia');

      return data ?? false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  addPartner: async (partner, queryClient) => {
    try {
      const { data } = await api.post<PharmacyPartner>('/formula-manipulada-farmacia', partner);

      queryClient.setQueryData(['pharmacy-partners'], (laboratories: PharmacyPartner[]) => [data, ...laboratories])

      notify('Laboratório adicionado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  updatePartner: async (partner, queryClient) => {
    try {
      const { data } = await api.put<PharmacyPartner>('/formula-manipulada-farmacia/' + partner.id, partner);

      queryClient.setQueryData(['pharmacy-partners'], (laboratories: PharmacyPartner[]) => {
        const index = laboratories.findIndex((lab) => lab.id === data.id);

        laboratories[index] = data;

        return [...laboratories];
      });

      notify('Laboratório atualizado com sucesso', 'Sucesso', 'check', 'success');

      return data ?? false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  removePartner: async (partner, queryClient) => {
    try {
      queryClient.setQueryData(['pharmacy-partners'], (laboratories: PharmacyPartner[]) => {
        const updatedLaboratories = laboratories.filter((lab) => lab.id !== partner.id);

        return [...updatedLaboratories];
      });

      await api.delete('/formula-manipulada-farmacia/' + partner.id);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
}));