import api from "/src/services/useAxios";
import { create } from "zustand";
import { microNutrients } from "../../../../helpers/MicronutrientConstants";
import { Food } from "/src/types/foods";
import { parseFloatNumber } from "/src/helpers/MathHelpers";
import { toCamelCase } from "/src/helpers/StringHelpers";

type DRI = {
  id: number;
  grupo: string;
  idade_max: number;
  idade_min: number;
  unidade_idade: string;
  vitamina_a_equivalente_de_atividade_de_retinol: string;
  vitamina_c: string;
  vitamina_d_calciferol: string;
  vitamina_e_total_de_alpha_tocopherol: string;
  tiamina_vitamina_b1: string;
  riboflavina_vitamina_b2: string;
  niacina_vitamina_b3: string;
  piridoxina_vitamina_b6: string;
  folato_equivalente_dietetico_de_folato: string;
  cobalamina_vitamina_b12: string;
  calcio: string;
  cobre: string;
  iodo: string;
  ferro: string;
  magnesio: string;
  manganes: string;
  fosforo: string;
  potassio: string;
  selenio: string;
  zinco: string;
  sodio: string;
  fibra_alimentar: string;
  pant: string;
  vitamina_k: string;
  colina: string;
  biotina: string;
}

type Micronutrient = {
  name: string;
  title: string;
  measure: string;
  value?: number;
  actualValue?: number;
  percentage?: number;
  difference?: number;
}

interface DriStore {
  driContent: DRI | null;
  microNutrients: Micronutrient[];
  // eslint-disable-next-line no-unused-vars
  getDriContent: (id: number, foods: Food[]) => Promise<DRI>;
  // eslint-disable-next-line no-unused-vars
  setDriContent: (driContent: DRI) => void;
}

export const useDriStore = create<DriStore>((set) => ({
  driContent: null,

  microNutrients,

  getDriContent: async (id, foods) => {
    const { data } = await api.get<DRI>('/dri/patient/' + id);

    set(state => {
      const microNutrients = state.microNutrients.map((micronutrient) => {
        const valueStr = Object.entries(data).find(([key]) => key === micronutrient.name);
        const value = valueStr ? Number(valueStr[1]) : 0;

        const actualValue = foods.reduce((acc, food) => {
          const nutrient = Object.entries(food).find(([key]) => key === toCamelCase(micronutrient.name));

          if (!nutrient) return acc;

          return acc + (Number(nutrient[1]) ? Number(nutrient[1]) * ((food.gramas ?? 0) / 100) : 0);
        }, 0);

        const percentage = value ? parseFloatNumber((actualValue / value) * 100) : 100;
        const difference = value ? parseFloatNumber(actualValue - value) : 0;

        return {
          ...micronutrient,
          value,
          actualValue,
          percentage,
          difference
        }
      });

      return { driContent: data, microNutrients }
    });

    return data;
  },

  setDriContent: (driContent: DRI) => {
    set(state => {
      const microNutrients = state.microNutrients.map((micronutrient) => {

        const value = Number(Object.entries(driContent).find(([key]) => key === micronutrient.name)?.[1]);

        return {
          ...micronutrient,
          value,
        }
      });

      return { driContent, microNutrients }
    });
  }
}));