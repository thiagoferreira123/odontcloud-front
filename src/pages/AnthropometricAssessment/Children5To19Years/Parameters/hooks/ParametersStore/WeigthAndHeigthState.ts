import { ParametersStore, WeigthAndHeigthState } from "./types";

export const useWeigthAndHeigthState = (set: (partial: (state: ParametersStore) => Partial<ParametersStore>) => void) => (<WeigthAndHeigthState>{
  weight: 0,
  height: 0,

  setWeight: (weight) => set(() => { return { weight } }),
  setHeight: (height) => set(() => { return { height } }),
})