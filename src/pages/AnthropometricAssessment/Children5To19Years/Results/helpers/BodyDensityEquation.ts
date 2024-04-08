
export type BodyCompositionMethod = '3 Pregas: Protocolo de Jackson & Pollock'|
  '3 Pregas: Protocolo de Guedes' |
  '4 Pregas: Protocolo de Petroski' |
  '7 Pregas: Protocolo de Jackson, Pollock & Ward' |
  '4 Pregas: Protocolo de Durnin & Womersley' |
  '4 Pregas: Protocolo de Faulkner' |
  '2 Pregas: Protocolo de Slaughter et al. 1988';

export type BodyFatPercentageMethod = 'siri' | 'brozek';

export interface parameterCalculation {
  isMale: boolean;
  method: BodyCompositionMethod;
  bi: number;
  age: number;
  tr?: number;
  pt?: number;
  ax?: number;
  si?: number;
  se?: number;
  ab?: number;
  cx?: number;
  pm?: number;
  [key: string]: number | BodyCompositionMethod | boolean | undefined;
}

export const calculateBodyComposition = ({
  sex,
  method,
  age,
  bi = 0,
  tr = 0,
  pt = 0,
  ax = 0,
  si = 0,
  se = 0,
  ab = 0,
  cx = 0,
  pm = 0,
}: parameterCalculation): number => {
  const isMale = sex === 1;
  const sumOfMeasures = pt + ax + tr + se + ab + si + cx;

  let sumPetroski;
  let sumDurnin;

  switch (method) {
    case '3 Pregas: Protocolo de Jackson & Pollock':
      return isMale
        ? 1.1093800 - 0.0008267 * (pt + ab + cx) + 0.0000016 * Math.pow((pt + ab + cx), 2) - 0.0002574 * age
        : 1.0994921 - 0.0009929 * (tr + si + cx) - 0.0000023 * Math.pow((tr + si + cx), 2) - 0.0001392 * age;

    case '3 Pregas: Protocolo de Guedes':
      return isMale
        ? 1.17136 - 0.06706 * Math.log10(ab + tr + si)
        : 1.16650 - 0.07063 * Math.log10(cx + se + si);

    case '4 Pregas: Protocolo de Petroski':
      sumPetroski = isMale ? se + tr + si + pm : ax + si + cx + pm;
      return isMale
        ? 1.10726863 - 0.00081201 * sumPetroski + 0.00000212 * Math.pow(sumPetroski, 2) - 0.00041761 * age
        : 1.19547130 - 0.07513507 * Math.log10(sumPetroski) - 0.00041072 * age;

    case '7 Pregas: Protocolo de Jackson, Pollock & Ward':
      return isMale
        ? 1.112 - 0.00043499 * sumOfMeasures + 0.00000055 * Math.pow(sumOfMeasures, 2) - 0.00028826 * age
        : 1.097 - 0.00046971 * sumOfMeasures + 0.00000056 * Math.pow(sumOfMeasures, 2) - 0.00012828 * age;

    case '4 Pregas: Protocolo de Durnin & Womersley':
      sumDurnin = tr + bi + se + si;
      return 1.1765 - 0.0744 * Math.log10(sumDurnin);

    case '4 Pregas: Protocolo de Faulkner':
      return 5.783 + 0.153 * (tr + se + si + ab);

    case '2 Pregas: Protocolo de Slaughter et al. 1988':
      if (age <= 18) {
        return 0.735 * (tr + pm) + 1;
      } else {
        console.warn('Slaughter só é aplicável para indivíduos com até 18 anos.');
        return 0;
      }

    default:
      return 0;
  }
};

export const getRequiredMeasures = ({
  isMale,
  method,
  age,
}: {
  isMale: boolean,
  method: BodyCompositionMethod,
  age: number,
}): string[] => {
  switch (method) {
    case '3 Pregas: Protocolo de Jackson & Pollock':
      return isMale
        ? ['pt', 'ab', 'cx']
        : ['tr', 'si', 'cx'];

    case '3 Pregas: Protocolo de Guedes':
      return isMale
        ? ['ab', 'tr', 'si']
        : ['cx', 'se', 'si'];

    case '4 Pregas: Protocolo de Petroski':
      return isMale
        ? ['se', 'tr', 'si', 'pm']
        : ['ax', 'si', 'cx', 'pm'];

    case '7 Pregas: Protocolo de Jackson, Pollock & Ward':
      return isMale
        ? ['pt', 'ax', 'tr', 'se', 'ab', 'si', 'cx']
        : ['pt', 'ax', 'tr', 'se', 'ab', 'si', 'cx'];

    case '4 Pregas: Protocolo de Durnin & Womersley':
      return ['tr', 'bi', 'se', 'si'];

    case '4 Pregas: Protocolo de Faulkner':
      return ['tr', 'se', 'si', 'ab'];

    case '2 Pregas: Protocolo de Slaughter et al. 1988':
      if (age <= 18) {
        return ['tr', 'pm'];
      } else {
        console.warn('Slaughter só é aplicável para indivíduos com até 18 anos.');
        return [];
      }

    default:
      return [];
  }
}

export function getBodyFatPercentage(densidadeCorporal: number, method: BodyFatPercentageMethod, selectedBodyDensityEquation?: BodyCompositionMethod): number {
  if (selectedBodyDensityEquation && selectedBodyDensityEquation === '4 Pregas: Protocolo de Faulkner') return densidadeCorporal;
  switch (method) {
    case 'siri':
      return siri(densidadeCorporal);
    case 'brozek':
      return brozek(densidadeCorporal);
    default:
      return 0;
  }
}


export function siri(densidadeCorporal: number): number {
  return ((4.95 / densidadeCorporal) - 4.5) * 100;
}

export function brozek(densidadeCorporal: number): number {
  return ((4.57 / densidadeCorporal) - 4.142) * 100;
}