import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, OverlayTrigger, Tooltip, ProgressBar, CardBody } from 'react-bootstrap';
import ModalPretetion from './modals/modalPretention';
import useClassicPlan from './hooks/useClassicPlan';
import useMacrosStore, { MacrosMode } from './hooks/useMacrosStore';
import { useMacroNutrientsMath } from './principal-meal/utils/MathHelpers';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { parseFloatNumber } from '../../helpers/MathHelpers';

export const getStatus = (pretendido_kcal: number, prescrito_kcal: number, macrossMode: MacrosMode, isLipid?: boolean) => {
  const diferenca = pretendido_kcal - prescrito_kcal;
  const kcalPorGrama = isLipid ? 9 : 4;
  const diferenca_grams = diferenca / kcalPorGrama;
  const toleranciaKcal = pretendido_kcal * 0.05; // 5% de tolerância para kcal
  const toleranciaGrams = (pretendido_kcal * 0.05) / kcalPorGrama; // 5% de tolerância para gramas

  let response: JSX.Element;

  if (macrossMode === 'gramas' && Math.abs(diferenca_grams) <= toleranciaGrams) {
    response = (
      <Badge bg="success" pill>
        <CsLineIcons icon="check-circle" /> Adequado
      </Badge>
    );
  } else if (macrossMode === 'percentage' && Math.abs(diferenca) <= toleranciaKcal) {
    response = (
      <Badge bg="success" pill>
        <CsLineIcons icon="check-circle" /> Adequado
      </Badge>
    );
  } else {
    response = (
      <Badge bg="danger" pill>
        <CsLineIcons icon={diferenca > 0 ? 'trend-up' : 'trend-down'} />
        {Math.abs(macrossMode === 'gramas' ? diferenca_grams : diferenca).toFixed(1)} {macrossMode === 'gramas' ? 'g' : 'kcal'}
      </Badge>
    );
  }

  return response;
};

