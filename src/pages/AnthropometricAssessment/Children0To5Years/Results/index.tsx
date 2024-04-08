import React, { useMemo } from 'react';
import { Badge, Table } from 'react-bootstrap';
import { useParametersStore } from '../Parameters/hooks';
import { calculateBMI, getIdealHeigth, getIdealClassification, getIdealImc, getIdealWeight } from './helpers/GeneralEquations';
import { isValidNumber, parseFloatNumber } from '../../../../helpers/MathHelpers';

export default function Results() {
  const patientAge = useParametersStore((state) => state.patientAge);
  const patientIsMale = useParametersStore((state) => state.patientIsMale);
  const height = useParametersStore((state) => state.height);
  const weight = useParametersStore((state) => state.weight);

  const imc = useMemo(() => {
    const bmi = isValidNumber(weight) && isValidNumber(height) && Number(weight) && Number(height) ? calculateBMI(Number(weight), Number(height)) : 0;

    return bmi < 999 ? bmi : 999;
  }, [height, weight]);

  const idealHeigth = getIdealHeigth(patientAge, patientIsMale);
  const idealWeight = getIdealWeight(patientAge, patientIsMale);
  const idealImc = getIdealImc(patientAge, patientIsMale);

  const idealHeigthClassification = isValidNumber(height) && Number(height) ? getIdealClassification(Number(height), idealHeigth) : '';
  const idealWeightClassification = isValidNumber(weight) && Number(weight) ? getIdealClassification(Number(weight), idealWeight) : '';
  const idealImcClassification = isValidNumber(imc) && Number(imc) ? getIdealClassification(Number(imc), idealImc) : '';

  return (
    <Table striped>
      <thead>
        <tr>
          <th scope="col">Parâmetros</th>
          <th scope="col">Atual</th>
          <th scope="col">Recomendado</th>
          <th scope="col">Classificação</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>
            Estatura para Idade <small>(m)</small>
          </th>
          <td>{isValidNumber(height) && Number(height) ? parseFloatNumber(height) : '--'}</td>
          <td>{isValidNumber(idealHeigth) && Number(idealHeigth) ? parseFloatNumber(idealHeigth) : '--'}</td>
          <td>
            {' '}
            {idealHeigthClassification ? (
              <Badge bg={idealHeigthClassification.color} className="text-uppercase">
                {idealHeigthClassification.classification}
              </Badge>
            ) : null}{' '}
          </td>
        </tr>
        <tr>
          <th>
            Peso para Idade <small>(kg)</small>
          </th>
          <td>{isValidNumber(weight) && Number(weight) ? parseFloatNumber(weight) : '--'}</td>
          <td>{isValidNumber(idealWeight) && Number(idealWeight) ? parseFloatNumber(idealWeight) : '--'}</td>
          <td>
            {' '}
            {idealWeightClassification ? (
              <Badge bg={idealWeightClassification.color} className="text-uppercase">
                {idealWeightClassification.classification}
              </Badge>
            ) : null}{' '}
          </td>
        </tr>

        <tr>
          <th>
            IMC (OMS, 2006 ) <small>(kg/m²)</small>
          </th>
          <td>{isValidNumber(imc) && Number(imc) ? parseFloatNumber(imc) : '--'}</td>
          <td>{isValidNumber(idealImc) && Number(idealImc) ? parseFloatNumber(idealImc) : '--'}</td>
          <td>
            {' '}
            {idealImcClassification ? (
              <Badge bg={idealImcClassification.color} className="text-uppercase">
                {idealImcClassification.classification}
              </Badge>
            ) : null}{' '}
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
