import { CaloricExpenditure, CaloricExpenditureMet, CaloricExpenditureParameters } from "../../../types/CaloricExpenditure";
import { ActivityLevel } from "../helpers/MathHelpers";

export type CaloricExpenditureStore = {
  id: number;
  parameterId: number;
  patientId: number;

  patientAge: number;
  patientIsMale: boolean;

  desiredweightKg: number | string;

  // eslint-disable-next-line no-unused-vars
  getCaloricExpenditure: (id: number) => Promise<CaloricExpenditure | false>;
  // eslint-disable-next-line no-unused-vars
  persistParameters: (caloricExpenditure: Partial<CaloricExpenditureParameters>, parameterId: number) => Promise<boolean>;

  // eslint-disable-next-line no-unused-vars
  setDesiredWeight: (desiredweightKg: number | string) => void;
} & EquationState & EquationDataState & MetActivityState;

export interface EquationState {
  selectedEquationFilter: string;
  selectedEquation: string | null;
  selectedActivityFactor: ActivityLevel;

  // eslint-disable-next-line no-unused-vars
  setSelectedEquationFilter: (equationFilter: string) => void;
  // eslint-disable-next-line no-unused-vars
  setSelectedActivityFactor: (activityFactor: ActivityLevel) => void;
  // eslint-disable-next-line no-unused-vars
  setSelectedEquation: (equation: string) => void;
}

export interface EquationDataState {
  selectedPhysicalActivityFactor: number;
  selectedPhysicalActivityFactorIndex: number;

  height: number | string;
  weight: number | string;

  muscularWeight: number | string;
  // injuryFactor: number | string;

  gestationWeek: number | string;
  gestationTrimester: 1 | 2 | 3;
  lactationMonth: number | string;

  // eslint-disable-next-line no-unused-vars
  setSelectedPhysicalActivityFactor: (physicalActivityFactor: number) => void;
  // eslint-disable-next-line no-unused-vars
  setWeight: (weight: number | string) => void;
  // eslint-disable-next-line no-unused-vars
  setHeight: (height: number | string) => void;
  // eslint-disable-next-line no-unused-vars
  setMuscularWeight: (muscularWeight: number | string) => void;
  // eslint-disable-next-line no-unused-vars
  setGestationWeek: (gestationWeek: number | string) => void;
  // eslint-disable-next-line no-unused-vars
  setGestationTrimester: (gestationTrimester: 1 | 2 | 3) => void;
  // eslint-disable-next-line no-unused-vars
  setLactationMonth: (lactationMonth: number | string) => void;
}

export interface MetActivityState {
  mets: Met[];

  // eslint-disable-next-line no-unused-vars
  updateMet: (met: Partial<Met> & {
    id: number | string;
    id_gasto_calorico: number;
  }) => Promise<CaloricExpenditureMet | false>;
  // eslint-disable-next-line no-unused-vars
  addMet: (met: Met) => void;
  // eslint-disable-next-line no-unused-vars
  removeMet: (met: Met) => Promise<boolean>;
}

export interface Met {
  id: number | string;
  id_gasto_calorico: number;
  id_met: number;
  met: number;
  duracao: number | string;
  nome: string;
  kcal?: number;
}