const CardNutrientAnalisys = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const meals = useClassicPlan((state) => state.meals);
  const vrCalorias = useMacrosStore((state) => state.vrCalorias);
  const vrCarboidratos = useMacrosStore((state) => state.vrCarboidratos);
  const vrProteinas = useMacrosStore((state) => state.vrProteinas);
  const vrLipideos = useMacrosStore((state) => state.vrLipideos);
  const vrPeso = useMacrosStore((state) => state.vrPeso);
  const totalCalories = useClassicPlan((state) => state.totalCalories);

  const carbohydrates = useMacrosStore((state) => state.carbohydrates);
  const proteins = useMacrosStore((state) => state.proteins);
  const lipids = useMacrosStore((state) => state.lipids);

  const ignoreUseEffect = useMacrosStore((state) => state.ignoreUseEffect);
  const macrossMode = useMacrosStore((state) => state.macrossMode);

  const { toggleMacrosMode, setIgnoreUseEffect } = useMacrosStore();
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
      pretendido_gkg: !ignoreUseEffect ? (pretendido_g && vrPeso ? (pretendido_g / Number(vrPeso)).toFixed(2) : '0') : carbohydrates.pretendido_gkg,
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
      pretendido_gkg: !ignoreUseEffect ? (pretendido_g && vrPeso ? (pretendido_g / Number(vrPeso)).toFixed(2) : '0') : proteins.pretendido_gkg,
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
      pretendido_gkg: !ignoreUseEffect ? (pretendido_g && vrPeso ? (pretendido_g / Number(vrPeso)).toFixed(2) : '0') : lipids.pretendido_gkg,
      prescrito_kcal: prescrito_kcal.toFixed(1),
      prescrito_g: prescrito_g.toFixed(2),
      prescrito_gkg: prescrito_g && vrPeso ? (prescrito_g / Number(vrPeso)).toFixed(2) : '0',
      percentage: percentage.toFixed(1),
      porPeso: porPeso.toFixed(1),
      status,
    };
  }, [fat, macrossMode, meals, totalCalories, vrCalorias, vrPeso, vrLipideos]);

  useEffect(() => {
    setCarbohydrates(carbohydrate_);
    ignoreUseEffect &&
      carbohydrate_.pretendido_gkg !== carbohydrates.pretendido_gkg &&
      setTimeout(() => {
        setIgnoreUseEffect(false);
      }, 500);
  }, [carbohydrate_, setCarbohydrates]);

  useEffect(() => {
    setProteins(protein_);
    ignoreUseEffect &&
      protein_.pretendido_gkg !== proteins.pretendido_gkg &&
      setTimeout(() => {
        setIgnoreUseEffect(false);
      }, 100);
  }, [protein_, setProteins]);

  useEffect(() => {
    setLipids(lipid_);
    ignoreUseEffect &&
      lipid_.pretendido_gkg !== lipids.pretendido_gkg &&
      setTimeout(() => {
        setIgnoreUseEffect(false);
      }, 100);
  }, [lipid_, setLipids]);

  return (
    <Container className="ps-5">
      <Row>
        <Col md={11}>
          <Card className="mb-3">
            <CardBody className="p-2">
              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-bin">{parseFloatNumber(caloriesPercentage)}%</Tooltip>}>
                <ProgressBar
                  className="sh-2"
                  now={parseFloatNumber(caloriesPercentage)}
                  label={`${parseFloatNumber(calories_)} de ${parseFloatNumber(vrCalorias)} kcal`}
                />
              </OverlayTrigger>
            </CardBody>
          </Card>
        </Col>

        <Col md={7}>
          <Card>
            <Card.Body className="p-3">
              <Table striped>
                <thead>
                  <tr>
                    <th>
                      Macronutrientes<small> ({macrossMode === 'gramas' ? 'g' : 'kcal'})</small>
                      <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip id="tooltip-cart">Faça a configuração de pretenção de macronutrientes, do plano alimentar.</Tooltip>}
                      >
                        <Button variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button" onClick={handleOpenModal}>
                          <CsLineIcons icon="gear" />
                        </Button>
                      </OverlayTrigger>{' '}
                    </th>
                    <th>Pretendido</th>
                    <th>Prescrito</th>
                    <th>Diferença</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Conteúdo do primeiro card aqui */}
                  <tr>
                    <th>Carboidratos</th>
                    <td>
                      {macrossMode == 'percentage' ? (
                        <>
                          {Number(carbohydrate_.pretendido_kcal)} kcal ({Number(Number(vrCarboidratos).toFixed(1))}%)
                        </>
                      ) : (
                        <>
                          {Number(carbohydrate_.pretendido_g)} g ({Number(Number(carbohydrate_.pretendido_gkg).toFixed(1))} g/kg)
                        </>
                      )}
                    </td>
                    <td>
                      {macrossMode == 'percentage' ? (
                        <>
                          {Number(carbohydrate_.prescrito_kcal)} ({Number(Number(carbohydrate_.percentage).toFixed(1))}%) <small> kcal</small>
                        </>
                      ) : (
                        <>
                          {Number(carbohydrate_.prescrito_g)} g ({Number(Number(carbohydrate_.prescrito_gkg).toFixed(1))} g/kg)
                        </>
                      )}
                    </td>
                    <td>{carbohydrate_.status}</td>
                  </tr>
                  <tr>
                    <th>Proteínas</th>
                    <td>
                      {macrossMode == 'percentage' ? (
                        <>
                          {Number(protein_.pretendido_kcal)} kcal ({Number(Number(vrProteinas).toFixed(1))}%)
                        </>
                      ) : (
                        <>
                          {Number(protein_.pretendido_g)} g ({Number(Number(protein_.pretendido_gkg).toFixed(1))} g/kg)
                        </>
                      )}
                    </td>
                    <td>
                      {macrossMode == 'percentage' ? (
                        <>
                          {Number(protein_.prescrito_kcal)} ({Number(Number(protein_.percentage).toFixed(1))}%) <small> kcal</small>
                        </>
                      ) : (
                        <>
                          {Number(protein_.prescrito_g)} g ({Number(Number(protein_.prescrito_gkg).toFixed(1))} g/kg)
                        </>
                      )}
                    </td>
                    <td>{protein_.status}</td>
                  </tr>
                  <tr>
                    <th>Lipídeos</th>
                    <td>
                      {macrossMode == 'percentage' ? (
                        <>
                          {Number(lipid_.pretendido_kcal)} kcal ({Number(Number(vrLipideos).toFixed(1))}%)
                        </>
                      ) : (
                        <>
                          {Number(lipid_.pretendido_g)} g ({Number(Number(lipid_.pretendido_gkg).toFixed(1))} g/kg)
                        </>
                      )}
                    </td>
                    <td>
                      {macrossMode == 'percentage' ? (
                        <>
                          {Number(lipid_.prescrito_kcal)} ({Number(Number(lipid_.percentage).toFixed(1))}%) <small> kcal</small>
                        </>
                      ) : (
                        <>
                          {Number(lipid_.prescrito_g)} g ({Number(Number(lipid_.prescrito_gkg).toFixed(1))} g/kg)
                        </>
                      )}
                    </td>
                    <td>{lipid_.status}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body className="p-3">
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
                        <>
                          {Number(carbohydrate_.prescrito_g)} g ({Number(carbohydrate_.porPeso)} g/kg)
                        </>
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
                        <>
                          {Number(protein_.prescrito_g)} g ({Number(protein_.porPeso)} g/kg)
                        </>
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
                        <>
                          {Number(lipid_.prescrito_g)} g ({Number(lipid_.porPeso)} g/kg)
                        </>
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

      <ModalPretetion show={showModal} onClose={handleCloseModal} />
    </Container>
  );
};

export default CardNutrientAnalisys;
