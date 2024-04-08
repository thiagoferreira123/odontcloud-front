interface InfantTeeParams {
  sex: number; // 1 para masculino, 0 para feminino
  ageYears: number; // idade em anos
  height: number; // altura em cm
  weight: number; // peso em kg
}

interface TeeParams {
  sex: number; // 1 para masculino, 0 para feminino
  age: number; // idade em anos
  height: number; // altura em cm
  weight: number; // peso em kg
  activityLevel: ActivityLevel;
}

interface BeeParams {
  ageYears: number; // idade em anos
  weight: number; // peso em quilogramas
}

interface EerParams {
  age: number; // idade em anos
  weight: number; // peso em quilogramas
  height: number; // altura em metros
  pal?: number; // Nível de Atividade Física (Physical Activity Level)
  sex: Gender; // Sexo da criança
}

interface Eer9a19Params {
  age: number; // idade em anos
  weight: number; // peso em quilogramas
  height: number; // altura em metros
  pal?: number; // Nível de Atividade Física (Physical Activity Level)
  gender: 0 | 1; // 0 para feminino, 1 para masculino
}

interface AdultEerParams {
  age: number; // idade em anos
  weight: number; // peso em quilogramas
  height: number; // altura em metros
  pal?: number; // Nível de Atividade Física (Physical Activity Level)
  gender: 0 | 1; // 0 para feminino, 1 para masculino
}

interface TmbParams {
  weight: number; // Peso atual ou desejado em Kg
  gender: 0 | 1; // 0 para feminino, 1 para masculino
}

interface PregnantWomenTeeParams {
  age: number; // idade em anos
  height: number; // altura em cm
  weight: number; // peso em kg
  gestation: number; // semanas de gestação
  activityLevel: ActivityLevel;
}

interface PregnancyEerParams {
  age: number; // idade em anos
  weight: number; // peso em quilogramas
  height: number; // altura em metros
  pal: number; // Nível de Atividade Física (Physical Activity Level)
  trimester: 1 | 2 | 3; // Trimestre da gravidez
}

interface AdultPregnancyEerParams {
  age: number; // idade em anos
  weight: number; // peso em quilogramas
  height: number; // altura em metros
  pal: number; // Nível de Atividade Física (Physical Activity Level)
  trimester: 1 | 2 | 3; // Trimestre da gravidez
}

interface ChildTeeParams {
  sex: number; // 1 para masculino, 0 para feminino
  age: number; // idade em anos
  height: number; // altura em cm
  weight: number; // peso em kg
  activityLevel: ActivityLevel;
}

interface ObesityParams {
  age: number; // idade em anos
  weight: number; // peso em quilogramas
  height: number; // altura em metros
  pal?: number; // Nível de Atividade Física (Physical Activity Level)
  gender: 0 | 1; // 0 para feminino, 1 para masculino
}

interface HealthParams {
  weight: number;
  height: number;
  age: number;
  gender: 0 | 1; // 0 para feminino, 1 para masculino
}

interface LactatingGirlsEerParams {
  age: number; // age in years
  height: number; // height in cm
  weight: number; // weight in kg
  activityLevel: ActivityLevel;
  lactationMonth: number; // month of lactation, if applicable
}

interface LactatingWomenEerParams {
  age: number; // age in years
  height: number; // height in cm
  weight: number; // weight in kg
  activityLevel: ActivityLevel;
  lactationMonth: number; // month of lactation
}

export type ActivityLevel = 'Inactive' | 'LowActive' | 'Active' | 'VeryActive';
type Gender = 0 | 1;

export function dRI20230a2yearsTEE({ sex, ageYears, height, weight }: InfantTeeParams): number {
  // Converte idade de anos para meses
  const age = ageYears * 12;
  if (sex === 1) {
    // Equação para meninos de 0 a 2 anos, com resultado arredondado
    return Math.round(-716.45 - (1.00 * age) + (17.82 * height) + (15.06 * weight));
  } else {
    // Equação para meninas de 0 a 2 anos, com resultado arredondado
    return Math.round(-69.15 + (80.0 * age) + (2.65 * height) + (54.15 * weight));
  }
}

