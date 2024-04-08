import { CaloricExpenditureStore, EquationDataState } from "./types";

// eslint-disable-next-line no-unused-vars
const useEquationDataState = (set: (partial: (state: CaloricExpenditureStore) => Partial<CaloricExpenditureStore>) => void) => (<EquationDataState>{

  selectedPhysicalActivityFactor: 1,
  selectedPhysicalActivityFactorIndex: 0,

  height: 165,
  weight: 65,

  muscularWeight: 0,

  gestationWeek: 20,
  gestationTrimester: 1 as 1 | 2 | 3,
  lactationMonth: 0,

  setSelectedPhysicalActivityFactor: (physicalActivityFactor) => set(() => {
      return { selectedPhysicalActivityFactor: physicalActivityFactor };
    }),
  setHeight: (height) => set(() => {
      return { height };
    }),
  setWeight(weight) {
    set(() => {
      return { weight };
    });
  },
  setMuscularWeight(muscularWeight) {
    set(() => {
      return { muscularWeight };
    });
  },
  setGestationWeek(gestationWeek) {
    set(() => {
      return { gestationWeek };
    });
  },
  setGestationTrimester(gestationTrimester) {
    set(() => {
      return { gestationTrimester };
    });
  },
  setLactationMonth(lactationMonth) {
    set(() => {
      return { lactationMonth };
    });
  },
})

export default useEquationDataState;