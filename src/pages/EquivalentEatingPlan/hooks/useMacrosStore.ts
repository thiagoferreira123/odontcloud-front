import { create } from "zustand";

type MacrosObject = {
  pretendido_kcal: string,
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
  ignoreUseEffect: boolean;

  carbohydrates: MacrosObject;
  proteins: MacrosObject;
  lipids: MacrosObject;

  vrProteinas: string | number;
  vrCarboidratos: string | number;
  vrLipideos: string | number;
  vrCalorias: string | number;
  vrPeso: string | number;

  macrossMode: 'percentage' | 'gramas';

  setIgnoreUseEffect: (ignoreUseEffect: boolean) => void;
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
  pretendido_kcal: '',
  pretendido_g: '',
  pretendido_gkg: '',
  prescrito_kcal: '',
  prescrito_g: '',
  percentage: '',
  porPeso: '',
}

const savedMacrossMode = localStorage.getItem('macrossMode') as 'percentage' | 'gramas';

const useMacrosStore = create<MacrosStore>((set) => ({
  ignoreUseEffect: false,

  carbohydrates: defaultMacrosObject,
  proteins: defaultMacrosObject,
  lipids: defaultMacrosObject,

  vrProteinas: '',
  vrCarboidratos: '',
  vrLipideos: '',
  vrCalorias: '',
  vrPeso: '',

  macrossMode: savedMacrossMode,

  setIgnoreUseEffect: (ignoreUseEffect) => set({ ignoreUseEffect }),

  toggleMacrosMode: () => set(state => {
    const macrossMode = state.macrossMode === 'percentage' ? 'gramas' : 'percentage';
    localStorage.setItem('macrossMode', macrossMode);
    return ({ macrossMode });
  }),

  setCarbohydrates: (carbohydrates) =>
    set((state) => { return { carbohydrates: { ...state.carbohydrates, ...carbohydrates } } }),
  setProteins: (proteins) => set((state) => { return { proteins: { ...state.proteins, ...proteins } } }),
  setLipids: (lipids) => set((state) => { return { lipids: { ...state.lipids, ...lipids } } }),

  setPredition: (predition) => set({ ...predition }),
}));

export default useMacrosStore;