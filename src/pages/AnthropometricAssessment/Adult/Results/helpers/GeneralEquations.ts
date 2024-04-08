import { isValidNumber, parseFloatNumber } from "../../../../../helpers/MathHelpers";

interface MuscleRange {
  minAge: number;
  maxAge?: number; // maxAge é opcional para cobrir '56 anos +' sem limite superior definido
  minMuscle: number;
  maxMuscle: number;
}

interface FatPercentageRange {
  minAge: number;
  maxAge: number;
  minFat: number;
  maxFat: number;
}

export function calculateBMI(weight: number, height: number): number {
  const bmi = weight / Math.pow(height, 2);
  return parseFloatNumber(bmi);
}

export function interpretBMI(age: number, bmi: number): string {

  if (!bmi) return '';

  if (age >= 60) {
    if (bmi <= 22.0) {
      return 'Baixo peso.';
    } else if (bmi > 22.0 && bmi < 27.0) {
      return 'Peso adequado (eutrófico).';
    } else {
      return 'Sobrepeso.';
    }
  } else {
    if (bmi < 18.5) {
      return 'Baixo peso.';
    } else if (bmi >= 18.5 && bmi < 25) {
      return 'Eutrófico.';
    } else if (bmi >= 25 && bmi < 30) {
      return 'Sobrepeso.';
    } else if (bmi >= 30 && bmi < 35) {
      return 'Obesidade grau I.';
    } else if (bmi >= 35 && bmi < 40) {
      return 'Obesidade grau II.';
    } else {
      return 'Obesidade grau III.';
    }
  }

}

export const classifyBMIWithColor = (bmi: number): { classification: string; color: string } => {
  if (bmi < 18.5) {
    return { classification: 'Baixo peso', color: 'warning' };
  } else if (bmi >= 18.5 && bmi < 25) {
    return { classification: 'Eutrófico', color: 'success' };
  } else if (bmi >= 25 && bmi < 30) {
    return { classification: 'Sobrepeso', color: 'warning' };
  } else if (bmi >= 30 && bmi < 35) {
    return { classification: 'Obesidade grau I', color: 'danger' };
  } else if (bmi >= 35.0 && bmi < 40) {
    return { classification: 'Obesidade grau II', color: 'danger' };
  } else { // Assumes bmi > 40
    return { classification: 'Obesidade grau III', color: 'danger' };
  }
}

/**
 * Peso Ósseo
 */

export const calculateboneWeight = (estatura: number, punho: number, femur: number) => {
  punho = punho / 100;
  femur = femur / 100;

  return (3.02 * Math.pow(estatura * estatura * punho * femur * 400, 0.712)).toFixed(2);
};


export const calculateResidualWeight = (weight: number, isMale: boolean) => {

  const factor = isMale ? 0.241 : 0.208;

  return (weight * factor).toFixed(1);
};


export const getIdealWeight = (HeightInMeters: number) => {
  if (!HeightInMeters) return ('');

  const calculateResult = (targetBMI: number) => {
    return ((2.2 * targetBMI) + (3.5 * targetBMI * (HeightInMeters - 1.5))).toFixed(1);
  };

  const TargetBMImin = 18.5;
  const TargetBMImax = 24.9;

  const resultTargetBMImin = calculateResult(TargetBMImin);
  const resultTargetBMImax = calculateResult(TargetBMImax);

  return (`${resultTargetBMImin} - ${resultTargetBMImax}`);
}

export const getIdealWeightClassification = (weight: number, height: number) => {
  if (!weight) return ('');

  const calculateResult = (targetBMI: number) => {
    return ((2.2 * targetBMI) + (3.5 * targetBMI * (height - 1.5))).toFixed(1);
  };

  const TargetBMImin = 18.5;
  const TargetBMImax = 24.9;

  const min = calculateResult(TargetBMImin);
  const max = calculateResult(TargetBMImax);

  if (weight < Number(min)) return { classification: 'Abaixo ideal', color: 'warning' };
  if (weight >= Number(min) && weight <= Number(max)) return { classification: 'Ideal', color: 'success' };
  if (weight > Number(max)) return { classification: 'Acima ideal', color: 'warning' };
}

