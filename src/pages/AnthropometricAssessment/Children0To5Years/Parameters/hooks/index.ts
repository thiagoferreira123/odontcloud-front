import { create } from "zustand";
import { ParametersStore } from "./types";
import api from "/src/services/useAxios";
import { AdultAntropometricData, AntropometricAssessmentHistory, Child0to5AntropometricData } from "/src/types/AntropometricAssessment";
import { useWeigthAndHeigthState } from "./WeigthAndHeigthState";
import { useCircunferencesState } from "./CircunferencesState";
import { getApiAssessmentDataUrl } from "/src/pages/AnthropometricAssessment/Adult/Parameters/hooks/ParametersStore";
import { calculateMonthsDiffByDateISO } from "/src/helpers/DateHelper";
import { isValidNumber } from "/src/helpers/MathHelpers";
import { calculateBMI, getIdealClassification, getIdealHeigth, getIdealImc, getIdealWeight } from "/src/pages/AnthropometricAssessment/Children0To5Years/Results/helpers/GeneralEquations";

export const useParametersStore = create<ParametersStore>((set) => ({
  apiAssessmentDataUrl: '',

  patientId: 0,
  patientAge: 0,
  patientIsMale: false,

  getAssessmentData: async (id: number) => {
    const { data } = await api.get<AntropometricAssessmentHistory<Child0to5AntropometricData>>(`/antropometria-historico/${id}`);

    set(() => {
      if (!data.data) throw new Error('Assessment data not found');

      return {
        apiAssessmentDataUrl: getApiAssessmentDataUrl(data, data.data.id),

        patientId: data.data.idPaciente ? Number(data.data.idPaciente) : 0,
        patientAge: data.data.idade ? Number(data.data.idade) : data.patient ? calculateMonthsDiffByDateISO(data.patient.dateOfBirth, Number(data.data_registro)) : 0,
        patientIsMale: data.patient?.gender ? true : false,

        weight: Number(data.data.peso),
        height: Number(data.data.altura),

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

        right_calf: Number(data.data.panturrilhaDireita),
        left_calf: Number(data.data.panturrilhaEsquerda),
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
        const imc = isValidNumber(state.height) && Number(state.height) ? calculateBMI(Number(state.weight), Number(state.height)) : 0;

        const idealHeigth = getIdealHeigth(state.patientAge, state.patientIsMale);
        const idealWeight = getIdealWeight(state.patientAge, state.patientIsMale);
        const idealImc = getIdealImc(state.patientAge, state.patientIsMale);

        const comprimentoClassificacao = getIdealClassification(Number(state.height), idealHeigth);
        const pesoClassificacao = getIdealClassification(Number(state.weight), idealWeight);
        const imcClassificacao = getIdealClassification(Number(imc), idealImc);

        const payload: Partial<AdultAntropometricData> = {
          dataAtualizacao: new Date(),
          idade: state.patientAge.toString(),

          pesoReferencia: idealWeight,
          imcReferencia: idealImc,
          estaturaParaIdade: idealHeigth,

          pesoAtual: state.weight,
          estaturaAtual: state.height,
          imcAtual: imc,

          pesoClassificacao: pesoClassificacao?.classification ?? '',
          comprimentoClassificacao: comprimentoClassificacao?.classification ?? '',
          imcClassificacao: imcClassificacao?.classification ?? '',

          ...uploadData,
        }

        if (!state.apiAssessmentDataUrl) return state;

        api.patch<AdultAntropometricData>(apiAssessmentDataUrl, payload).then(() => resolve());

        return state
      });
    });
  },

  ...useWeigthAndHeigthState(set),
  ...useCircunferencesState(set),
}));