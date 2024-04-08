import { FrequencyType } from "../hooks/GoalStore/types";

export function calculateFrequencyBetweenDates(startDate: string, endDate: string, frequency: number, frequencyType: FrequencyType): number {
  let inicioParts = startDate.split('-');
  const data_inicio = new Date(Number(inicioParts[0]), Number(inicioParts[1]) - 1, Number(inicioParts[2]));

  let fimParts = endDate.split('-');
  const data_fim = new Date(Number(fimParts[0]), Number(fimParts[1]) - 1, Number(fimParts[2]));

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const differenceInMilliseconds = data_fim.getTime() - data_inicio.getTime();
  let differenceInDays = differenceInMilliseconds / millisecondsPerDay;

  let result = 0;

  switch (frequencyType) {
    case FrequencyType.Daily:
      result = differenceInDays * frequency;
      break;
    case FrequencyType.Weekly:
      result = (differenceInDays / 7) * frequency;
      break;
    case FrequencyType.Monthly:
      result = (differenceInDays / 30.44) * frequency;
      break;
    case FrequencyType.Yearly:
      result = (differenceInDays / 365.25) * frequency;
      break;
    default:
      result = 0;
      break;
  }

  if(frequencyType === FrequencyType.Weekly) {
    console.log('result', result);
  }

  return Math.round(result);
}

export const getPercentage = (done: number, required: number) => {
    return Number(required) ? ((done / required) * 100).toFixed(2) : 0;
}
