import { ActivityLevel } from "../helpers/MathHelpers";
import { CaloricExpenditureStore, EquationState } from "./types";

// eslint-disable-next-line no-unused-vars
const useEquationState = (set: (partial: (state: CaloricExpenditureStore) => Partial<CaloricExpenditureStore>) => void) => (<EquationState>{

  selectedEquationFilter: '',
  selectedActivityFactor: 'Active' as ActivityLevel,
  selectedEquation: '',

  setSelectedEquationFilter: (equationFilter) =>
    set(() => {
      return { selectedEquationFilter: equationFilter };
    }),

  setSelectedActivityFactor: (activityFactor) =>
    set(() => {
      return { selectedActivityFactor: activityFactor };
    }),

  setSelectedEquation: (equation) =>
    set(() => {
      return { selectedEquation: equation };
    }),
})

export default useEquationState;