export function dRI20233a18years({ sex, age, height, weight, activityLevel }: ChildTeeParams): number {
  if (sex === 1) { // Meninos
    switch (activityLevel) {
      case 'Inactive':
        return Math.round(-447.51 + (3.68 * age) + (13.01 * height) + (13.15 * weight));
      case 'LowActive':
        return Math.round(19.12 + (3.68 * age) + (8.62 * height) + (20.28 * weight));
      case 'Active':
        return Math.round(-388.19 + (3.68 * age) + (12.66 * height) + (20.46 * weight));
      case 'VeryActive':
        return Math.round(-671.75 + (3.68 * age) + (15.38 * height) + (23.25 * weight));
      default:
        throw new Error("Invalid activity level.");
    }
  } else { // Meninas
    switch (activityLevel) {
      case 'Inactive':
        return Math.round(55.59 - (22.25 * age) + (8.43 * height) + (17.07 * weight));
      case 'LowActive':
        return Math.round(-297.54 - (22.25 * age) + (12.77 * height) + (14.73 * weight));
      case 'Active':
        return Math.round(-189.55 - (22.25 * age) + (11.74 * height) + (18.34 * weight));
      case 'VeryActive':
        return Math.round(-709.59 - (22.25 * age) + (18.22 * height) + (14.25 * weight));
      default:
        throw new Error("Invalid activity level.");
    }
  }
}

export function dRI202319years({ sex, age, height, weight, activityLevel }: TeeParams): number {
  if (sex === 1) { // Homens
    switch (activityLevel) {
      case 'Inactive':
        return Math.round(753.07 - (10.83 * age) + (6.50 * height) + (14.10 * weight));
      case 'LowActive':
        return Math.round(581.47 - (10.83 * age) + (8.30 * height) + (14.94 * weight));
      case 'Active':
        return Math.round(1004.82 - (10.83 * age) + (6.52 * height) + (15.91 * weight));
      case 'VeryActive':
        return Math.round(-517.88 - (10.83 * age) + (15.61 * height) + (19.11 * weight));
      default:
        throw new Error("Invalid activity level.");
    }
  } else { // Mulheres
    switch (activityLevel) {
      case 'Inactive':
        return Math.round(584.90 - (7.01 * age) + (5.72 * height) + (11.71 * weight));
      case 'LowActive':
        return Math.round(575.77 - (7.01 * age) + (6.60 * height) + (12.14 * weight));
      case 'Active':
        return Math.round(710.25 - (7.01 * age) + (6.54 * height) + (12.34 * weight));
      case 'VeryActive':
        return Math.round(511.83 - (7.01 * age) + (9.07 * height) + (12.56 * weight));
      default:
        throw new Error("Invalid activity level.");
    }
  }
}

export function dRI20050a3years({ ageYears, weight }: BeeParams): number {
  const ageMonths = ageYears * 12;

  if (ageMonths >= 0 && ageMonths <= 3) {
    return Math.round((89 * weight - 100) + 175);
  } else if (ageMonths >= 4 && ageMonths <= 6) {
    return Math.round((89 * weight - 100) + 56);
  } else if (ageMonths >= 7 && ageMonths <= 12) {
    return Math.round((89 * weight - 100) + 22);
  } else if (ageMonths >= 13 && ageMonths <= 36) {
    return Math.round((89 * weight - 100) + 20);
  } else {
    throw new Error("Idade fora do intervalo especificado (0 a 36 meses).");
  }
}

export function calculatePa(gender: Gender, pal: number) {
  return pal;
}

export function calculatePaAdult(gender: Gender, pal: number) {
  return pal;
}

export function dRI20053a8years({ age, weight, height, sex }: EerParams): number {
  // Calcular EER com base no sexo
  if (sex === 1) {
    return Math.round(88.5 - (61.9 * age) + 1 * (26.7 * weight + 903 * height) + 20);
  } else {
    return Math.round(135.3 - (30.8 * age) + 1 * (10.0 * weight + 934 * height) + 20);
  }
}
export function dRI20053a8yearsPa({ age, weight, height, pal, sex }: EerParams): number {

  if (!pal) return 0;

  // Calcular EER com base no sexo
  if (sex === 1) {
    return Math.round(88.5 - (61.9 * age) + pal * (26.7 * weight + 903 * height) + 20);
  } else {
    return Math.round(135.3 - (30.8 * age) + pal * (10.0 * weight + 934 * height) + 20);
  }
}

