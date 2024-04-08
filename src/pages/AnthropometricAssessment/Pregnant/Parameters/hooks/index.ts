import { create } from "zustand";
import { ParametersStore } from "./types";
import { useWeigthAndHeigthState } from "./WeigthAndHeigthState";
import { useCircunferencesState } from "./CircunferencesState";
import { calculateDueDateAndGestationalAge, calculateImc, calculatePregestationalBMIEnhanced, getWeightGainRecommendation } from "../../Results/helpers/generalHelpers";
import { parseDateToIso } from "../../../../../helpers/DateHelper";
import { isValidNumber } from "../../../../../helpers/MathHelpers";
import { AntropometricAssessmentHistory, PregnantAntropometricData } from "../../../../../types/AntropometricAssessment";
import { getApiAssessmentDataUrl } from "../../../Adult/Parameters/hooks/ParametersStore";
import api from "../../../../../services/useAxios";

export const useParametersStore = create<ParametersStore>((set) => ({
  apiAssessmentDataUrl: '',

  data_registro: '2024-02-02',

  patientId: 0,
  patientAge: 0,
  patientIsMale: false,

  getAssessmentData: async (id: number) => {
    const { data } = await api.get<AntropometricAssessmentHistory<PregnantAntropometricData>>(`/antropometria-historico/${id}`);

    set(() => {
      if (!data.data) throw new Error('Assessment data not found');

      return {
        apiAssessmentDataUrl: getApiAssessmentDataUrl(data, data.data.id),

        patientId: data.data.idPaciente ? Number(data.data.idPaciente) : 0,
        patientIsMale: data.patient?.gender ? true : false,

        lastMenstruationDate: new Date(data.data.dataUltMenstruacao ? data.data.dataUltMenstruacao + ' 00:00:00' : new Date()),

        weight: Number(data.data.peso),
        weightPreGestational: Number(data.data.pesoPreGestacional),
        height: Number(data.data.altura),
        twinPregnancy: data.data.gestacaoGemelar ? true : false,

        neck: Number(data.data.pescoco),
        shoulder: Number(data.data.ombro),
        chest: Number(data.data.peitoral),
        abdomen: Number(data.data.abdomen),
        waist: Number(data.data.cintura),
        hip: Number(data.data.quadril),

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

        right_calf: Number(data.data.panturrilha_direita),
        left_calf: Number(data.data.panturrilha_esquerda),
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

        const dataProvavelParto = calculateDueDateAndGestationalAge(parseDateToIso(state.lastMenstruationDate), state.data_registro);

        const imcAtual = isValidNumber(state.weight) && isValidNumber(state.height) ? calculateImc(Number(state.weight), Number(state.height)) : 0;
        const { bmi, expectedWeightGain, category } =
          isValidNumber(state.weightPreGestational) && Number(state.weightPreGestational) && isValidNumber(state.height) && Number(state.height)
            ? calculatePregestationalBMIEnhanced(Number(state.weightPreGestational), Number(state.height), state.twinPregnancy)
            : { bmi: 0, expectedWeightGain: '', category: '' };
        const weightGainClassification =
          isValidNumber(state.weightPreGestational) && Number(state.weightPreGestational) && isValidNumber(state.height) && Number(state.height) ? getWeightGainRecommendation(imcAtual) : false;


        const payload: Partial<PregnantAntropometricData> = {
          ...uploadData,

          dataProvavelParto: dataProvavelParto.dueDate,
          idadeGestacional: dataProvavelParto.gestationalAge,
          imcAtual,
          imcPreGestacional: bmi,
          recGanhoPeso: expectedWeightGain,

          classificacao_imc_pre_gestacao: category,
          classificacao_imc_gestacional: weightGainClassification ? weightGainClassification.bmiCategory : '',
        }

        if (!state.apiAssessmentDataUrl) return state;

        api.patch<PregnantAntropometricData>(apiAssessmentDataUrl, payload).then(() => resolve());

        return state
      });
    });
  },

  ...useWeigthAndHeigthState(set),
  ...useCircunferencesState(set),
}));