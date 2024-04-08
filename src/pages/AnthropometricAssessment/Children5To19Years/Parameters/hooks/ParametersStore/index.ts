import { create } from "zustand";
import { ParametersStore } from "./types";
import { useSkinFoldsState } from "./SkinFoldsState";
import { useWeigthAndHeigthState } from "./WeigthAndHeigthState";
import { useBoneDiametersState } from "./BoneDiametersState";
import { useCircunferencesState } from "./CircunferencesState";
import { BodyDensityEquationSelectOptions, BodyFatEquationSelectOptions } from "../../../../Children5To19Years/Parameters/constants";
import { Child5to19AntropometricData, AntropometricAssessmentHistory } from "../../../../../../types/AntropometricAssessment";
import { calculateYearsDiffByDateISO } from "../../../../../../helpers/DateHelper";
import { isValidNumber, parseFloatNumber } from "../../../../../../helpers/MathHelpers";
import api from "../../../../../../services/useAxios";
import { getApiAssessmentDataUrl } from "../../../../Adult/Parameters/hooks/ParametersStore";
import { calculateBMI, calculateResidualWeight, calculateboneWeight, classifyBMIWithColor, classifyBodyFatKg, classifyCardiovascularRisk, classifyFatPercentage, classifyMuscleKg, classifyMusclePercentage, findIdealFatPercentageRange, findIdealMuscleRange, getIdealWeight, getIdealWeightClassification } from "../../../Results/helpers/GeneralEquations";
import { BodyCompositionMethod, BodyFatPercentageMethod, calculateBodyComposition, getBodyFatPercentage, getRequiredMeasures, parameterCalculation } from "../../../Results/helpers/BodyDensityEquation";

const findLastBoneValues = async (patientId: number) => {
  try {
    const { data } = await api.get<Child5to19AntropometricData>(`/antropometria-crianca5a19ano/last-bone-values/${patientId}`);
    return data;
  } catch (error) {
    return null
  }
}

const findLastHeightValues = async (patientId: number) => {
  try {
    const { data } = await api.get<Child5to19AntropometricData>(`/antropometria-crianca5a19ano/last-height-values/${patientId}`);
    return data;
  } catch (error) {
    return null
  }
}

