import { create } from "zustand"
import { CreateAuthStore } from "./types"
import api from "../../../../services/useAxios";

const user = localStorage.getItem('user');

export const useAuth = create<CreateAuthStore>((set) => ({
  isLoggedIn: Boolean(localStorage.getItem('user')),
  user: user ? JSON.parse(user) : null,

  login: async (values) => {
    const { data } = await api.post('/clinic/login', values);

    localStorage.setItem('user', JSON.stringify(data));

    set(() => ({ isLoggedIn: true, user: data }));

    return data;
  },

  register: async (payload) => {
    const response = await api.post('/clinic', { ...payload, clinic_phone: payload.clinic_phone.replace(/\s/g, '').replace(/[^\w\s]/gi, ''), });

    localStorage.setItem('user', JSON.stringify(response.data));

    set(() => ({ isLoggedIn: true, user: response.data }));
  },

  logout: async () => {
    await api.get('/clinic/logout');
    localStorage.removeItem('user');

    set(() => ({ isLoggedIn: false, user: null }));
  },

  forgotPassword: async (values) => {
    await api.post('/clinic/request-password-reset', values);
  },

  resetPassword: async (values) => {
    const payload = {
      token: values.token,
      newPassword: values.password,
      confirmPassword: values.passwordConfirm
    }
    // const payload = {
    //   email: values.email,
    //   token: values.token,
    //   newPassword: values.password,
    // }

    await api.post('/clinic/reset-password', payload);
  },

  checkAuth: async () => {
    try {
      const { data } = await api.get('/clinic/check-auth');
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