export function eerIom9a18years({ age, weight, height, gender }: Eer9a19Params): number {
  // Calcular EER com base no gênero
  if (gender === 1) {
    // Meninos
    return Math.round(88.5 - (61.9 * age) + 1 * (26.7 * weight + 903 * height) + 25);
  } else {
    // Meninas
    return Math.round(135.3 - (30.8 * age) + 1 * (10.0 * weight + 934 * height) + 25);
  }
}

export function eerIom9a18yearsPa({ age, weight, height, pal, gender }: Eer9a19Params): number {

  if (!pal) return 0;

  // Calcular EER com base no gênero
  if (gender === 1) {
    // Meninos
    return Math.round(88.5 - (61.9 * age) + pal * (26.7 * weight + 903 * height) + 25);
  } else {
    // Meninas
    return Math.round(135.3 - (30.8 * age) + pal * (10.0 * weight + 934 * height) + 25);
  }
}

export function calculateAdultEER({ age, weight, height, gender }: AdultEerParams): number {
  // Calcular EER com base no gênero
  if (gender === 1) {
    // Homens
    return Math.round(662 - (9.53 * age) + 1 * (15.91 * weight + 539.6 * height));
  } else {
    // Mulheres
    return Math.round(354 - (6.91 * age) + 1 * (9.36 * weight + 726 * height));
  }
}

export function calculateAdultEERPa({ age, weight, height, pal, gender }: AdultEerParams): number {

  if (!pal) return 0;

  // Calcular EER com base no gênero
  if (gender === 1) {
    // Homens
    return Math.round(662 - (9.53 * age) + pal * (15.91 * weight + 539.6 * height));
  } else {
    // Mulheres
    return Math.round(354 - (6.91 * age) + pal * (9.36 * weight + 726 * height));
  }
}

export function Schofield1985(age: number, weight: number, gender: Gender): number {
  if (gender === 1) {
    if (age < 3) {
      return Math.round(59.512 * weight - 30.4);
    } else if (age <= 10) {
      return Math.round(22.706 * weight + 504.3);
    } else if (age <= 18) {
      return Math.round(17.686 * weight + 658.2);
    } else if (age <= 30) {
      return Math.round(15.057 * weight + 692.2);
    } else if (age <= 60) {
      return Math.round(11.472 * weight + 873.1);
    } else {
      return Math.round(11.711 * weight + 587.7);
    }
  } else {
    if (age < 3) {
      return Math.round(58.317 * weight - 31.1);
    } else if (age <= 10) {
      return Math.round(20.315 * weight + 485.9);
    } else if (age <= 18) {
      return Math.round(13.384 * weight + 692.6);
    } else if (age <= 30) {
      return Math.round(14.818 * weight + 486.6);
    } else if (age <= 60) {
      return Math.round(8.126 * weight + 845.6);
    } else {
      return Math.round(9.082 * weight + 658.5);
    }
  }
}

export function HenryERees1991({ weight, gender }: TmbParams): number {
  if (gender === 1) { // Homens
    return Math.round((0.056 * weight + 2.8) * 239);
  } else { // Mulheres
    return Math.round((0.048 * weight + 2.562) * 239);
  }
}

export function Cunningham1980(MLG: number): number {
  return Math.round(500 + 22 * MLG);
}

export function KatchMcArdle1996(MLG: number): number {
  return Math.round(370 + (21.6 * MLG));
}

export function TenHaaf2014LeanMass(MLG: number): number {
  return Math.round((22.771 * MLG) + 484.264);
}

export function TenHaaf2014Weight(weight: number, height: number, age: number, sex: 0 | 1): number {
  return Math.round((11.936 * weight) + (587.728 * height) - (8.129 * age) + (191.027 * sex) + 29.279);
}