export const useParametersStore = create<ParametersStore>((set) => ({
  apiAssessmentDataUrl: '',

  patientId: 0,
  patientAge: 0,
  patientIsMale: false,

  getAssessmentData: async (id: number) => {
    const { data } = await api.get<AntropometricAssessmentHistory<Child5to19AntropometricData>>(`/antropometria-historico/${id}`);
    const responseBoneValues = data.data?.idPaciente && (!data.data.diametroBicondioFemural || !data.data.diametroEstiloUlnar) ? await findLastBoneValues(data.data.idPaciente) : null;
    const responseHeightValues = data.data?.idPaciente && (!data.data.diametroBicondioFemural || !data.data.diametroEstiloUlnar) ? await findLastHeightValues(data.data.idPaciente) : null;

    set((state) => {
      if (!data.data) throw new Error('Assessment data not found');

      return {
        apiAssessmentDataUrl: getApiAssessmentDataUrl(data, data.data.id),

        patientId: data.data.idPaciente ? Number(data.data.idPaciente) : 0,
        patientAge: data.data.idade ? Number(data.data.idade) : data.patient ? calculateYearsDiffByDateISO(data.patient.dateOfBirth) : 0,
        patientIsMale: data.patient?.gender ? true : false,

        weight: Number(data.data.peso),
        height: Number(data.data.altura ? data.data.altura : responseHeightValues?.altura ?? 0),

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

        selectedBodyDensityEquation: data.data.protocolo ? BodyDensityEquationSelectOptions.find(eq => eq.value === data.data?.protocolo) ?? state.selectedBodyDensityEquation : state.selectedBodyDensityEquation,
        selectedBodyFatEquation: data.data.siri_ou_brozek ? BodyFatEquationSelectOptions.find(eq => eq.value === data.data?.siri_ou_brozek) ?? state.selectedBodyFatEquation : state.selectedBodyFatEquation,

        bicipital: Number(data.data.biceps),
        tricipital: Number(data.data.triceps),
        axilarMedia: Number(data.data.axilarMedia),
        suprailiaca: Number(data.data.suprailiaca),
        subescapular: Number(data.data.subescapular),
        abdominal: Number(data.data.abdominal),
        toracica: Number(data.data.torax),
        coxa: Number(data.data.coxa),
        panturrilha: Number(data.data.panturrilhaMedia),

        fist: Number(data.data.diametroEstiloUlnar ? data.data.diametroEstiloUlnar : responseBoneValues?.diametroEstiloUlnar ?? 0),
        femur: Number(data.data.diametroBicondioFemural ? data.data.diametroBicondioFemural : responseBoneValues?.diametroBicondioFemural ?? 0),
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

        const imc = isValidNumber(state.weight) && isValidNumber(state.height) ? calculateBMI(state.weight as number, state.height as number) : 0;
        const imcClassification = classifyBMIWithColor(imc);
        const idealBmi = state.patientAge >= 60 ? '22.0 - 27.0' : '18.5 - 24.9';

        const boneWeight =
          isValidNumber(state.height) && isValidNumber(state.fist) && isValidNumber(state.femur) ? calculateboneWeight(state.height as number, state.fist as number, state.femur as number) : 0;
        const residualWeight = isValidNumber(state.weight) ? calculateResidualWeight(state.weight as number, state.patientIsMale) : 0;
        const idealWeight = isValidNumber(state.height) ? getIdealWeight(Number(state.height)) : 0;
        const idealWeightClassification = getIdealWeightClassification(Number(state.weight), Number(state.height));

        const bodyDensity = () => {
          const bodyDensityParams: parameterCalculation = {
            isMale: state.patientIsMale,
            method: (state.selectedBodyDensityEquation?.value ?? 'jackson_pollock') as BodyCompositionMethod,
            age: state.patientAge,
            bi: typeof state.bicipital === 'number' ? state.bicipital : 0,
            tr: typeof state.tricipital === 'number' ? state.tricipital : 0,
            pt: typeof state.toracica === 'number' ? state.toracica : 0,
            ax: typeof state.axilarMedia === 'number' ? state.axilarMedia : 0,
            si: typeof state.suprailiaca === 'number' ? state.suprailiaca : 0,
            se: typeof state.subescapular === 'number' ? state.subescapular : 0,
            ab: typeof state.abdominal === 'number' ? state.abdominal : 0,
            cx: typeof state.coxa === 'number' ? state.coxa : 0,
            pm: typeof state.panturrilha === 'number' ? state.panturrilha : 0,
          };

          const requiredFields = state.selectedBodyDensityEquation
            ? getRequiredMeasures({
              isMale: state.patientIsMale,
              method: state.selectedBodyDensityEquation.value as BodyCompositionMethod,
              age: state.patientAge,
            })
            : [];

          const equationEnabled = requiredFields.reduce((acc, cur) => {
            if (acc || (typeof bodyDensityParams[cur] === 'number' && (bodyDensityParams[cur] as number) > 0)) return true;

            return acc;
          }, false);

          return state.selectedBodyDensityEquation && equationEnabled ? calculateBodyComposition(bodyDensityParams) : 0;
        };

        const bodyFat =
          state.selectedBodyFatEquation && state.selectedBodyDensityEquation?.value && bodyDensity
            ? getBodyFatPercentage(bodyDensity(), state.selectedBodyFatEquation.value as BodyFatPercentageMethod, state.selectedBodyDensityEquation.value as BodyCompositionMethod)
            : 0;

        const bodyFatKg = isValidNumber(bodyFat) && isValidNumber(state.weight) ? parseFloatNumber(((state.weight as number) * bodyFat) / 100) : 0;
        const idealFatPercentageRange = findIdealFatPercentageRange(state.patientAge, state.patientIsMale);
        const idealFatMin =
          idealFatPercentageRange && isValidNumber(state.weight) && Number(state.weight) ? parseFloatNumber((idealFatPercentageRange.minFat * 100) / Number(state.weight)) : 0;
        const idealFatMax =
          idealFatPercentageRange && isValidNumber(state.weight) && Number(state.weight) ? parseFloatNumber((idealFatPercentageRange.maxFat * 100) / Number(state.weight)) : 0;
        const bodyFatKgClassification = classifyBodyFatKg(idealFatPercentageRange, Number(state.weight), bodyFatKg);
        const BodyFatClassification = classifyFatPercentage(state.patientAge, state.patientIsMale, bodyFat);

        const fatFreeDoughKg = isValidNumber(state.weight) ? Number(state.weight) - bodyFatKg : 0;
        const fatFreeDoughPercentage = isValidNumber(fatFreeDoughKg) && isValidNumber(state.weight) ? (Number(fatFreeDoughKg) * 100) / Number(state.weight) : 0;

        const muscleWeight =
          isValidNumber(state.weight) && isValidNumber(residualWeight) && isValidNumber(boneWeight)
            ? Number(state.weight) - Number(residualWeight) - Number(bodyFatKg) - Number(boneWeight)
            : 0;

        const muscleWeightPercentage = isValidNumber(muscleWeight) && isValidNumber(state.weight) ? (Number(muscleWeight) * 100) / Number(state.weight) : 0;
        const idealMusclePercentageRange = findIdealMuscleRange(state.patientAge, state.patientIsMale);
        const idealMuscleMin =
          idealMusclePercentageRange && isValidNumber(state.weight) && Number(state.weight) ? parseFloatNumber((idealMusclePercentageRange.minMuscle * 100) / Number(state.weight)) : 0;
        const idealMuscleMax =
          idealMusclePercentageRange && isValidNumber(state.weight) && Number(state.weight) ? parseFloatNumber((idealMusclePercentageRange.maxMuscle * 100) / Number(state.weight)) : 0;
        const muscleWeigthPercentageClassification = classifyMusclePercentage(state.patientAge, state.patientIsMale, muscleWeightPercentage);
        const muscleWeightClassification = classifyMuscleKg(muscleWeight, { idealMuscleMin, idealMuscleMax });

        const skinFoldsSum =
          Number(state.bicipital) +
          Number(state.tricipital) +
          Number(state.axilarMedia) +
          Number(state.suprailiaca) +
          Number(state.abdominal) +
          Number(state.subescapular) +
          Number(state.toracica) +
          Number(state.coxa) +
          Number(state.panturrilha);

        const cardiovascularRisk = isValidNumber(state.waist) && isValidNumber(state.hip) ? classifyCardiovascularRisk(state.patientIsMale, Number(state.waist), Number(state.hip)) : null;

        const payload: Partial<Child5to19AntropometricData> = {
          dataAtualizacao: new Date(),
          idade: state.patientAge.toString(),

          ...uploadData,

          imc: parseFloatNumber(imc).toString(),
          imcClassificacao: imcClassification.classification,
          imcReferencia: idealBmi,

          pesoOsseo: parseFloatNumber(boneWeight).toString(),
          pesoResidual: parseFloatNumber(residualWeight).toString(),

          densidade: parseFloatNumber(bodyDensity()).toString(),

          pesoGordo: parseFloatNumber(bodyFatKg).toString(),
          percentualGordura: parseFloatNumber(bodyFat).toString(),

          massaGordaKgClassificacao: bodyFatKgClassification ? bodyFatKgClassification.classification : '',
          massaGordaKgRecomendado: idealFatMin && idealFatMax ? `${idealFatMin} - ${idealFatMax}` : null,
          massaGordaPercentualRecomendado: isValidNumber(bodyFat) && Number(bodyFat)
            ? idealFatPercentageRange
              ? `${idealFatPercentageRange.minFat} - ${idealFatPercentageRange.maxFat}`
              : null
            : null,
          massaGordaPercentualClassificacao: BodyFatClassification.classification,

          pesoMagro: parseFloatNumber(muscleWeight).toString(),
          percMassaMagra: parseFloatNumber(muscleWeightPercentage).toString(),

          somaDobras: parseFloatNumber(skinFoldsSum).toString(),
          pesoRecomendado: idealWeight.toString(),
          pesoClassificacao: idealWeightClassification ? idealWeightClassification.classification : '',
          riscocardio: cardiovascularRisk,
          massaMuscularKgRecomendado: idealMuscleMin && idealMuscleMax ? `${idealMuscleMin} - ${idealMuscleMax}` : null,
          massaMuscularPercentualRecomendado: muscleWeightPercentage
            ? idealMusclePercentageRange
              ? `${idealMusclePercentageRange.minMuscle} - ${idealMusclePercentageRange.maxMuscle}`
              : null
            : null,

          massaLivreDeGorduraKg: fatFreeDoughKg.toFixed(2),
          massaLivreDeGorduraPercentual: fatFreeDoughPercentage.toFixed(2),

          massaMuscularKgClassificacao: muscleWeightClassification.classification,
          massaMuscularPercentualClassificacao: muscleWeigthPercentageClassification.classification,

          protocolo: state.selectedBodyDensityEquation?.value ?? null,
        }

        api.patch<Child5to19AntropometricData>(apiAssessmentDataUrl, payload).then(() => resolve());

        return state
      });
    });
  },

  ...useSkinFoldsState(set),
  ...useWeigthAndHeigthState(set),
  ...useBoneDiametersState(set),
  ...useCircunferencesState(set),
}));