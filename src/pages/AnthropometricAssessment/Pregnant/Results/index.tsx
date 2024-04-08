import React from 'react';
import { Badge, Table } from 'react-bootstrap';
import { useParametersStore } from '../Parameters/hooks';
import { calculateDueDateAndGestationalAge, calculateImc, calculatePregestationalBMIEnhanced, getWeightGainRecommendation } from './helpers/generalHelpers';
import { isValidNumber } from '../../../../helpers/MathHelpers';
import { parseDateToIso } from '../../../../helpers/DateHelper';

export default function Results() {
  const lastMenstruationDate = useParametersStore((state) => state.lastMenstruationDate);
  const data_registro = useParametersStore((state) => state.data_registro);
  // const patientAge = useParametersStore((state) => state.patientAge);
  // const patientIsMale = useParametersStore((state) => state.patientIsMale);
  const height = useParametersStore((state) => state.height);
  const weight = useParametersStore((state) => state.weight);
  const weightPreGestational = useParametersStore((state) => state.weightPreGestational);
  const twinPregnancy = useParametersStore((state) => state.twinPregnancy);

  const duePregnancyDate = calculateDueDateAndGestationalAge(parseDateToIso(lastMenstruationDate));

  const { bmi, expectedWeightGain, category, background } =
    isValidNumber(weightPreGestational) && Number(weightPreGestational) && isValidNumber(height) && Number(height)
      ? calculatePregestationalBMIEnhanced(Number(weightPreGestational), Number(height), twinPregnancy)
      : { bmi: 0, category: '', expectedWeightGain: 0, background: ''};

  const imc = isValidNumber(weight) && isValidNumber(height) ? calculateImc(Number(weight), Number(height)) : 0;

  const weightGainClassification =
    isValidNumber(weightPreGestational) && Number(weightPreGestational) && isValidNumber(height) && Number(height) ? getWeightGainRecommendation(imc) : false;

  return (
    <Table striped>
      <thead>
        <tr>
          <th scope="col">Parâmetros</th>
          <th scope="col">Atual</th>
          <th scope="col">Classificação</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>
            Altura <small>(m)</small>
          </th>
          <td>{isValidNumber(height) && Number(height) ? Number(height) : '--'}</td>
          <td></td>
        </tr>
        <tr>
          <th>
            Peso atual <small>(kg)</small>
          </th>
          <td>{isValidNumber(weight) && Number(weight) ? Number(weight) : '--'}</td>
          <td>
            {' '}
            <Badge bg="success" className="text-uppercase">
              Ideal
            </Badge>{' '}
          </td>
        </tr>

        <tr>
          <th>
            IMC pré-gestacional <small>(kg/m²)</small>
          </th>
          <td>{bmi ? bmi : '--'}</td>
          <td>
            {' '}
            {category ? (
              <Badge bg={background} className="text-uppercase">
                {category}
              </Badge>
            ) : '--'}{' '}
          </td>
        </tr>

        <tr>
          <th>
            IMC atual <small>(kg/m²)</small>
          </th>
          <td>{imc ? imc : '--'}</td>
          <td>
            {' '}
            {weightGainClassification ? (
              <Badge bg={weightGainClassification.background} className="text-uppercase">
                {weightGainClassification.bmiCategory}
              </Badge>
            ) : '--'}{' '}
          </td>
        </tr>

        <tr>
          <th>
            Recomendação de ganho de peso <small>(kg)</small>
          </th>
          <td>{expectedWeightGain ? expectedWeightGain : '--'}</td>
          <td></td>
        </tr>

        <tr>
          <th>Idade gestacional</th>
          <td>{duePregnancyDate && duePregnancyDate.gestationalAge ? duePregnancyDate.gestationalAge : null}</td>
          <td></td>
        </tr>

        <tr>
          <th>Provável data do parto</th>
          <td>{duePregnancyDate && duePregnancyDate.dueDate ? duePregnancyDate.dueDate : null}</td>
          <td></td>
        </tr>
      </tbody>
    </Table>
  );
}