export function Tinsley2019MuscularWeight(MLG: number): number {
  return Math.round(25.9 * MLG + 284);
}

export function Tinsley2019Weight(weight: number): number {
  return Math.round((24.8 * weight) + 10);
}

export function DRI2023Pregnant({ age, height, weight, gestation, activityLevel }: PregnantWomenTeeParams): number {
  switch (activityLevel) {
    case 'Inactive':
      return Math.round(1131.20 - (2.04 * age) + (0.34 * height) + (12.15 * weight) + (9.16 * gestation));
    case 'LowActive':
      return Math.round(693.35 - (2.04 * age) + (5.73 * height) + (10.20 * weight) + (9.16 * gestation));
    case 'Active':
      return Math.round(-223.84 - (2.04 * age) + (13.23 * height) + (8.15 * weight) + (9.16 * gestation));
    case 'VeryActive':
      return Math.round(-779.72 - (2.04 * age) + (18.45 * height) + (8.73 * weight) + (9.16 * gestation));
    default:
      throw new Error("Invalid activity level.");
  }
}

export function calculatePregnancyEER(params: PregnancyEerParams): number {
  const adolescentEER = eerIom9a18yearsPa({ ...params, gender: 0 } as Eer9a19Params);

  switch (params.trimester) {
    case 1:
      // 1º trimestre: EER adolescente + 0 + 0
      return adolescentEER;
    case 2:
      // 2º trimestre: EER adolescente + 160 kcal + 180 kcal
      return adolescentEER + 160 + 180;
    case 3:
      // 3º trimestre: EER adolescente + 272 kcal + 180 kcal
      return adolescentEER + 272 + 180;
    default:
      throw new Error("Trimestre inválido. Por favor, insira 1, 2 ou 3.");
  }
}

export function calculatePregnancyEERAdult(params: AdultPregnancyEerParams): number {
  const adultEER = calculateAdultEERPa({ ...params, gender: 0 });

  switch (params.trimester) {
    case 1:
      // 1º trimestre: EER adulto + 0 + 0
      return adultEER;
    case 2:
      // 2º trimestre: EER adulto + 160 kcal + 180 kcal
      return adultEER + 160 + 180;
    case 3:
      // 3º trimestre: EER adulto + 272 kcal + 180 kcal
      return adultEER + 272 + 180;
    default:
      throw new Error("Trimestre inválido. Por favor, insira 1, 2 ou 3.");
  }
}

export function dri200519yearsObesity({ age, weight, height, gender }: ObesityParams): number {
  // Calcular TEE com base no gênero
  if (gender === 1) {
    // Homens com sobrepeso e obesos
    return Math.round(1086 - (10.1 * age) + 1 * (13.7 * weight + 416 * height));
  } else {
    // Mulheres com sobrepeso e obesas
    return Math.round(448 - (7.95 * age) + 1 * (11.4 * weight + 619 * height));
  }
}

export function dri200519yearsObesityPa({ age, weight, height, pal, gender }: ObesityParams): number {

  if (!pal) return 0;

  // Calcular TEE com base no gênero
  if (gender === 1) {
    // Homens com sobrepeso e obesos
    return Math.round(1086 - (10.1 * age) + pal * (13.7 * weight + 416 * height));
  } else {
    // Mulheres com sobrepeso e obesas
    return Math.round(448 - (7.95 * age) + pal * (11.4 * weight + 619 * height));
  }
}

export function HorieWaitzberg(peso: number, massaMagra: number): number {
  return Math.round(560.43 + (5.39 * peso) + (14.14 * massaMagra));
}

export function MiffliStJeor(weight: number, height: number, age: number, gender: Gender): number {
  if (gender === 1) {
    return Math.round((10 * weight) + (6.25 * height) - (5 * age) + 5);
  } else { // Assuming gender === 'Female'
    return Math.round((10 * weight) + (6.25 * height) - (5 * age) - 161);
  }
}

export function herrisBenedict1919({ weight, height, age, gender }: HealthParams): number {
  if (gender === 1) {
    // Homens
    return Math.round(66 + (13.7 * weight) + (5 * height) - (6.8 * age));
  } else {
    // Mulheres
    return Math.round(655 + (9.6 * weight) + (1.8 * height) - (4.7 * age));
  }
}

