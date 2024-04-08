import React from 'react';
import { Alert, Card, Table } from 'react-bootstrap';
import { useParametersStore } from '../Parameters/hooks';
import { isValidNumber } from '../../../../helpers/MathHelpers';
import { calculateImc, calculateWeeklyWeightGainAndDifference, getWeightGainRecommendation } from '../Results/helpers/generalHelpers';

export default function GestationalWeeks() {
  const height = useParametersStore((state) => state.height);
  const weight = useParametersStore((state) => state.weight);
  const weightPreGestational = useParametersStore((state) => state.weightPreGestational);

  const imc = isValidNumber(weight) && isValidNumber(height) ? calculateImc(Number(weight), Number(height)) : 0;

  const { firstTrimesterGain } =
    isValidNumber(weightPreGestational) && Number(weightPreGestational) && isValidNumber(height) && Number(height)
      ? getWeightGainRecommendation(imc)
      : { firstTrimesterGain: 0 };

  const weeks =
    isValidNumber(weightPreGestational) && Number(weightPreGestational) && isValidNumber(height) && Number(height)
      ? calculateWeeklyWeightGainAndDifference(imc, Number(weight))
      : [];

  return (
    <Card body className="mb-5">
      <Alert>
        {' '}
        De acordo com a situação nutricional inicial da gestante (baixo peso, adequado, sobrepeso ou obesidade) há uma faixa de ganho de peso recomendada por
        trimestre. É importante que na primeira consulta a gestante seja informada sobre o peso que deve ganhar. Pacientes com baixo peso devem ganhar 2,3 kg no
        primeiro trimestre e 0,5 kg/semana nos segundo e terceiro trimestre. Da mesma forma, gestantes com IMC adequado devem ganhar 1,6 kg no primeiro
        trimestre e 0,4 kg/semana nos segundo e terceiro trimestres. Gestantes com sobrepeso devem ganhar até 0,9 kg no primeiro trimestre e gestantes obesas
        não necessitam ganhar peso no primeiro trimestre. Já no segundo e terceiro trimestre as gestantes com sobrepeso e obesas devem ganhar até 0,3 kg/semana
        e 0,2 kg/semana, respectivamente.
      </Alert>
      <Table striped>
        <thead>
          <tr>
            <th scope="col">Semana gestacional</th>
            <th scope="col">Peso Recomendado</th>
            <th scope="col">Diferença de peso</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>1ª a 12 Semana Gestacional</th>
            <td>
              {isValidNumber(weightPreGestational) ? weightPreGestational : 0} a {firstTrimesterGain + (isValidNumber(weightPreGestational) ? Number(weightPreGestational) : 0)}
            </td>
            <td>...</td>
          </tr>
          {weeks.map((week) => (
            <tr key={week.week}>
              <th>{week.week}ª Semana Gestacional</th>
              <td>
                {week.totalRecommendedWeight}kg
              </td>
              <td>{week.difference}kg {week.differenceDescription}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