export const waistByHip = (waist: number, hip: number) => {
  return (waist / hip);
}

export const classifyCardiovascularRisk = (isMale: boolean, waist: number, hip: number): string => {

  const rcq = waistByHip(waist, hip);

  if (!isMale) {
    if (rcq < 0.80) return 'Baixo risco';
    if (rcq >= 0.80 && rcq <= 0.85) return 'Risco moderado';
    if (rcq > 0.85) return 'Alto risco';
  } else if (isMale) {
    if (rcq < 0.95) return 'Baixo risco';
    if (rcq >= 0.95 && rcq <= 1.0) return 'Risco moderado';
    if (rcq > 1.0) return 'Alto risco';
  }
  return '';
}

export const calculateEstimatedHeight = (kneeHeight: number, age: number, isMale: boolean) => {
  const constants = [2.16, -0.06, 2.76, 60.76];
  return (
    (constants[3] +
      constants[0] * kneeHeight -
      constants[1] * age +
      constants[2] * (isMale ? 1 : 0)) / 100
  ).toFixed(2); // Convert to meters
};

export const calculateEstimatedWeight = (isMale: boolean, armCircumference: number, calfCircumference: number, subscapularSkinfold: number, kneeHeight: number) => {
  const coefficients = !isMale ? [0.98, 1.27, 0.40, 0.87, -62.35] : [1.73, 0.98, 0.37, 1.16, -81.69];
  return (
    coefficients[0] * armCircumference +
    coefficients[1] * calfCircumference +
    coefficients[2] * (subscapularSkinfold / 10) +
    coefficients[3] * kneeHeight +
    coefficients[4]
  ).toFixed(2);
};

export const classifyFatPercentage = (age: number, isMale: boolean, bodyFatPercentage: number): {
  classification: string;
  color: string;
} => {
  // Define fat percentage ranges for each age group and gender
  const ranges = [
    [
      { minAge: 19, maxAge: 39, minFat: 21, maxFat: 32 },
      { minAge: 40, maxAge: 59, minFat: 23, maxFat: 33 },
      { minAge: 60, maxAge: 79, minFat: 24, maxFat: 35 },
    ],
    [
      { minAge: 19, maxAge: 39, minFat: 8, maxFat: 19 },
      { minAge: 40, maxAge: 59, minFat: 11, maxFat: 21 },
      { minAge: 60, maxAge: 79, minFat: 13, maxFat: 24 },
    ]
  ];

  // Find the appropriate range based on age and gender
  const range = ranges[isMale ? 1 : 0].find(r => age >= r.minAge && age <= r.maxAge);

  // Classify the body fat percentage
  if (range) {
    if (bodyFatPercentage < range.minFat) return { classification: 'Abaixo ideal', color: 'warning' };
    else if (bodyFatPercentage <= range.maxFat) return { classification: 'Ideal', color: 'success' };
    else return { classification: 'Acima ideal', color: 'warning' };
  }

  return { classification: 'Age group or gender not specified correctly', color: 'warning' };
}

export const classifyBodyFatKg = (idealFatPercentageRange: FatPercentageRange | null, weight: number, bodyFatKg: number): {
  classification: string;
  color: string;
} => {

  if (!idealFatPercentageRange) return { classification: 'Percentage range not specified correctly', color: 'warning' };

  const min =
    idealFatPercentageRange && isValidNumber(weight) && Number(weight) ? parseFloatNumber((idealFatPercentageRange.minFat * 100) / Number(weight)) : 0;
  const max =
    idealFatPercentageRange && isValidNumber(weight) && Number(weight) ? parseFloatNumber((idealFatPercentageRange.maxFat * 100) / Number(weight)) : 0;

  // Classify the body fat percentage
  if (bodyFatKg < Number(min)) return { classification: 'Abaixo ideal', color: 'warning' };
  if (bodyFatKg >= Number(min) && bodyFatKg <= Number(max)) return { classification: 'Ideal', color: 'success' };
  if (bodyFatKg > Number(max)) return { classification: 'Acima ideal', color: 'warning' };

  return { classification: 'Weight not specified correctly', color: 'warning' };
}

