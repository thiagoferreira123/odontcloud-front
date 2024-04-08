import { ParametersStore, WeigthAndHeigthState } from "./types";

// eslint-disable-next-line no-unused-vars
export const useWeigthAndHeigthState = (set: (partial: (state: ParametersStore) => Partial<ParametersStore>) => void) => (<WeigthAndHeigthState>{
  lastMenstruationDate: new Date(),
  weightPreGestational: 0,
  weight: 0,
  height: 0,

  twinPregnancy: false,

  setLastMenstruationDate: (lastMenstruationDate) => set(() => { return { lastMenstruationDate } }),
  setWeightPreGestational: (weightPreGestational) => set(() => { return { weightPreGestational } }),
  setTwinPregnancy: (twinPregnancy) => set(() => { return { twinPregnancy } }),
  setWeight: (weight) => set(() => { return { weight } }),
  setHeight: (height) => set(() => { return { height } }),
})