import { create } from "zustand";
import { Option } from "../../../types/inputs";
import { monthOptions } from "../../../helpers/DateHelper";

interface FiltersStore {
  query: string;
  categories: number[];
  selectedMonth: Option | null;
  selectedYear: Option | null;
  status: number; // 0 = all, 1 = active, 2 = inactive

  setStatus: (status: number) => void;
  setSelectMonth: (month: Option) => void;
  setSelectYear: (year: Option) => void;
  // eslint-disable-next-line no-unused-vars
  setQuery: (query: string) => void;
  // eslint-disable-next-line no-unused-vars
  setCategories: (categories: number[]) => void;
}

const actualDate = new Date();
const actualYear = actualDate.getFullYear();

export const useFiltersStore = create<FiltersStore>((set) => ({
  query: '',
  categories: [],
  selectedMonth: monthOptions[actualDate.getMonth()],
  selectedYear: { value: actualYear.toString(), label: actualYear.toString() },
  status: 0,

  setStatus: (status) => set({ status }),
  setSelectMonth: (month) => set({ selectedMonth: month }),
  setSelectYear: (year) => set({ selectedYear: year }),
  setQuery: (query) => {
    set(() => ({ query }));
  },
  setCategories: (categories) => {
    set(() => ({ categories }));
  },
}));