import React, { useState } from 'react';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { Badge, Button, Table } from 'react-bootstrap';
import { isValidNumber, parseFloatNumber } from '/src/helpers/MathHelpers';
import {
  classifyBMIWithColor,
  classifyFatPercentage,
  classifyMusclePercentage,
  findIdealFatPercentageRange,
  findIdealMuscleRange,
  getIdealWeight,
  getIdealWeightClassification,
} from './helpers/GeneralEquations';
import { useParametersStore } from '../hooks/ParametersStore';
import ModalBodyMassIndexTableInfoAged from '../modals/ModalBodyMassIndexTableInfoAged';
import ModalBodyFatTableInfo from '../modals/ModalBodyFatTableInfo';
import ModalBodyMuscleTableInfo from '../modals/ModalBodyMuscleTableInfo';

export default function Results() {
  const [showModalBodyMassIndexTableInfo, setShowModalBodyMassIndexTableInfo] = useState(false);
  const [showModalBodyFatTableInfo, setShowModalBodyFatTableInfo] = useState(false);
  const [showModalBodyMuscleTableInfo, setShowModalBodyMuscleTableInfo] = useState(false);

  const { patientAge, patientIsMale } = useParametersStore((state) => ({
    patientAge: state.patientAge,
    patientIsMale: state.patientIsMale,
    patientId: state.patientId,
  }));

  const { weight, height } = useParametersStore((state) => ({
    weight: state.weight,
    height: state.height,
  }));

  const {
    bmi,
    fat_mass,
    body_fat_percentage,
    lean_mass_percentage,
    lean_mass,
    bone_mass,
    residual_mass,
    muscle_mass,
    total_body_water,
    visceral_fat,
    visceral_fat_percentage,
    metabolic_age,
    total_body_water_percentage,
    skeletal_muscle_mass_percentage,
  } = useParametersStore((state) => ({
    bmi: state.bmi,
    fat_mass: state.fat_mass,
    body_fat_percentage: state.body_fat_percentage,
    lean_mass_percentage: state.lean_mass_percentage,
    lean_mass: state.lean_mass,
    bone_mass: state.bone_mass,
    residual_mass: state.residual_mass,
    muscle_mass: state.muscle_mass,
    total_body_water: state.total_body_water,
    visceral_fat: state.visceral_fat,
    visceral_fat_percentage: state.visceral_fat_percentage,
    metabolic_age: state.metabolic_age,
    total_body_water_percentage: state.total_body_water_percentage,
    skeletal_muscle_mass_percentage: state.skeletal_muscle_mass_percentage,
  }));

  const idealWeight = isValidNumber(height) ? getIdealWeight(Number(height)) : 0;
  const idealWeightClassification = getIdealWeightClassification(Number(weight), Number(height));

  const idealBmi = patientAge >= 60 ? '22.0 - 27.0' : '18.5 - 24.9';
  const interpretation = isValidNumber(height) && Number(height) ? classifyBMIWithColor(Number(bmi)) : false;

  const idealFatPercentageRange = findIdealFatPercentageRange(patientAge, patientIsMale);

  const BodyFatClassification = isValidNumber(fat_mass) && Number(fat_mass) ? classifyFatPercentage(patientAge, patientIsMale, Number(fat_mass)) : false;

  const idealMusclePercentageRange = findIdealMuscleRange(patientAge, patientIsMale);
  const muscleWeigthPercentageClassification =
    isValidNumber(lean_mass_percentage) && Number(lean_mass_percentage)
      ? classifyMusclePercentage(patientAge, patientIsMale, Number(lean_mass_percentage))
      : false;
  return (
    <>
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
              Altura <small>(m)</small>
            </th>
            <td>{isValidNumber(height) && Number(height) ? height : '--'}</td>
            <td></td>
            <td></td>
          </tr>

          <tr>
            <th>
              Peso atual <small>(kg)</small>
            </th>
            <td>{isValidNumber(weight) && Number(weight) ? weight : '--'}</td>
            <td></td>
            <td></td>
          </tr>

          {idealWeight ? (
            <tr>
              <th>
                Faixa de peso ideal (Peterson)<small>(kg)</small>
              </th>
              <td></td>
              <td>{idealWeight ? idealWeight : '--'}</td>
              <td>
                {isValidNumber(weight) && isValidNumber(height) && Number(weight) && Number(height) && idealWeightClassification ? (
                  <>
                    <Badge bg={idealWeightClassification.color} className="text-uppercase">
                      {idealWeightClassification ? idealWeightClassification.classification : ''}
                    </Badge>{' '}
                  </>
                ) : null}
              </td>
            </tr>
          ) : null}

          {bmi ? (
            <tr>
              <th>
                IMC <small>(OMS, 2006 (kg/m²))</small>
              </th>
              <td>{isValidNumber(bmi) && bmi ? bmi : '--'}</td>
              <td>{isValidNumber(weight) && isValidNumber(height) && Number(weight) && Number(height) ? idealBmi : ''}</td>
              <td>
                {isValidNumber(bmi) && Number(bmi) && interpretation ? (
                  <>
                    <Badge bg={interpretation.color} className="text-uppercase">
                      {interpretation ? interpretation.classification : ''}
                    </Badge>{' '}
                    <Button
                      variant="foreground"
                      size="sm"
                      className="btn-icon btn-icon-only hover-outline mb-1"
                      onClick={() => setShowModalBodyMassIndexTableInfo(true)}
                    >
                      <CsLineIcons icon="info-hexagon" />
                    </Button>
                  </>
                ) : null}
              </td>
            </tr>
          ) : null}

          {body_fat_percentage ? (
            <tr>
              <th>
                Massa gorda <small>(%)</small>
              </th>
              <td>{isValidNumber(body_fat_percentage) && Number(body_fat_percentage) ? parseFloatNumber(body_fat_percentage) : '--'}</td>
              <td>
                {isValidNumber(body_fat_percentage) && Number(body_fat_percentage)
                  ? idealFatPercentageRange
                    ? `${idealFatPercentageRange.minFat} - ${idealFatPercentageRange.maxFat}`
                    : '--'
                  : '--'}
              </td>
              <td>
                {' '}
                {isValidNumber(body_fat_percentage) && Number(body_fat_percentage) && BodyFatClassification ? (
                  <>
                    <Badge bg={BodyFatClassification.color} className="text-uppercase">
                      {BodyFatClassification ? BodyFatClassification.classification : ''}
                    </Badge>{' '}
                    <Button
                      variant="foreground"
                      size="sm"
                      className="btn-icon btn-icon-only hover-outline mb-1"
                      onClick={() => setShowModalBodyFatTableInfo(true)}
                    >
                      <CsLineIcons icon="info-hexagon" />
                    </Button>
                  </>
                ) : null}
              </td>
            </tr>
          ) : null}

          {fat_mass ? (
            <tr>
              <th>
                Massa gorda <small>(kg)</small>
              </th>
              <td>{fat_mass ? fat_mass : '--'}</td>
              <td></td>
              <td></td>
            </tr>
          ) : null}

          {lean_mass_percentage ? (
            <tr>
              <th>
                Massa Magra <small>(%)</small>
              </th>
              <td>{lean_mass_percentage ? parseFloatNumber(lean_mass_percentage) : '--'}</td>
              <td>
                {lean_mass_percentage
                  ? idealMusclePercentageRange
                    ? `${idealMusclePercentageRange.minMuscle} - ${idealMusclePercentageRange.maxMuscle}`
                    : null
                  : null}
              </td>
              <td>
                {lean_mass_percentage && muscleWeigthPercentageClassification ? (
                  <>
                    <Badge bg={muscleWeigthPercentageClassification.color} className="text-uppercase">
                      {muscleWeigthPercentageClassification ? muscleWeigthPercentageClassification.classification : ''}
                    </Badge>{' '}
                    <Button
                      variant="foreground"
                      size="sm"
                      className="btn-icon btn-icon-only hover-outline mb-1"
                      onClick={() => setShowModalBodyMuscleTableInfo(true)}
                    >
                      <CsLineIcons icon="info-hexagon" />
                    </Button>{' '}
                  </>
                ) : null}
              </td>
            </tr>
          ) : null}

          {lean_mass ? (
            <tr>
              <th>
                Massa Magra <small>(Kg)</small>
              </th>
              <td>{lean_mass ? parseFloatNumber(lean_mass) : '--'}</td>
              <td></td>
              <td></td>
            </tr>
          ) : null}

          {bone_mass ? (
            <tr>
              <th>
                Peso ósseo (Von Döbeln (1964))<small>(kg)</small>
              </th>
              <td>{isValidNumber(bone_mass) && Number(bone_mass) ? parseFloatNumber(bone_mass) : '--'}</td>
              <td></td>
              <td></td>
            </tr>
          ) : null}

          {residual_mass ? (
            <tr>
              <th>
                Peso residual (Würch (1973))<small>(kg)</small>
              </th>
              <td>{isValidNumber(residual_mass) && Number(residual_mass) ? residual_mass : '--'}</td>
              <td></td>
              <td></td>
            </tr>
          ) : null}

          {muscle_mass ? (
            <tr>
              <th>
                Peso Muscular <small>(kg)</small>
              </th>
              <td>{muscle_mass ? parseFloatNumber(muscle_mass) : '--'}</td>
              <td></td>
              <td></td>
            </tr>
          ) : null}

          {total_body_water_percentage ? (
            <tr>
              <th>
                Água corporal <small>(%)</small>
              </th>
              <td>
                {isValidNumber(total_body_water_percentage) && Number(total_body_water_percentage) ? parseFloatNumber(total_body_water_percentage) : '--'}
              </td>
              <td></td>
              <td></td>
            </tr>
          ) : null}

          {visceral_fat ? (
            <tr>
              <th>
                Gordura Visceral <small></small>
              </th>
              <td>{visceral_fat ? parseFloatNumber(visceral_fat) : '--'}</td>
              <td></td>
              <td></td>
            </tr>
          ) : null}

          {visceral_fat_percentage ? (
            <tr>
              <th>
                Gordura Visceral <small>(%)</small>
              </th>
              <td>{visceral_fat_percentage ? parseFloatNumber(visceral_fat_percentage) : '--'}</td>
              <td></td>
              <td></td>
            </tr>
          ) : null}

          {metabolic_age ? (
            <tr>
              <th>
                Idade Metabólica <small></small>
              </th>
              <td>{metabolic_age ? parseFloatNumber(metabolic_age) : '--'}</td>
              <td></td>
              <td></td>
            </tr>
          ) : null}

          {total_body_water ? (
            <tr>
              <th>
                Água corporal <small>(L)</small>
              </th>
              <td>{total_body_water ? parseFloatNumber(total_body_water) : '--'}</td>
              <td></td>
              <td></td>
            </tr>
          ) : null}

          {skeletal_muscle_mass_percentage ? (
            <tr>
              <th>
                Músculo Esquelético <small>(%)</small>
              </th>
              <td>{skeletal_muscle_mass_percentage}</td>
              <td></td>
              <td></td>
            </tr>
          ) : null}
        </tbody>
      </Table>

      <ModalBodyMassIndexTableInfoAged showModal={showModalBodyMassIndexTableInfo} setShowModal={setShowModalBodyMassIndexTableInfo} />
      <ModalBodyFatTableInfo showModal={showModalBodyFatTableInfo} setShowModal={setShowModalBodyFatTableInfo} />
      <ModalBodyMuscleTableInfo showModal={showModalBodyMuscleTableInfo} setShowModal={setShowModalBodyMuscleTableInfo} />
    </>
  );
}