export function classifyMusclePercentage(age: number, isMale: boolean, musclePercentage: number): {
  classification: string;
  color: string;
} {
  const ranges = [
    [
      { minAge: 19, maxAge: 35, minFat: 31, maxFat: 33 },
      { minAge: 36, maxAge: 55, minFat: 29, maxFat: 31 },
      { minAge: 56, minFat: 27, maxFat: 30 },
    ],
    [
      { minAge: 19, maxAge: 35, minFat: 40, maxFat: 44 },
      { minAge: 36, maxAge: 55, minFat: 36, maxFat: 40 },
      { minAge: 56, minFat: 32, maxFat: 35 },
    ]
  ];

  const range = ranges[isMale ? 1 : 0].find(r => age >= r.minAge && age <= Number(r.maxAge));

  if (!range) return { classification: 'Age group or gender not specified correctly', color: 'warning' };

  if (musclePercentage < range.minFat) return { classification: 'Abaixo ideal', color: 'warning' };
  else if (musclePercentage >= range.minFat && musclePercentage <= range.maxFat) return { classification: 'Ideal', color: 'success' };
  else return { classification: 'Acima ideal', color: 'warning' };
}

export function classifyMuscleKg(muscleWeigth: number, range: { idealMuscleMin: number, idealMuscleMax: number }): {
  classification: string;
  color: string;
} {
  if (!range) return { classification: 'muscleWeigth not specified correctly', color: 'warning' };

  if (muscleWeigth < range.idealMuscleMin) return { classification: 'Abaixo ideal', color: 'warning' };
  else if (muscleWeigth >= range.idealMuscleMin && muscleWeigth <= range.idealMuscleMax) return { classification: 'Ideal', color: 'success' };
  else return { classification: 'Acima ideal', color: 'warning' };
}

const musclePercentageRanges: MuscleRange[][] = [
  [
    { minAge: 19, maxAge: 35, minMuscle: 31, maxMuscle: 33 },
    { minAge: 36, maxAge: 55, minMuscle: 29, maxMuscle: 31 },
    { minAge: 56, minMuscle: 27, maxMuscle: 30 }, // maxAge não é necessário para 56+
  ],
  [
    { minAge: 19, maxAge: 35, minMuscle: 40, maxMuscle: 44 },
    { minAge: 36, maxAge: 55, minMuscle: 36, maxMuscle: 40 },
    { minAge: 56, minMuscle: 32, maxMuscle: 35 }, // maxAge não é necessário para 56+
  ]
];

export const findIdealMuscleRange = (age: number, isMale: boolean): MuscleRange | null => {
  const ranges = musclePercentageRanges[isMale ? 1 : 0];
  const range = ranges.find(r => age >= r.minAge && (r.maxAge === undefined || age <= r.maxAge));

  return range
    ? range
    : null;
}

const fatPercentageRanges: FatPercentageRange[][] = [
  [
    { minAge: 19, maxAge: 39, minFat: 21, maxFat: 32 },
    { minAge: 40, maxAge: 59, minFat: 23, maxFat: 33 },
    { minAge: 60, maxAge: 79, minFat: 24, maxFat: 35 },
  ],
  [
    { minAge: 19, maxAge: 39, minFat: 8, maxFat: 19 },
    { minAge: 40, maxAge: 59, minFat: 11, maxFat: 21 },
    { minAge: 60, maxAge: 79, minFat: 13, maxFat: 24 },
  ]
];

export const findIdealFatPercentageRange = (age: number, isMale: boolean): FatPercentageRange | null => {
  const ranges = fatPercentageRanges[isMale ? 1 : 0];
  const range = ranges.find(r => age >= r.minAge && age <= r.maxAge);

  return range
    ? range
    : null;
}