import React, { useMemo, useState } from 'react';
import { Badge, Button, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useParametersStore } from '../Parameters/hooks/ParametersStore';
import ModalBodyMassIndexTableInfo from '../../Children5To19Years/Modals/ModalBodyMassIndexTableInfo';
import ModalBodyFatTableInfo from '../../Children5To19Years/Modals/ModalBodyFatTableInfo';
import ModalBodyMuscleTableInfo from '../../Children5To19Years/Modals/ModalBodyMuscleTableInfo';
import {
  BodyCompositionMethod,
  BodyFatPercentageMethod,
  calculateBodyComposition,
  getBodyFatPercentage,
  getRequiredMeasures,
  parameterCalculation,
} from './helpers/BodyDensityEquation';
import {
  calculateBMI,
  calculateResidualWeight,
  calculateboneWeight,
  classifyBMIWithColor,
  classifyBodyFatKg,
  classifyCardiovascularRisk,
  classifyFatPercentage,
  classifyMuscleKg,
  classifyMusclePercentage,
  findIdealFatPercentageRange,
  findIdealMuscleRange,
  getIdealWeight,
  getIdealWeightClassification,
} from './helpers/GeneralEquations';
import { isValidNumber, parseFloatNumber } from '../../../../helpers/MathHelpers';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const [showModalBodyMassIndexTableInfo, setShowModalBodyMassIndexTableInfo] = useState(false);
  const [showModalBodyFatTableInfo, setShowModalBodyFatTableInfo] = useState(false);
  const [showModalBodyMuscleTableInfo, setShowModalBodyMuscleTableInfo] = useState(false);

  const { patientAge, patientIsMale } = useParametersStore((state) => ({
    patientAge: state.patientAge,
    patientIsMale: state.patientIsMale,
    patientId: state.patientId,
  }));

  const { bicipital, tricipital, axilarMedia, suprailiaca, abdominal, subescapular, toracica, coxa, panturrilha } = useParametersStore((state) => ({
    bicipital: state.bicipital,
    tricipital: state.tricipital,
    axilarMedia: state.axilarMedia,
    suprailiaca: state.suprailiaca,
    abdominal: state.abdominal,
    subescapular: state.subescapular,
    toracica: state.toracica,
    coxa: state.coxa,
    panturrilha: state.panturrilha,
  }));

  const selectedBodyDensityEquation = useParametersStore((state) => state.selectedBodyDensityEquation);
  const selectedBodyFatEquation = useParametersStore((state) => state.selectedBodyFatEquation);

  const { weight, height } = useParametersStore((state) => ({
    weight: state.weight,
    height: state.height,
  }));

  const { fist, femur } = useParametersStore((state) => ({
    fist: state.fist,
    femur: state.femur,
  }));

  const { waist, hip } = useParametersStore((state) => ({
    waist: state.waist,
    hip: state.hip,
  }));

  const bodyDensity = useMemo(() => {
    const bodyDensityParams: parameterCalculation = {
      isMale: patientIsMale,
      method: (selectedBodyDensityEquation?.value ?? 'jackson_pollock') as BodyCompositionMethod,
      age: patientAge,
      bi: typeof bicipital === 'number' ? bicipital : 0,
      tr: typeof tricipital === 'number' ? tricipital : 0,
      pt: typeof toracica === 'number' ? toracica : 0,
      ax: typeof axilarMedia === 'number' ? axilarMedia : 0,
      si: typeof suprailiaca === 'number' ? suprailiaca : 0,
      se: typeof subescapular === 'number' ? subescapular : 0,
      ab: typeof abdominal === 'number' ? abdominal : 0,
      cx: typeof coxa === 'number' ? coxa : 0,
      pm: typeof panturrilha === 'number' ? panturrilha : 0,
    };

    const requiredFields = selectedBodyDensityEquation
      ? getRequiredMeasures({
          isMale: patientIsMale,
          method: selectedBodyDensityEquation.value as BodyCompositionMethod,
          age: patientAge,
        })
      : [];

    const equationEnabled = requiredFields.reduce((acc, cur) => {
      if (acc || (typeof bodyDensityParams[cur] === 'number' && (bodyDensityParams[cur] as number) > 0)) return true;

      return acc;
    }, false);

    return selectedBodyDensityEquation && equationEnabled ? calculateBodyComposition(bodyDensityParams) : 0;
  }, [
    abdominal,
    axilarMedia,
    bicipital,
    coxa,
    panturrilha,
    patientAge,
    patientIsMale,
    selectedBodyDensityEquation,
    subescapular,
    suprailiaca,
    toracica,
    tricipital,
  ]);

  const bodyFat =
    selectedBodyFatEquation && selectedBodyDensityEquation?.value && bodyDensity
      ? getBodyFatPercentage(bodyDensity, selectedBodyFatEquation.value as BodyFatPercentageMethod, selectedBodyDensityEquation.value as BodyCompositionMethod)
      : 0;
  const bodyFatKg = isValidNumber(bodyFat) && isValidNumber(weight) ? parseFloatNumber(((weight as number) * bodyFat) / 100) : 0;
  const idealFatPercentageRange = findIdealFatPercentageRange(patientAge, patientIsMale);
  const bodyFatKgClassification = classifyBodyFatKg(idealFatPercentageRange, Number(weight), bodyFatKg);

  const fatFreeDoughKg = isValidNumber(weight) ? Number(weight) - bodyFatKg : 0;
  const fatFreeDoughPercentage = isValidNumber(fatFreeDoughKg) && isValidNumber(weight) ? (Number(fatFreeDoughKg) * 100) / Number(weight) : 0;

  const idealFatMin =
    idealFatPercentageRange && isValidNumber(weight) && Number(weight) ? parseFloatNumber((idealFatPercentageRange.minFat * Number(weight)) / 100) : 0;
  const idealFatMax =
    idealFatPercentageRange && isValidNumber(weight) && Number(weight) ? parseFloatNumber((idealFatPercentageRange.maxFat * Number(weight)) / 100) : 0;

  const bmi = isValidNumber(weight) && isValidNumber(height) ? calculateBMI(weight as number, height as number) : 0;
  const idealBmi = patientAge >= 60 ? '22.0 - 27.0' : '18.5 - 24.9';
  const interpretation = classifyBMIWithColor(bmi);

  const boneWeight =
    isValidNumber(height) && isValidNumber(fist) && isValidNumber(femur) ? calculateboneWeight(height as number, fist as number, femur as number) : 0;

  const residualWeight = isValidNumber(weight) ? calculateResidualWeight(weight as number, patientIsMale) : 0;

  const muscleWeight =
    isValidNumber(weight) && isValidNumber(residualWeight) && isValidNumber(boneWeight)
      ? Number(weight) - Number(residualWeight) - Number(bodyFatKg) - Number(boneWeight)
      : 0;

  const muscleWeightPercentage = isValidNumber(muscleWeight) && isValidNumber(weight) ? (Number(muscleWeight) * 100) / Number(weight) : 0;

  const idealMusclePercentageRange = findIdealMuscleRange(patientAge, patientIsMale);

  const idealMuscleMin =
    idealMusclePercentageRange && isValidNumber(weight) && Number(weight) ? parseFloatNumber((idealMusclePercentageRange.minMuscle * 100) / Number(weight)) : 0;
  const idealMuscleMax =
    idealMusclePercentageRange && isValidNumber(weight) && Number(weight) ? parseFloatNumber((idealMusclePercentageRange.maxMuscle * 100) / Number(weight)) : 0;

  const skinFoldsSum =
    Number(bicipital) +
    Number(tricipital) +
    Number(axilarMedia) +
    Number(suprailiaca) +
    Number(abdominal) +
    Number(subescapular) +
    Number(toracica) +
    Number(coxa) +
    Number(panturrilha);

  const idealWeight = isValidNumber(height) ? getIdealWeight(Number(height)) : 0;
  const idealWeightClassification = getIdealWeightClassification(Number(weight), Number(height));

  const cardiovascularRisk = isValidNumber(waist) && isValidNumber(hip) ? classifyCardiovascularRisk(patientIsMale, Number(waist), Number(hip)) : '';

  const BodyFatClassification = classifyFatPercentage(patientAge, patientIsMale, bodyFat);
  const muscleWeigthPercentageClassification = classifyMusclePercentage(patientAge, patientIsMale, muscleWeightPercentage);
  const muscleWeightClassification = classifyMuscleKg(muscleWeight, { idealMuscleMin, idealMuscleMax });

  return (
    <>
      <Table striped>
        <thead>
          <tr>
            <th scope="col">Parâmetros{id}</th>
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

          <tr>
            <th>
              IMC <small>(OMS, 2006 (kg/m²))</small>
            </th>
            <td>{isValidNumber(bmi) && bmi ? bmi : '--'}</td>
            <td>{isValidNumber(weight) && isValidNumber(height) && Number(weight) && Number(height) ? idealBmi : ''}</td>
            <td>
              {isValidNumber(weight) && isValidNumber(height) && Number(weight) && Number(height) ? (
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

          <tr>
            <th>
              Massa gorda <small>(%)</small>
            </th>
            <td>{isValidNumber(bodyFat) && Number(bodyFat) ? parseFloatNumber(bodyFat) : '--'}</td>
            <td>
              {isValidNumber(bodyFat) && Number(bodyFat)
                ? idealFatPercentageRange
                  ? `${idealFatPercentageRange.minFat} - ${idealFatPercentageRange.maxFat}`
                  : null
                : null}
            </td>
            <td>
              {' '}
              {isValidNumber(bodyFat) && Number(bodyFat) ? (
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

          <tr>
            <th>
              Massa gorda <small>(kg)</small>
            </th>
            <td>{bodyFatKg ? bodyFatKg : '--'}</td>
            <td>{idealFatMin && idealFatMax ? `${idealFatMin} - ${idealFatMax}` : null}</td>
            <td>
              {' '}
              {isValidNumber(weight) && Number(weight) ? (
                <>
                  <Badge bg={bodyFatKgClassification.color} className="text-uppercase">
                    {bodyFatKgClassification ? bodyFatKgClassification.classification : ''}
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

          {fist && femur ? (
            <>
              <tr>
                <th>
                  Massa muscular <small>(%)</small>
                </th>
                <td>{muscleWeightPercentage ? parseFloatNumber(muscleWeightPercentage) : '--'}</td>
                <td>
                  {muscleWeightPercentage
                    ? idealMusclePercentageRange
                      ? `${idealMusclePercentageRange.minMuscle} - ${idealMusclePercentageRange.maxMuscle}`
                      : null
                    : null}
                </td>
                <td>
                  {muscleWeightPercentage ? (
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

              <tr>
                <th>
                  Massa muscular <small>(Kg)</small>
                </th>
                <td>{muscleWeight ? parseFloatNumber(muscleWeight) : '--'}</td>
                <td>{idealMuscleMin && idealMuscleMax ? `${idealMuscleMin} - ${idealMuscleMax}` : null}</td>
                <td>
                  {muscleWeight ? (
                    <>
                      <Badge bg={muscleWeightClassification.color} className="text-uppercase">
                        {muscleWeightClassification ? muscleWeightClassification.classification : ''}
                      </Badge>{' '}
                    </>
                  ) : null}
                </td>
              </tr>

              <tr>
                <th>
                  Peso ósseo (Von Döbeln (1964))<small>(kg)</small>
                </th>
                <td>{isValidNumber(boneWeight) && Number(boneWeight) ? parseFloatNumber(boneWeight) : '--'}</td>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <th>
                  Peso residual (Würch (1973))<small>(kg)</small>
                </th>
                <td>{isValidNumber(residualWeight) && Number(residualWeight) ? parseFloatNumber(residualWeight) : '--'}</td>
                <td></td>
                <td></td>
              </tr>
            </>
          ) : (
            <>
              <tr>
                <th>
                  Massa livre de gordura <small>(%)</small>
                </th>
                <td>
                  {isValidNumber(fatFreeDoughPercentage) && Number(bodyFatKg) && Number(fatFreeDoughPercentage)
                    ? parseFloatNumber(fatFreeDoughPercentage)
                    : '--'}
                </td>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <th>
                  Massa livre de gordura <small>(kg)</small>
                </th>
                <td>{isValidNumber(fatFreeDoughKg) && Number(bodyFatKg) && Number(fatFreeDoughKg) ? parseFloatNumber(fatFreeDoughKg) : '--'}</td>
                <td></td>
                <td></td>
              </tr>
            </>
          )}

          <tr>
            <th>
              Somatória de dobras <small>(mm)</small>
            </th>
            <td>{skinFoldsSum ? parseFloatNumber(skinFoldsSum) : '--'}</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th>
              Densidade corporal <small>(Kg/L)</small>
            </th>
            <td>{isValidNumber(bodyDensity) && Number(bodyDensity) ? parseFloatNumber(bodyDensity) : '--'}</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th>
              Relação cintura-quadril <small>(OMS, 1988)</small>
            </th>
            <td></td>
            <td></td>
            <td>
              {' '}
              {cardiovascularRisk ? (
                <Badge bg="danger" className="text-uppercase">
                  {cardiovascularRisk}
                </Badge>
              ) : (
                '--'
              )}{' '}
            </td>
          </tr>
        </tbody>
      </Table>

      <ModalBodyMassIndexTableInfo showModal={showModalBodyMassIndexTableInfo} setShowModal={setShowModalBodyMassIndexTableInfo} />
      <ModalBodyFatTableInfo showModal={showModalBodyFatTableInfo} setShowModal={setShowModalBodyFatTableInfo} />
      <ModalBodyMuscleTableInfo showModal={showModalBodyMuscleTableInfo} setShowModal={setShowModalBodyMuscleTableInfo} />
    </>
  );
}