export function herrisBenedict1984RevisedRozaAndShizgal({ weight, height, age, gender }: HealthParams): number {
  if (gender === 1) {
    // Homens
    return Math.round((13.397 * weight) + (4.799 * height) - (5.677 * age) + 88.362);
  } else {
    // Mulheres
    return Math.round((9.247 * weight) + (3.098 * height) - (4.330 * age) + 447.593);
  }
}

export function calculateLactatingGirlsEER({ age, height, weight, activityLevel, lactationMonth }: LactatingGirlsEerParams): number {
  // Assuming energy cost of milk production and energy mobilization
  const milkProduction = lactationMonth <= 6 ? 500 : 400;
  const energyMobilization = lactationMonth <= 6 ? 170 : 0;

  let baseEER: number;
  switch (activityLevel) {
      case 'Inactive':
          baseEER = 55.59 - (22.25 * age) + (8.43 * height) + (17.07 * weight);
          break;
      case 'LowActive':
          baseEER = -297.54 - (22.25 * age) + (12.77 * height) + (14.73 * weight);
          break;
      case 'Active':
          baseEER = -189.55 - (22.25 * age) + (11.74 * height) + (18.34 * weight);
          break;
      case 'VeryActive':
          baseEER = -709.59 - (22.25 * age) + (18.22 * height) + (14.25 * weight);
          break;
      default:
          throw new Error("Invalid activity level.");
  }

  return Math.round(baseEER + milkProduction - energyMobilization);
}

export function dRI2023Lactation19to0a6MonthsPostpartum({ age, height, weight, activityLevel, lactationMonth }: LactatingWomenEerParams): number {
  // Assuming energy cost of milk production and energy mobilization
  const milkProduction = lactationMonth <= 6 ? 500 : 400; // Energy cost of milk production
  const energyMobilization = lactationMonth <= 6 ? 170 : 0; // Energy mobilization

  let baseEER: number;
  switch (activityLevel) {
      case 'Inactive':
          baseEER = 584.90 - (7.01 * age) + (5.72 * height) + (11.71 * weight);
          break;
      case 'LowActive':
          baseEER = 575.77 - (7.01 * age) + (6.60 * height) + (12.14 * weight);
          break;
      case 'Active':
          baseEER = 710.25 - (7.01 * age) + (6.54 * height) + (12.34 * weight);
          break;
      case 'VeryActive':
          baseEER = 511.83 - (7.01 * age) + (9.07 * height) + (12.56 * weight);
          break;
      default:
          throw new Error("Invalid activity level.");
  }

  return Math.round(baseEER + milkProduction - energyMobilization);
}

export function dRI2023LactatioSmaller19years7to12MonthsPostpartum({ age, height, weight, activityLevel, lactationMonth }: {
  age: number;
  height: number;
  weight: number;
  activityLevel: ActivityLevel;
  lactationMonth?: number; // Optional, as not all under 19 will be lactating
}): number {
  // Placeholder for energy cost of milk production, adjust as needed
  const milkProduction = lactationMonth && lactationMonth <= 6 ? 500 : (lactationMonth && lactationMonth > 6 ? 400 : 0);

  let baseEER: number;
  switch (activityLevel) {
      case 'Inactive':
          baseEER = 55.59 - (22.25 * age) + (8.43 * height) + (17.07 * weight);
          break;
      case 'LowActive':
          baseEER = -297.54 - (22.25 * age) + (12.77 * height) + (14.73 * weight);
          break;
      case 'Active':
          baseEER = -189.55 - (22.25 * age) + (11.74 * height) + (18.34 * weight);
          break;
      case 'VeryActive':
          baseEER = -709.59 - (22.25 * age) + (18.22 * height) + (14.25 * weight);
          break;
      default:
          throw new Error("Invalid activity level.");
  }

  return Math.round(baseEER + milkProduction); // Adding the energy cost of milk production directly
}

