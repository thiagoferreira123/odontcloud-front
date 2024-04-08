import { create } from "zustand";

interface DateFilterStore {
  year: string;
  month: string;

  // eslint-disable-next-line no-unused-vars
  setYear: (year: string) => void;
  // eslint-disable-next-line no-unused-vars
  setMonth: (month: string) => void;
}

export const useDateFilterStore = create<DateFilterStore>((set) => ({
  year: (new Date).getFullYear().toString(),
  month: String((new Date()).getMonth() + 1).padStart(2, '0'),

  setYear: (year) => set({ year }),
  setMonth: (month) => set({ month }),
}));