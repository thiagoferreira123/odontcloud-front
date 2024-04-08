import { create } from 'zustand';
import { CaloricExpenditureStore } from './types';
import useEquationState from './EquationState';
import useEquationDataState from './EquationDataState';
import api from '../../../services/useAxios';
import { equations, mets } from '../helpers/constants';
import { CaloricExpenditure, CaloricExpenditureParameters } from '../../../types/CaloricExpenditure';
import { calculateYearsDiffByDateISO } from '../../../helpers/DateHelper';
import { AxiosResponse } from 'axios';
import { FemphysicalActivityLevel, MalephysicalActivityLevel } from '../helpers/constants';
import useMetActivityState from './MetActivityState';
import { isValidNumber } from '../../../helpers/MathHelpers';
import { calculateCalorieAdjustmentGET } from '../helpers/MathHelpers';
import { getTotalGebValue, getTotalGetValue } from '../helpers/stateHelper';

export const useCaloricExpenditureStore = create<CaloricExpenditureStore>((set) => ({
  id: 0,
  parameterId: 0,
  patientId: 0,
  patientAge: 30,
  patientIsMale: false,

  desiredweightKg: 0,

  setDesiredWeight: (desiredweightKg) => set({ desiredweightKg }),

  getCaloricExpenditure: async (id) => {
    try {
      const { data } = await api.get<CaloricExpenditure>('/gasto-calorico-historico/' + id);

      const patientIsMale = data.patient?.gender ? true : false;

      const weight = data.parametros && data.parametros[0] ? data.parametros[0].peso ?? 0 : 0;

      const mets_ = data.atividades?.length
        ? data.atividades?.map((met) => {
            const selectedMet = mets.find((m) => m.id === met.id_met);
            const kcal = isValidNumber(weight) ? Math.round((((selectedMet?.met ?? 0) * Number(weight)) / 60) * Number(met.duracao)) : 0;

            return {
              id: met.id ?? btoa(Math.random().toString()),
              id_gasto_calorico: met.id_gasto_calorico,
              id_met: met.id_met,
              met: selectedMet?.met ?? 0,
              duracao: met.duracao,
              nome: selectedMet?.nome ?? '',
              kcal,
            };
          })
        : [
            {
              id: btoa(Math.random().toString()),
              id_gasto_calorico: id,
              id_met: 0,
              met: 0,
              duracao: 0,
              nome: '',
            },
          ];

      const selectedEquation = data.parametros && data.parametros[0] ? data.parametros[0].formula ?? null : null;

      set({
        id: data.id,
        parameterId: data.parametros && data.parametros[0] ? data.parametros[0].id : 0,
        patientId: data.id_paciente ?? 0,

        mets: mets_,

        patientAge: data.patient?.dateOfBirth ? calculateYearsDiffByDateISO(data.patient.dateOfBirth) : 0,
        patientIsMale,

        weight: data.parametros && data.parametros[0] ? data.parametros[0].peso ?? 0 : 0,
        height: data.parametros && data.parametros[0] ? data.parametros[0].altura ?? 0 : 0,

        selectedPhysicalActivityFactor:
          data.parametros && data.parametros[0] && data.parametros[0].fator_atividade && Number(data.parametros[0].fator_atividade) >= 0
            ? patientIsMale
              ? Number(MalephysicalActivityLevel[data.parametros[0].fator_atividade].value)
              : Number(FemphysicalActivityLevel[data.parametros[0].fator_atividade].value) ?? 1
            : 1,
        selectedPhysicalActivityFactorIndex: data.parametros && data.parametros[0] ? data.parametros[0].fator_atividade ?? 0 : 0,

        gestationTrimester: data.parametros && data.parametros[0] ? data.parametros[0].trimestre_gestacao ?? 1 : 1,
        // gestationWeek: data.parametros && data.parametros[0] ? data.parametros[0].semestre_pos_gestacao ?? 0 : 0,

        muscularWeight: data.parametros && data.parametros[0] ? data.parametros[0].massa_magra ?? 0 : 0,

        selectedEquation,
        selectedActivityFactor: data.parametros && data.parametros[0] ? data.parametros[0].fator_atividade_dri_2023 ?? 'Active' : 'Active',

        lactationMonth: Number(data.parametros && data.parametros[0] ? data.parametros[0].mes_de_lactacao ?? 0 : 0),
        gestationWeek: Number(data.parametros && data.parametros[0] ? data.parametros[0].semana_gestacional ?? 0 : 0),
      });

      return data ?? false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  persistParameters: async (parameters, parameterId) => {
    return new Promise<boolean>((resolve, reject) => {
      set((state) => {
        try {

          const totalGet = getTotalGetValue(state);
          const totalGeb = getTotalGebValue(state);

          // const selectedEquation = data.parametros && data.parametros[0] ? data.parametros[0].formula ?? equations[0].value : equations[0].value;

          parameters.formula = parameters.formula ?? state.selectedEquation ?? equations[0].value;

          const calorieAjustment =
          isValidNumber(state.desiredweightKg) && Number(state.desiredweightKg)
            ? calculateCalorieAdjustmentGET(totalGet, Number(state.desiredweightKg))
            : 0;

          if (!parameterId) {
            const payload = {
              ...parameters,
              id_gasto_calorico: state.id,

              // fator_termico: '',
              // fator_injuria: '',
              // fator_injuria_valor: '',

              venta_peso_desejado: calorieAjustment,

              get: totalGet,
              geb: totalGeb,
              dataAtualizacao: new Date(),
              // semestre_amamentação: '',
            };

            api
              .post<CaloricExpenditureParameters>('/gasto-calorico-historico-dados-paciente', payload)
              .then(({ data }: AxiosResponse<CaloricExpenditureParameters>) => {
                resolve(true);
                set({ parameterId: data.id });
              });
          } else {
            const payload = {
              ...parameters,

              // fator_termico: '',
              // fator_injuria: '',
              // fator_injuria_valor: '',

              venta_peso_desejado: calorieAjustment,

              get: totalGet,
              geb: totalGeb,
              dataAtualizacao: new Date(),
              // semestre_amamentação: '',
            };
            api.put('/gasto-calorico-historico-dados-paciente/' + parameterId, payload).then(({ data }: AxiosResponse<CaloricExpenditureParameters>) => {
              resolve(true);
              set({ parameterId: data.id });
            });
          }

          return state;
        } catch (error) {
          console.error(error);
          reject(false);
          return state;
        }
      });
    });
  },

  ...useMetActivityState(set),
  ...useEquationState(set),
  ...useEquationDataState(set),
}));