export function dRI2023LactatioBigger19years7to12MonthsPostpartum({ age, height, weight, activityLevel, lactationMonth }: {
  age: number;
  height: number;
  weight: number;
  activityLevel: ActivityLevel;
  lactationMonth?: number; // Optional, as not all under 19 will be lactating
}): number {
  // Assuming energy cost of milk production based on lactation stage
  const milkProduction = lactationMonth && lactationMonth <= 6 ? 500 : (lactationMonth && lactationMonth > 6 ? 400 : 0);

  let baseEER: number;
  switch (activityLevel) {
      case 'Inactive':
          baseEER = 584.90 - (7.01 * age) + (5.72 * height) + (11.71 * weight);
          break;
      case 'LowActive':
          baseEER = 575.77 - (7.01 * age) + (6.60 * height) + (12.14 * weight);
          break;
      case 'Active':
          baseEER = 710.25 - (7.01 * age) + (6.54 * height) + (12.34 * weight);
          break;
      case 'VeryActive':
          baseEER = 511.83 - (7.01 * age) + (9.07 * height) + (12.56 * weight);
          break;
      default:
          throw new Error("Invalid activity level.");
  }

  return Math.round(baseEER + milkProduction); // Adding the energy cost of milk production directly
}

export function calculateCalorieAdjustmentGET(GET: number, desiredweightKg: number): number {
  const adjustedWeightGoalKg = -Math.abs(desiredweightKg);

  const VENTA = (7700 * adjustedWeightGoalKg) / 30; // Calculates VENTA based on 7700 kcal per kg divided by 30 days.

  // The VENTA value is subtracted from the GET for weight loss (negative DesiredweightKg)
  // or added to GET for weight gain (positive DesiredweightKg).
  const GETAadjusted = GET + VENTA; // Adjusts the GET based on the calculated VENTA.

  return Math.round(GETAadjusted);
}

export function calculateWeightGain(weight: number): string {
  const minimumGain = 30 * weight;
  const maximumGain = 35 * weight;
  return `${minimumGain} a ${maximumGain}`;
}

export function calculateWeightLoss(weight: number): string {
  const minimumLoss = 20 * weight;
  const maximumLoss = 25 * weight;
  return `${minimumLoss} a ${maximumLoss}`;
}


export function getNeededFields(equation: string) {
  let fields: string[] = [];

  switch (equation) {
    case 'dRI20230a2yearsTEE':
      fields = ['height', 'weight'];
      break;
    case 'dRI20233a18years':
    case 'dRI202319years':
      fields = ['SelectActivityFactor', 'height', 'weight'];
      break;
    case 'dRI20053a8years':
    case 'eerIom9a18years':
    case 'eer2005adult':
    case 'tenHaaf2014Weight':
    case 'dri200519Obesity':
    case 'mifflinStJeor1990':
    case 'harrisBenedic1919':
    case 'harrisBenedic1984':
      fields = ['height', 'weight', 'selectedPhysicalActivityFactor'];
      break;
    case 'schofield':
    case 'henryERees':
    case 'tinsley2019Weight':
      fields = ['weight', 'selectedPhysicalActivityFactor'];
      break;
    case 'dRI20050a3years':
      fields = ['weight'];
      break;
    case 'cunningham':
    case 'katchMcArdle1996':
    case 'tenHaaf2014LeanMass':
    case 'tinsley2019MuscularWeight':
    case 'horieWaitzbergGonzalez':
      fields = ['muscularWeight', 'selectedPhysicalActivityFactor'];
      break;
    case 'dRI2023Pregnant':
      fields = ['height', 'weight', 'gestation', 'SelectActivityFactor'];
      break;
    case 'pregnancy19anos':
    case 'pregnancy14a19anos':
      fields = ['height', 'weight', 'trimester', 'selectedPhysicalActivityFactor'];
      break;
    case 'dri2023Lactante1Semestre14a19anos':
    case 'dri2023Lactante1Semestre19anos':
    case 'dri2023Lactante2Semestre14a19anos':
    case 'dri2023Lactante2Semestre19anos':
      fields = ['lactationMonth', 'height', 'weight', 'SelectActivityFactor'];
      break;
  }

  return fields;
}