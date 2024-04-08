import { create } from "zustand";
import { Option } from "../../../types/inputs";

export const months = [
  { value: '01', label: 'Janeiro' },
  { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' },
  { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
];

interface FiltersStore {
  selectedMonth: Option | null;
  selectedYear: Option | null;

  setSelectMonth: (month: Option) => void;
  setSelectYear: (year: Option) => void;
}

const actualDate = new Date();
const actualYear = actualDate.getFullYear();

export const useFiltersStore = create<FiltersStore>((set) => ({
  selectedMonth: months[actualDate.getMonth()],
  selectedYear: { value: actualYear.toString(), label: actualYear.toString() },

  setSelectMonth: (month) => set({ selectedMonth: month }),
  setSelectYear: (year) => set({ selectedYear: year }),
}));