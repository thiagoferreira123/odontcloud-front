import { create } from "zustand"
import { CreateAuthStore } from "./types"
import api from "../../../../services/useAxios";

const user = localStorage.getItem('user');

export const useAuth = create<CreateAuthStore>((set) => ({
  isLoggedIn: Boolean(localStorage.getItem('user')),
  user: user ? JSON.parse(user) : null,

  login: async (values) => {
    const { data } = await api.post('/auth/login', values);

    localStorage.setItem('user', JSON.stringify(data));

    set(() => ({ isLoggedIn: true, user: data }));

    return data;
  },

  register: async (values) => {

    const payload = {
      nome_completo: values.name,
      email: values.email,
      telefone: values.telefone,
      senha: values.password,
      data_cadastro: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    const response = await api.post('/auth/register', payload);

    localStorage.setItem('user', JSON.stringify(response.data));

    set(() => ({ isLoggedIn: true, user: response.data }));
  },

  logout: async () => {
    await api.get('/auth/logout');
    localStorage.removeItem('user');

    set(() => ({ isLoggedIn: false, user: null }));
  },

  forgotPassword: async (values) => {
    await api.post('/users/check-email', values);
  },

  resetPassword: async (values) => {

    const payload = {
      email: values.email,
      token: values.token,
      newPassword: values.password,
    }

    await api.put('/users/update-password', payload);
  },

  checkAuth: async () => {
    try {
      const { data } = await api.get('/auth/check-auth');
      set(() => ({ isLoggedIn: true, user: data }));
      localStorage.setItem('user', JSON.stringify(data));

      return true;
    } catch (error) {
      set(() => ({ isLoggedIn: false, user: null }));
      return false;
    }
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set(() => ({ user }));
  }
}));