import { create } from "zustand";
import { ParametersStore } from "./types";
import { useWeigthAndHeigthState } from "./WeigthAndHeigthState";
import { useCircunferencesState } from "./CircunferencesState";
import api from "/src/services/useAxios";
import { BioimpedanceAntropometricData, AntropometricAssessmentHistory } from "/src/types/AntropometricAssessment";
import { isValidNumber, parseFloatNumber } from "/src/helpers/MathHelpers";
import { findIdealFatPercentageRange, findIdealMuscleRange, getIdealWeight, getIdealWeightClassification } from "/src/pages/AnthropometricAssessment/Adult/Results/helpers/GeneralEquations";
import { getApiAssessmentDataUrl } from "../../../Adult/Parameters/hooks/ParametersStore";
import { useBioimpedanceDataState } from "./BioimpedanceDataState";
import { calculateYearsDiffByDateISO } from "../../../../../helpers/DateHelper";

export const useParametersStore = create<ParametersStore>((set) => ({
  apiAssessmentDataUrl: '',

  patientId: 0,
  patientAge: 0,
  patientIsMale: false,

  getAssessmentData: async (id: number) => {
    const { data } = await api.get<AntropometricAssessmentHistory<BioimpedanceAntropometricData>>(`/antropometria-historico/${id}`);

    set(() => {
      if (!data.data) throw new Error('Assessment data not found');

      return {
        apiAssessmentDataUrl: getApiAssessmentDataUrl(data, data.data.idBioimpedancia),

        patientId: data.data.idPaciente ? Number(data.data.idPaciente) : 0,
        patientAge: data.patient ? calculateYearsDiffByDateISO(data.patient.dateOfBirth) : 0,
        patientIsMasc: data.patient?.gender ? true : false,

        weight: Number(data.data.pesoBioimpedancia),
        height: Number(data.data.alturaBioimpedancia),

        neck: Number(data.data.pescoco),
        shoulder: Number(data.data.ombro),
        chest: Number(data.data.peitoral),
        abdomen: Number(data.data.abdomen),
        waist: Number(data.data.cintura),
        hip: Number(data.data.quadril),

        right_calf: Number(data.data.panturrilhaDireita),
        left_calf: Number(data.data.panturrilhaEsquerda),

        left_fist: Number(data.data.punhoEsquerdo),
        right_fist: Number(data.data.punhoDireito),

        right_relaxed_arm: Number(data.data.bracoRelaxadoDireito),
        left_relaxed_arm: Number(data.data.bracoRelaxadoEsquerdo),
        right_contracted_arm: Number(data.data.bracoContraidoDireito),
        left_contracted_arm: Number(data.data.bracoContraidoEsquerdo),

        forearm_left: Number(data.data.antebracoEsquerdo),
        forearm_right: Number(data.data.antebracoDireito),

        right_proximal_thigh: Number(data.data.coxaProximalDireita),
        left_proximal_thigh: Number(data.data.coxaProximalEsquerda),
        right_medial_thigh: Number(data.data.coxaMedialDireita),
        left_medial_thigh: Number(data.data.coxaMedialEsquerda),
        right_distal_thigh: Number(data.data.coxaDistalDireita),
        left_distal_thigh: Number(data.data.coxaDistalEsquerda),

        bmi: Number(data.data.imcBioimpedancia),
        body_fat_percentage: Number(data.data.percMassaGordaBioimpedancia),
        fat_mass: Number(data.data.massaGordaBioimpedancia),
        lean_mass_percentage: Number(data.data.percMassaMagraBioimpedancia),
        lean_mass: Number(data.data.massaMagraBioimpedancia),
        bone_mass: Number(data.data.pesoOsseoBioimpedancia),
        residual_mass: Number(data.data.pesoResidualBioimpedancia),
        muscle_mass: Number(data.data.pesoMuscularBioimpedancia),
        visceral_fat: Number(data.data.gorduraVisceralBioimpedancia),
        metabolic_age: Number(data.data.idadeMetabolicaBioimpedancia),
        total_body_water: Number(data.data.aguaCorporalBioimpedancia),
        skeletal_muscle_mass_percentage: Number(data.data.percMusculosEsqueleticosBioimpedancia),
        total_body_water_percentage: Number(data.data.percAguaCorporalBioimpedancia),
        visceral_fat_percentage: Number(data.data.percGorduraVisceralBioimpedancia),
      }
    });

    return data;
  },

  /**
   * Refatorar mais tarde
   */
  updateData: async (apiAssessmentDataUrl, uploadData) => {
    return new Promise((resolve) => {
      set((state) => {
        const idealWeight = isValidNumber(state.height) ? getIdealWeight(Number(state.height)) : 0;
        const idealWeightClassification = getIdealWeightClassification(Number(state.weight), Number(state.height));

        const idealFatPercentageRange = findIdealFatPercentageRange(state.patientAge, state.patientIsMale);
        const idealFatMin =
          idealFatPercentageRange && isValidNumber(state.weight) && Number(state.weight) ? parseFloatNumber((idealFatPercentageRange.minFat * 100) / Number(state.weight)) : 0;
        const idealFatMax =
          idealFatPercentageRange && isValidNumber(state.weight) && Number(state.weight) ? parseFloatNumber((idealFatPercentageRange.maxFat * 100) / Number(state.weight)) : 0;


        const idealMusclePercentageRange = findIdealMuscleRange(state.patientAge, state.patientIsMale);
        const idealMuscleMin =
          idealMusclePercentageRange && isValidNumber(state.weight) && Number(state.weight) ? parseFloatNumber((idealMusclePercentageRange.minMuscle * 100) / Number(state.weight)) : 0;
        const idealMuscleMax =
          idealMusclePercentageRange && isValidNumber(state.weight) && Number(state.weight) ? parseFloatNumber((idealMusclePercentageRange.maxMuscle * 100) / Number(state.weight)) : 0;

        const payload: Partial<BioimpedanceAntropometricData> = {
          ...uploadData,

          bioimpedanciaMassaGordaKgRecomendado: idealFatMin && idealFatMax ? `${idealFatMin} - ${idealFatMax}` : null,

          pesoIdealBioimpedancia: idealWeight.toString(),
          bioimpedanciaPesoIdealClassificacao: idealWeightClassification ? idealWeightClassification.classification : '',
          bioimpedanciaMassaMagraKgRecomendado: idealMuscleMin && idealMuscleMax ? `${idealMuscleMin} - ${idealMuscleMax}` : null,
        }

        api.patch<BioimpedanceAntropometricData>(apiAssessmentDataUrl, payload).then(() => resolve());

        return state
      });
    });
  },

  ...useWeigthAndHeigthState(set),
  ...useCircunferencesState(set),
  ...useBioimpedanceDataState(),
}));