import { ParametersStore, BoneDiametersState } from "./types";

export const useBoneDiametersState = (set: (partial: (state: ParametersStore) => Partial<ParametersStore>) => void) => (<BoneDiametersState>{
  fist: 0,
  femur: 0,

  setFist: (fist) => set(() => { return { fist } }),
  setFemur: (femur) => set(() => { return { femur } }),
})