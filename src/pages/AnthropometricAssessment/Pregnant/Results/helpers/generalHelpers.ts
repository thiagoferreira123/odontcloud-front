import { parseFloatNumber } from "../../../../../helpers/MathHelpers";
import { parse, differenceInDays, addDays, format } from 'date-fns';

type DueDateAndGestationalAge = { dueDate: string; gestationalAge: string };

type BMIResult = {
  bmi: number;
  category: string;
  background: string;
  expectedWeightGain: string;
  expectedWeightGainMultiplePregnancy?: string;
};

type WeightGainRecommendation = {
  bmiCategory: string;
  firstTrimesterGain: number;
  weeklyGainAfterFirstTrimester: number;
  totalRecommendedGain: string;
  background: string;
};

export function calculateDueDateAndGestationalAge(dumInput: string): DueDateAndGestationalAge {
  // Parseia a data da última menstruação para o formato Date do JavaScript
  const dum = new Date(dumInput + 'T12:00:00');

  // Calcula a Data Provável do Parto adicionando 280 dias à DUM
  const dpp = addDays(dum, 280);

  // Calcula a diferença em dias entre a data atual e a DUM
  const diasDesdeDUM = differenceInDays(new Date(), dum);

  // Converte a diferença de dias em semanas e dias
  const semanas = Math.floor(diasDesdeDUM / 7);
  const dias = diasDesdeDUM % 7;

  return {
    dueDate: format(dpp, 'dd/MM/yyyy'), // Data de vencimento em formato ISO
    gestationalAge: `${semanas} semanas e ${dias} dias` // Idade gestacional formatada
  };
}


export function calculatePregestationalBMIEnhanced(weightKg: number, heightM: number, isMultiplePregnancy: boolean = false): BMIResult {
  const bmi = weightKg / heightM ** 2;
  const categories = [
    { limit: 18.5, category: "Baixo peso", gain: "12 a 18 Kg", background: "warning" },
    { limit: 24.9, category: "Peso adequado", gain: "11 a 15 Kg", gainMultiple: "16 a 24 Kg", background: "success" },
    { limit: 29.9, category: "Sobrepeso", gain: "7 a 11 Kg", gainMultiple: "14 a 23 Kg", background: "warning" },
    { limit: Infinity, category: "Obesidade", gain: "5 a 9 Kg", gainMultiple: "11 a 19 Kg", background: "danger" },
  ];

  const { category, gain, gainMultiple, background } = categories.find(({ limit }) => bmi <= limit)!;

  return {
    bmi: parseFloat(bmi.toFixed(2)),
    category,
    background,
    expectedWeightGain: isMultiplePregnancy && gainMultiple ? gainMultiple : gain,
    ...(isMultiplePregnancy && gainMultiple ? { expectedWeightGainMultiplePregnancy: gainMultiple } : {}),
  };
}

export function calculateImc(weight: number, height: number): number {
  return weight && height ? parseFloatNumber(weight / (height * height)) : 0;
}

export function getWeightGainRecommendation(bmi: number): WeightGainRecommendation {
  let recommendation: WeightGainRecommendation;

  if (bmi < 18.5) {
    recommendation = {
      bmiCategory: "Baixo Peso",
      firstTrimesterGain: 2.3,
      weeklyGainAfterFirstTrimester: 0.5,
      totalRecommendedGain: "12.5 - 18 kg total",
      background: "warning",
    };
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    recommendation = {
      bmiCategory: "Peso Adequado",
      firstTrimesterGain: 1.6,
      weeklyGainAfterFirstTrimester: 0.4,
      totalRecommendedGain: "11.5 - 16 kg total",
      background: "success",
    };
  } else if (bmi >= 25 && bmi <= 29.9) {
    recommendation = {
      bmiCategory: "Sobrepeso",
      firstTrimesterGain: 0.9,
      weeklyGainAfterFirstTrimester: 0.3,
      totalRecommendedGain: "7 - 11.5 kg total",
      background: "warning",
    };
  } else {
    recommendation = {
      bmiCategory: "Obesidade",
      firstTrimesterGain: 0,
      weeklyGainAfterFirstTrimester: 0.2,
      totalRecommendedGain: "5 - 9 kg total",
      background: "danger",
    };
  }

  return recommendation;
}

export function calculateWeeklyWeightGainAndDifference(gestationalBMI: number, currentWeight: number) {
  const recommendation = getWeightGainRecommendation(gestationalBMI);

  let totalRecommendedWeight = currentWeight + recommendation.firstTrimesterGain; // Peso após o ganho no primeiro trimestre
  let difference = 0; // Diferença entre o peso recomendado e o peso atual

  const tableRows = [];

  for (let week = 1; week <= 42; week++) {
    if (week > 12) { // Adiciona o ganho semanal após o primeiro trimestre
      totalRecommendedWeight += recommendation.weeklyGainAfterFirstTrimester;
    }

    // Calcula a diferença para o peso atual
    difference = totalRecommendedWeight - currentWeight;
    const differenceDescription = difference < 0 ? "Acima" : "Abaixo";

    if (week > 11) {
      tableRows.push({
        week,
        totalRecommendedWeight: parseFloatNumber(totalRecommendedWeight),
        differenceDescription,
        difference: parseFloatNumber(difference)
      });
    }
  }

  return tableRows;
}
