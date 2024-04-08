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

export type MacrosMode = 'percentage' | 'gramas';

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

const savedMacrossMode = localStorage.getItem('macrossMode') as 'percentage' | 'gramas';

const defaultMacrosObject = {
  pretendido_kcal: '',
  pretendido_g: '',
  pretendido_gkg: '',
  prescrito_kcal: '',
  prescrito_g: '',
  percentage: '',
  porPeso: '',
}

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
    set((state) => {
      if (state.carbohydrates.pretendido_kcal !== carbohydrates.pretendido_kcal || state.carbohydrates.pretendido_gkg !== carbohydrates.pretendido_gkg)
        return { carbohydrates: { ...state.carbohydrates, ...carbohydrates } }
      else return state
    }),
  setProteins: (proteins) => set((state) => {
    if (state.proteins.pretendido_kcal !== proteins.pretendido_kcal || state.proteins.pretendido_gkg !== proteins.pretendido_gkg)
      return { proteins: { ...state.proteins, ...proteins } }
    else return state
  }),
  setLipids: (lipids) => set((state) => {
    if (state.lipids.pretendido_kcal !== lipids.pretendido_kcal || state.lipids.pretendido_gkg !== lipids.pretendido_gkg)
      return { lipids: { ...state.lipids, ...lipids } }
    else return state
  }),

  setPredition: (predition) => set({ ...predition }),
}));

export default useMacrosStore;