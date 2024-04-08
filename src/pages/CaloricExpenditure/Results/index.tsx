import React, { useState } from 'react';
import { Button, Card, Table } from 'react-bootstrap';
import { calculateCalorieAdjustmentGET, calculateWeightGain, calculateWeightLoss } from '../helpers/MathHelpers';
import { useCaloricExpenditureStore } from '../hooks';
import { isValidNumber } from '../../../helpers/MathHelpers';
import ModalVenta from '../ModalVenta';
import { getGebValues, getTotalGetValue } from '../helpers/stateHelper';

export default function Results() {
  const state = useCaloricExpenditureStore((state) => state);

  const selectedEquation = useCaloricExpenditureStore((state) => state.selectedEquation);

  const weight = useCaloricExpenditureStore((state) => state.weight);
  const desiredweightKg = useCaloricExpenditureStore((state) => state.desiredweightKg);

  const {
    basalEnergyExpenditure,
    basalEnergyExpenditure3a18,
    basalEnergyExpenditure19Years,
    dri20050a3Years,
    dri20053a8Years,
    dri20053a8YearsPa,
    dri20059a18Years,
    dri20059a18YearsPa,
    driAdult,
    driAdultPa,
    schofield1985,
    henryERees,
    cunningham,
    katchMcArdle1996,
    tenHaaf2014LeanMass,
    tenHaaf2014Weight,
    tinsley2019MuscularWeight,
    tinsley2019Weight,
    dRI2023Pregnant,
    pregnancy14a19anos,
    pregnancy14a19anosPa,
    pregnancy19anos,
    pregnancy19anosPa,
    dri200519Obesity,
    dri200519ObesityPa,
    horieWaitzbergGonzalez,
    mifflinStJeor1990,
    harrisBenedic1919,
    harrisBenedic1984,
    dri2023Lactante1Semestre14a19anos,
    dri2023Lactante2Semestre14a19anos,
    dri2023Lactante1Semestre19anos,
    dri2023Lactante2Semestre19anos,
    totalMetskcal,
    paAdult,
  } = getGebValues(state);
  const [showModalVenta, setShowModalVenta] = useState(false);

  const totalGet = getTotalGetValue(state);

  const calorieAjustment = isValidNumber(desiredweightKg) && Number(desiredweightKg) ? calculateCalorieAdjustmentGET(totalGet, Number(desiredweightKg)) : 0;

  const weightGain = isValidNumber(weight) && Number(weight) ? calculateWeightGain(Number(weight)) : 0;
  const weightLoss = isValidNumber(weight) && Number(weight) ? calculateWeightLoss(Number(weight)) : 0;

  return (
    <>
      <Card body className="mb-1">
        <Table striped>
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>
                Gasto ernegético basal <small> (GEB)</small>
              </th>
              <td>
                {selectedEquation === 'dRI20230a2yearsTEE'
                  ? basalEnergyExpenditure + ' kcal'
                  : selectedEquation === 'dRI20233a18years'
                  ? basalEnergyExpenditure3a18 + ' kcal'
                  : selectedEquation === 'dRI202319years'
                  ? basalEnergyExpenditure19Years + ' kcal'
                  : selectedEquation === 'dRI20050a3years'
                  ? dri20050a3Years + ' kcal'
                  : selectedEquation === 'dRI20053a8years'
                  ? dri20053a8Years + ' kcal'
                  : selectedEquation === 'eerIom9a18years'
                  ? dri20059a18Years + ' kcal'
                  : selectedEquation === 'eer2005adult'
                  ? driAdult + ' kcal'
                  : selectedEquation === 'schofield'
                  ? schofield1985 + ' kcal'
                  : selectedEquation === 'henryERees'
                  ? henryERees + ' kcal'
                  : selectedEquation === 'cunningham'
                  ? cunningham + ' kcal'
                  : selectedEquation === 'katchMcArdle1996'
                  ? katchMcArdle1996 + ' kcal'
                  : selectedEquation === 'tenHaaf2014LeanMass'
                  ? tenHaaf2014LeanMass + ' kcal'
                  : selectedEquation === 'tenHaaf2014Weight'
                  ? tenHaaf2014Weight + ' kcal'
                  : selectedEquation === 'tinsley2019MuscularWeight'
                  ? tinsley2019MuscularWeight + ' kcal'
                  : selectedEquation === 'tinsley2019Weight'
                  ? tinsley2019Weight + ' kcal'
                  : selectedEquation === 'dRI2023Pregnant'
                  ? dRI2023Pregnant + ' kcal'
                  : selectedEquation === 'pregnancy14a19anos'
                  ? pregnancy14a19anos + ' kcal'
                  : selectedEquation === 'pregnancy19anos'
                  ? pregnancy19anos + ' kcal'
                  : selectedEquation === 'dri200519Obesity'
                  ? dri200519Obesity + ' kcal'
                  : selectedEquation === 'horieWaitzbergGonzalez'
                  ? horieWaitzbergGonzalez + ' kcal'
                  : selectedEquation === 'mifflinStJeor1990'
                  ? mifflinStJeor1990 + ' kcal'
                  : selectedEquation === 'harrisBenedic1919'
                  ? harrisBenedic1919 + ' kcal'
                  : selectedEquation === 'harrisBenedic1984'
                  ? harrisBenedic1984 + ' kcal'
                  : selectedEquation === 'dri2023Lactante1Semestre14a19anos'
                  ? dri2023Lactante1Semestre14a19anos + ' kcal'
                  : selectedEquation === 'dri2023Lactante1Semestre19anos'
                  ? dri2023Lactante1Semestre19anos + ' kcal'
                  : selectedEquation === 'dri2023Lactante2Semestre14a19anos'
                  ? dri2023Lactante2Semestre14a19anos + ' kcal'
                  : selectedEquation === 'dri2023Lactante2Semestre19anos'
                  ? dri2023Lactante2Semestre19anos + ' kcal'
                  : '--'}
              </td>
            </tr>
            <tr>
              <th>
                Gasto energético total<small> (GET)</small>
              </th>
              <td>
                {selectedEquation === 'dRI20230a2yearsTEE'
                  ? basalEnergyExpenditure + totalMetskcal + ' kcal'
                  : selectedEquation === 'dRI20233a18years'
                  ? basalEnergyExpenditure3a18 + totalMetskcal + ' kcal'
                  : selectedEquation === 'dRI202319years'
                  ? basalEnergyExpenditure19Years + totalMetskcal + ' kcal'
                  : selectedEquation === 'dRI20050a3years'
                  ? dri20050a3Years + totalMetskcal + ' kcal'
                  : selectedEquation === 'dRI20053a8years'
                  ? dri20053a8YearsPa + totalMetskcal + ' kcal'
                  : selectedEquation === 'eerIom9a18years'
                  ? dri20059a18YearsPa + totalMetskcal + ' kcal'
                  : selectedEquation === 'eer2005adult'
                  ? driAdultPa + totalMetskcal + ' kcal'
                  : selectedEquation === 'schofield'
                  ? Math.round(schofield1985 * paAdult) + totalMetskcal + ' kcal'
                  : selectedEquation === 'henryERees'
                  ? henryERees + totalMetskcal + ' kcal'
                  : selectedEquation === 'cunningham'
                  ? Math.round(cunningham * paAdult) + totalMetskcal + ' kcal'
                  : selectedEquation === 'katchMcArdle1996'
                  ? Math.round(katchMcArdle1996 * paAdult) + totalMetskcal + ' kcal'
                  : selectedEquation === 'tenHaaf2014LeanMass'
                  ? Math.round(tenHaaf2014LeanMass * paAdult) + totalMetskcal + ' kcal'
                  : selectedEquation === 'tenHaaf2014Weight'
                  ? Math.round(tenHaaf2014Weight * paAdult) + totalMetskcal + ' kcal'
                  : selectedEquation === 'tinsley2019MuscularWeight'
                  ? Math.round(tinsley2019MuscularWeight * paAdult) + totalMetskcal + ' kcal'
                  : selectedEquation === 'tinsley2019Weight'
                  ? Math.round(tinsley2019Weight * paAdult) + totalMetskcal + ' kcal'
                  : selectedEquation === 'dRI2023Pregnant'
                  ? dRI2023Pregnant + totalMetskcal + ' kcal'
                  : selectedEquation === 'pregnancy14a19anos'
                  ? pregnancy14a19anosPa + totalMetskcal + ' kcal'
                  : selectedEquation === 'pregnancy19anos'
                  ? pregnancy19anosPa + totalMetskcal + ' kcal'
                  : selectedEquation === 'dri200519Obesity'
                  ? dri200519ObesityPa + totalMetskcal + ' kcal'
                  : selectedEquation === 'horieWaitzbergGonzalez'
                  ? Math.round(horieWaitzbergGonzalez * paAdult) + totalMetskcal + ' kcal'
                  : selectedEquation === 'mifflinStJeor1990'
                  ? Math.round(mifflinStJeor1990 * paAdult) + totalMetskcal + ' kcal'
                  : selectedEquation === 'harrisBenedic1919'
                  ? Math.round(harrisBenedic1919 * paAdult) + totalMetskcal + ' kcal'
                  : selectedEquation === 'harrisBenedic1984'
                  ? Math.round(harrisBenedic1984 * paAdult) + totalMetskcal + ' kcal'
                  : selectedEquation === 'dri2023Lactante1Semestre14a19anos'
                  ? dri2023Lactante1Semestre14a19anos + totalMetskcal + ' kcal'
                  : selectedEquation === 'dri2023Lactante1Semestre19anos'
                  ? dri2023Lactante1Semestre19anos + totalMetskcal + ' kcal'
                  : selectedEquation === 'dri2023Lactante2Semestre14a19anos'
                  ? dri2023Lactante2Semestre14a19anos + totalMetskcal + ' kcal'
                  : selectedEquation === 'dri2023Lactante2Semestre19anos'
                  ? dri2023Lactante2Semestre19anos + totalMetskcal + ' kcal'
                  : '--'}
              </td>
            </tr>
          </tbody>
          <ModalVenta showModal={showModalVenta} setShowModal={setShowModalVenta} />
        </Table>
      </Card>
      <Card body className="mb-1">
        <Table striped>
          <thead>
            <tr>
              <th scope="col">Aplicações das equações na composição corporal</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>
                Regra de bolso <small> (perda de peso)</small>
              </th>
              <td>{weightLoss} kcal/dia</td>
            </tr>

            <tr>
              <th>
                Regra de bolso <small> (ganho de peso)</small>
              </th>
              <td>{weightGain} kcal/dia</td>
            </tr>

            <tr>
              <th>
                VENTA
                <Button variant="link" onClick={() => setShowModalVenta(true)}>
                  (Clique para calcular)
                </Button>
              </th>
              <td>{calorieAjustment && totalGet ? calorieAjustment - totalGet : ''} kcal/dia</td>
            </tr>

            <tr>
              <th>
                VENTA <small> aplicado ao GET</small>
              </th>
              <td>{calorieAjustment ? calorieAjustment : ''} kcal/dia</td>
            </tr>
          </tbody>
          <ModalVenta showModal={showModalVenta} setShowModal={setShowModalVenta} />
        </Table>
      </Card>
    </>
  );
}
