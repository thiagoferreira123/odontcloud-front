import { create } from "zustand";

type MacrosObject = {
  prescrito_kcal: string,
  pretendido_g: string,
  pretendido_gkg: string,
  prescrito_kcal: string,
  prescrito_g: string,
  percentage: string,
  porPeso: string,
}

type Predition = {
  vrProteinas: string | number;
  vrCarboidratos: string | number;
  vrLipideos: string | number;
  vrCalorias: string | number;
  vrPeso: string | number;
}

interface MacrosStore {
  carbohydrates: MacrosObject;
  proteins: MacrosObject;
  lipids: MacrosObject;

  vrProteinas: string | number;
  vrCarboidratos: string | number;
  vrLipideos: string | number;
  vrCalorias: string | number;
  vrPeso: string | number;

  macrossMode: 'percentage' | 'gramas';

  toggleMacrosMode: () => void;
  // eslint-disable-next-line no-unused-vars
  setCarbohydrates: (carbohydrates: Partial<MacrosObject>) => void;
  // eslint-disable-next-line no-unused-vars
  setProteins: (proteins: Partial<MacrosObject>) => void;
  // eslint-disable-next-line no-unused-vars
  setLipids: (lipids: Partial<MacrosObject>) => void;
  // eslint-disable-next-line no-unused-vars
  setPredition: (macros: Partial<Predition>) => void;
}

const defaultMacrosObject = {
  prescrito_kcal: '',
  pretendido_g: '',
  pretendido_gkg: '',
  prescrito_g: '',
  percentage: '',
  porPeso: '',
}

const useMacrosStore = create<MacrosStore>((set) => ({
  carbohydrates: defaultMacrosObject,
  proteins: defaultMacrosObject,
  lipids: defaultMacrosObject,

  vrProteinas: '',
  vrCarboidratos: '',
  vrLipideos: '',
  vrCalorias: '',
  vrPeso: '',

  macrossMode: 'percentage',

  toggleMacrosMode: () => set(state => ({ macrossMode: state.macrossMode === 'percentage' ? 'gramas' : 'percentage' })),

  setCarbohydrates: (carbohydrates) =>
    set((state) => {
      if (state.carbohydrates.prescrito_kcal !== carbohydrates.prescrito_kcal)
        return { carbohydrates: { ...state.carbohydrates, ...carbohydrates } }
      else return state
    }),
  setProteins: (proteins) => set((state) => {
    if (state.proteins.prescrito_kcal !== proteins.prescrito_kcal)
      return { proteins: { ...state.proteins, ...proteins } }
    else return state
  }),
  setLipids: (lipids) => set((state) => {
    if (state.lipids.prescrito_kcal !== lipids.prescrito_kcal)
      return { lipids: { ...state.lipids, ...lipids } }
    else return state
  }),

  setPredition: (predition) => set({ ...predition }),
}));

export default useMacrosStore;