import axios from "axios";
import { createElement } from "react";
import { create } from "zustand";

interface ModalWhatsAppStore {
  showModal: boolean;

  createSession: (clinicId: string) => Promise<void>;
  getQrCode: (clinicId: string) => Promise<any>;
  checkSession: (clinicId: string) => Promise<WppSessionInfoResponse | false>;
  deleteSession: (clinicId: string) => Promise<void>;
  logout: (clinicId: string) => Promise<void>;
  openModalWhatsApp: () => void;
  hideModal: () => void;
}

interface WppSessionInfoResponse {
  error: boolean,
  message: string,
  instance_data?: {
    instance_key: string,
    phone_connected: boolean,
    webhookUrl: string,
    user: {
      id: string
    }
  }
}

interface WppBase64QrResponse {
  error: boolean,
  message: string,
  qrcode: string,
}

const wppBotUrl = 'https://whats-alert.dietsystem.com.br/';
// const wppBotUrl = 'http://localhost:5173/';
const token = 'dietsystemwppapi';

export const useModalWhatsAppStore = create<ModalWhatsAppStore>((set) => ({
  showModal: false,

  createSession: async (clinicId) => {
    try {
      const response = await axios.get(`${wppBotUrl}instance/init?key=odont_clinic_${clinicId}&token=${token}`);

      console.log(response);

      if (response.status !== 200) {
        throw new Error('Erro ao criar sessão no WhatsApp');
      }
    } catch (error) {
      console.error(error);

      throw error;
    }
  },
  getQrCode: async (clinicId) => {
    try {
      const response = await fetch(`${wppBotUrl}instance/qrbase64?key=odont_clinic_${clinicId}`, {
        headers: {
          'Connection': 'keep-alive',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept': '*/*',
        },
      });
      const data: WppBase64QrResponse = await response.json();

      if(!data.qrcode) throw new Error('Erro ao obter QR Code');

      return data.qrcode;
    } catch (error) {
      console.error(error);

      throw error;
    }
  },
  checkSession: async (clinicId) => {
    try {
      const response = await fetch(`${wppBotUrl}instance/info?key=odont_clinic_${clinicId}`);
      const data: WppSessionInfoResponse = await response.json();

      return data;
    } catch (error) {
      return false;
    }
  },
  deleteSession: async (clinicId) => {
    try {
      await fetch(`${wppBotUrl}instance/delete?key=odont_clinic_${clinicId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(error);

      throw error;
    }
  },
  logout: async (clinicId) => {
    try {
      await fetch(`${wppBotUrl}instance/logout?key=odont_clinic_${clinicId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(error);

      throw error;
    }
  },
  openModalWhatsApp() {
    set({ showModal: true });
  },
  hideModal() {
    set({ showModal: false });
  },
}));