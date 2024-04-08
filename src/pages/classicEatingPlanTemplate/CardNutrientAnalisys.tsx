import React, { useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, OverlayTrigger, Tooltip, ProgressBar } from 'react-bootstrap';
import useClassicPlan from './hooks/useClassicPlan';
import useMacrosStore from './hooks/useMacrosStore';
import { useMacroNutrientsMath } from './principal-meal/utils/MathHelpers';
import { getStatus } from '../ClassicEatingPlan/CardNutrientAnalisys';
import { parseFloatNumber } from '../../helpers/MathHelpers';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';

const CardNutrientAnalisys = () => {
  const meals = useClassicPlan((state) => state.meals);
  const vrCalorias = useMacrosStore((state) => state.vrCalorias);
  const vrCarboidratos = useMacrosStore((state) => state.vrCarboidratos);
  const vrProteinas = useMacrosStore((state) => state.vrProteinas);
  const vrLipideos = useMacrosStore((state) => state.vrLipideos);
  const vrPeso = useMacrosStore((state) => state.vrPeso);
  const totalCalories = useClassicPlan((state) => state.totalCalories);

  const macrossMode = useMacrosStore((state) => state.macrossMode);

  const { toggleMacrosMode } = useMacrosStore();
  const { setCarbohydrates, setProteins, setLipids } = useMacrosStore();
  const { carbohydrate, fat, protein, calories } = useMacroNutrientsMath();

  const calories_ = useMemo(() => {
    const total = meals.reduce((acc, meal) => {
      if (meal.calculavel == 1) {
        acc += calories(meal.alimentos);
      }
      return acc;
    }, 0);

    return total;
  }, [calories, meals]);

  const caloriesPercentage = useMemo(() => {
    return (calories_ / Number(vrCalorias)) * 100;
  }, [calories_, vrCalorias]);

  const carbohydrate_ = useMemo(() => {
    const total = meals.reduce((acc, meal) => {
      if (meal.calculavel == 1) {
        acc += carbohydrate(meal.alimentos);
      }
      return acc;
    }, 0);

    const pretendido_kcal = (Number(vrCalorias) / 100) * Number(vrCarboidratos);
    const pretendido_g = ((Number(vrCalorias) / 100) * Number(vrCarboidratos)) / 4;

    const prescrito_kcal = total * 4;
    const prescrito_g = total;
    const percentage = total && totalCalories ? (total / totalCalories) * 100 : 0;
    const status = getStatus(pretendido_kcal, prescrito_kcal, macrossMode);

    const porPeso = Number(vrPeso) && total ? total / Number(vrPeso) : 0;

    return {
      pretendido_kcal: pretendido_kcal.toFixed(1),
      pretendido_g: pretendido_g.toFixed(1),
      pretendido_gkg: pretendido_g && vrPeso ? (pretendido_g / Number(vrPeso)).toFixed(2) : '0',
      prescrito_kcal: prescrito_kcal.toFixed(1),
      prescrito_g: prescrito_g.toFixed(2),
      prescrito_gkg: prescrito_g && vrPeso ? (prescrito_g / Number(vrPeso)).toFixed(2) : '0',
      percentage: percentage.toFixed(1),
      porPeso: porPeso.toFixed(1),
      status,
    };
  }, [carbohydrate, macrossMode, meals, totalCalories, vrCalorias, vrCarboidratos, vrPeso]);

  const protein_ = useMemo(() => {
    const total = meals.reduce((acc, meal) => {
      if (meal.calculavel == 1) {
        acc += protein(meal.alimentos);
      }
      return acc;
    }, 0);

    const pretendido_kcal = (Number(vrCalorias) / 100) * Number(vrProteinas);
    const pretendido_g = ((Number(vrCalorias) / 100) * Number(vrProteinas)) / 4;

    const prescrito_kcal = total * 4;
    const prescrito_g = total;

    const percentage = total && totalCalories ? (total / totalCalories) * 100 : 0;

    const status = getStatus(pretendido_kcal, prescrito_kcal, macrossMode);

    const porPeso = Number(vrPeso) && total ? total / Number(vrPeso) : 0;

    return {
      pretendido_kcal: pretendido_kcal.toFixed(1),
      pretendido_g: pretendido_g.toFixed(1),
      pretendido_gkg: pretendido_g && vrPeso ? (pretendido_g / Number(vrPeso)).toFixed(2) : '0',
      prescrito_kcal: prescrito_kcal.toFixed(1),
      prescrito_g: prescrito_g.toFixed(2),
      prescrito_gkg: prescrito_g && vrPeso ? (prescrito_g / Number(vrPeso)).toFixed(2) : '0',
      percentage: percentage.toFixed(1),
      porPeso: porPeso.toFixed(1),
      status,
    };
  }, [macrossMode, meals, protein, totalCalories, vrCalorias, vrPeso, vrProteinas]);

  const lipid_ = useMemo(() => {
    const total = meals.reduce((acc, meal) => {
      if (meal.calculavel == 1) {
        acc += fat(meal.alimentos);
      }
      return acc;
    }, 0);

    const pretendido_kcal = (Number(vrCalorias) / 100) * Number(vrLipideos);
    const pretendido_g = ((Number(vrCalorias) / 100) * Number(vrLipideos)) / 9;

    const prescrito_kcal = total * 9;
    const prescrito_g = total;

    const percentage = total && totalCalories ? (total / totalCalories) * 100 : 0;

    const porPeso = Number(vrPeso) && total ? total / Number(vrPeso) : 0;

    const status = getStatus(pretendido_kcal, prescrito_kcal, macrossMode, true);

    return {
      pretendido_kcal: pretendido_kcal.toFixed(1),
      pretendido_g: pretendido_g.toFixed(1),
      pretendido_gkg: pretendido_g && vrPeso ? (pretendido_g / Number(vrPeso)).toFixed(2) : '0',
      prescrito_kcal: prescrito_kcal.toFixed(1),
      prescrito_g: prescrito_g.toFixed(2),
      prescrito_gkg: prescrito_g && vrPeso ? (prescrito_g / Number(vrPeso)).toFixed(2) : '0',
      percentage: percentage.toFixed(1),
      porPeso: porPeso.toFixed(1),
      status,
    };
  }, [fat, macrossMode, meals, totalCalories, vrCalorias, vrLipideos, vrPeso]);

  useEffect(() => {
    setCarbohydrates(carbohydrate_);
  }, [carbohydrate_, setCarbohydrates]);

  useEffect(() => {
    setProteins(protein_);
  }, [protein_, setProteins]);

  useEffect(() => {
    setLipids(lipid_);
  }, [lipid_, setLipids]);

  return (
    <Container className="ps-5">
      <Row>
        <Col md={12}>
          <Card className="mb-3">
            <Card.Body className="p-2">
              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-bin">{parseFloatNumber(caloriesPercentage)}%</Tooltip>}>
                <ProgressBar
                  className="sh-2"
                  now={parseFloatNumber(caloriesPercentage)}
                  label={`${parseFloatNumber(calories_)} de ${parseFloatNumber(vrCalorias)} kcal`}
                />
              </OverlayTrigger>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8} className="mb-1">
          <Card className="mb-5">
            <Card.Body>
              <Table striped>
                <thead>
                  <tr>
                    <th>
                      Macronutrientes<small> ({macrossMode === 'gramas' ? 'g' : 'kcal'})</small>
                    </th>
                    <th>Prescrito</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Conteúdo do primeiro card aqui */}
                  <tr>
                    <th>Carboidratos</th>
                    <td>
                      {macrossMode == 'percentage' ? (
                        <>
                          {Number(carbohydrate_.prescrito_kcal)} kcal ({Number(Number(vrCarboidratos).toFixed(1))}%)
                        </>
                      ) : (
                        <>{Number(carbohydrate_.prescrito_g)} g</>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Proteínas</th>
                    <td>
                      {macrossMode == 'percentage' ? (
                        <>
                          {Number(protein_.prescrito_kcal)} kcal ({Number(Number(vrProteinas).toFixed(1))}%)
                        </>
                      ) : (
                        <>{Number(protein_.prescrito_g)} g</>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Lipídeos</th>
                    <td>
                      {macrossMode == 'percentage' ? (
                        <>
                          {Number(lipid_.prescrito_kcal)} kcal ({Number(Number(vrLipideos).toFixed(1))}%)
                        </>
                      ) : (
                        <>{Number(lipid_.prescrito_g)} g</>
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-1">
          <Card className="mb-5">
            <Card.Body>
              <Table striped>
                <thead>
                  <tr>
                    <th colSpan={2}>
                      Macronutrientes{' '}
                      <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-cart">Altere o modo de visualização</Tooltip>}>
                        <Button onClick={toggleMacrosMode} variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button">
                          <CsLineIcons icon="sync-horizontal" />
                        </Button>
                      </OverlayTrigger>{' '}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Conteúdo do segundo card aqui */}
                  <tr>
                    <th>Carboidratos</th>
                    <td>
                      {macrossMode == 'percentage' ? (
                        <>{Number(carbohydrate_.prescrito_g)} g</>
                      ) : (
                        <>
                          {Number(carbohydrate_.prescrito_kcal)} ({Number(carbohydrate_.percentage)} %) kcal
                        </>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Proteínas</th>
                    <td>
                      {macrossMode == 'percentage' ? (
                        <>{Number(protein_.prescrito_g)} g</>
                      ) : (
                        <>
                          {Number(protein_.prescrito_kcal)} ({Number(protein_.percentage)} %) kcal
                        </>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Lipídeos</th>
                    <td>
                      {macrossMode == 'percentage' ? (
                        <>{Number(lipid_.prescrito_g)} g</>
                      ) : (
                        <>
                          {Number(lipid_.prescrito_kcal)} ({Number(lipid_.percentage)} %) kcal
                        </>
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CardNutrientAnalisys;
