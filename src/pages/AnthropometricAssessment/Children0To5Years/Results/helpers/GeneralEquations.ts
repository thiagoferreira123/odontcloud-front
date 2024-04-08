import { parseFloatNumber } from "../../../../../helpers/MathHelpers";

export function calculateBMI(weight: number, height: number): number {
  const bmi = weight / Math.pow(height / 100, 2);
  return parseFloatNumber(bmi);
}


// Função para encontrar o valor de P50 com base no mês e sexo
export function getIdealHeigth(month: number | string, patientIsMale: number | boolean): number {
  const months = ['24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'];
  const P50DataFEM = [85.7, 86.6, 87.4, 88.3, 89.1, 89.9, 90.7, 91.4, 92.2, 92.9, 93.6, 94.4, 95.1, 95.7, 96.4, 97.1, 97.7, 98.4, 99.0, 99.7, 100.3, 100.9, 101.5, 102.1, 102.7, 103.3, 103.9, 104.5, 105.0, 105.6, 106.2, 106.7, 107.3, 107.8, 108.4, 108.9, 109.4];
  const P50DataMAS = [87.1, 88, 88.8, 89.6, 90.4, 91.2, 91.9, 92.7, 93.4, 94.1, 94.8, 95.4, 96.1, 96.7, 97.4, 98, 98.6, 99.2, 99.9, 100.4, 101, 101.6, 102.2, 102.8, 103.3, 103.9, 104.4, 105, 105.6, 106.1, 106.7, 107.2, 107.8, 108.3, 108.9, 109.4, 110];

  const data = !patientIsMale ? P50DataFEM : P50DataMAS;
  const index = months.indexOf(String(month));

  if (index === -1) {
    return 0;
  }

  return data[index];
}


// Função para encontrar o valor de P50 com base no mês e sexo
export function getIdealWeight(month: number | string, patientIsMale: number | boolean): number {
  const months = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'];
  const P50DataFEM = [3.2, 4.2, 5.1, 5.8, 6.4, 6.9, 7.3, 7.6, 7.9, 8.2, 8.5, 8.7, 8.9, 9.2, 9.4, 9.6, 9.8, 10, 10.2, 10.4, 10.6, 10.9, 11.1, 11.3, 11.5, 11.7, 11.9, 12.1, 12.3, 12.5, 12.7, 12.9, 13.1, 13.3, 13.5, 13.7, 13.9, 14, 14.2, 14.4, 14.6, 14.8, 15, 15.2, 15.3, 15.5, 15.7, 15.9, 16.1, 16.3, 16.4, 16.6, 16.8, 17, 17.2, 17.3, 17.5, 17.7, 17.9, 18, 18.2];
  const P50DataMAS = [3.3, 4.5, 5.6, 6.4, 7, 7.5, 7.9, 8.3, 8.6, 8.9, 9.2, 9.4, 9.6, 9.9, 10.1, 10.3, 10.5, 10.7, 10.9, 11.1, 11.3, 11.5, 11.8, 12, 12.2, 12.4, 12.5, 12.7, 12.9, 13.1, 13.3, 13.5, 13.7, 13.8, 14, 14.2, 14.3, 14.5, 14.7, 14.8, 15, 15.2, 15.3, 15.5, 15.7, 15.8, 16, 16.2, 16.3, 16.5, 16.7, 16.8, 17, 17.2, 17.3, 17.5, 17.7, 17.8, 18, 18.2, 18.3];

  const data = !patientIsMale ? P50DataFEM : P50DataMAS;
  const index = months.indexOf(String(month));

  if (index === -1) {
    return 0;
  }

  return data[index];
}


// Função para encontrar o valor de P50 com base no mês e sexo
export function getIdealImc(month: number | string, patientIsMale: number | boolean): number {
  const months = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'];
  const P50DataFEM = [13.3, 14.6, 15.8, 16.4, 16.7, 16.8, 16.9, 16.9, 16.8, 16.7, 16.6, 16.5, 16.4, 16.2, 16.1, 16.0, 15.9, 15.8, 15.7, 15.7, 15.6, 15.5, 15.5, 15.4, 15.4, 15.7, 15.7, 15.6, 15.6, 15.6, 15.6, 15.5, 15.5, 15.5, 15.5, 15.4, 15.4, 15.4, 15.4, 15.4, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.2, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3];
  const P50DataMAS = [13.4, 14.9, 16.3, 16.9, 17.2, 17.3, 17.3, 17.3, 17.3, 17.2, 17.0, 16.9, 16.8, 16.7, 16.6, 16.4, 16.3, 16.2, 16.1, 16.1, 16.0, 15.9, 15.8, 15.8, 15.7, 16.0, 16.0, 15.9, 15.9, 15.9, 15.8, 15.8, 15.8, 15.7, 15.7, 15.7, 15.6, 15.6, 15.6, 15.5, 15.5, 15.5, 15.5, 15.4, 15.4, 15.4, 15.4, 15.4, 15.4, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.2];

  const data = !patientIsMale ? P50DataFEM : P50DataMAS;
  const index = months.indexOf(String(month));

  if (index === -1) {
    return 0;
  }

  return data[index];
}

export function getIdealClassification(height: number, idealHeight: number) {
  if (Number(height) < Math.floor(idealHeight)) return { classification: 'Abaixo ideal', color: 'warning' };
  if (Number(height) >= Math.floor(idealHeight) && Number(height) <= Math.ceil(idealHeight)) return { classification: 'Ideal', color: 'success' };
  if (Number(height) > Math.ceil(idealHeight)) return { classification: 'Acima ideal', color: 'warning' };
}