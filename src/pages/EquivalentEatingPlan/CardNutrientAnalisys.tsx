import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, OverlayTrigger, Tooltip, Badge, ProgressBar } from 'react-bootstrap';
import useMacrosStore from './hooks/useMacrosStore';
import * as MathHelpers from './meal/utils/MathHelpers';
import { useEquivalentEatingPlanStore } from './hooks/equivalentEatingPlanStore';
import ModalPretetion from './modals/ModalPretention';
import { Overlay } from 'react-bootstrap';
import { parseFloatNumber } from '../../helpers/MathHelpers';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { getStatus } from '../ClassicEatingPlan/CardNutrientAnalisys';

const CardNutrientAnalisys = () => {
  const [showModal, setShowModal] = useState(false);
  const [showOverLayModalPretention, setShowOverLayModalPretention] = useState(false);

  const openModalPretentionTrigger = useRef(null);

  const { setCarbohydrates, setProteins, setLipids } = useMacrosStore();

  const handleOpenModal = () => {
    setShowOverLayModalPretention(true);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const meals = useEquivalentEatingPlanStore((state) => state.meals);
  const vrCalorias = useMacrosStore((state) => state.vrCalorias);
  const vrCarboidratos = useMacrosStore((state) => state.vrCarboidratos);
  const vrProteinas = useMacrosStore((state) => state.vrProteinas);
  const vrLipideos = useMacrosStore((state) => state.vrLipideos);
  const vrPeso = useMacrosStore((state) => state.vrPeso);

  const carbohydrates = useMacrosStore((state) => state.carbohydrates);
  const proteins = useMacrosStore((state) => state.proteins);
  const lipids = useMacrosStore((state) => state.lipids);

  const ignoreUseEffect = useMacrosStore((state) => state.ignoreUseEffect);
  const macrossMode = useMacrosStore((state) => state.macrossMode);

  const { toggleMacrosMode, setIgnoreUseEffect } = useMacrosStore();

  const calories = useMemo(() => {
    const total = meals.reduce((acc, meal) => {
      if (meal.calculavel == 1) {
        acc += (MathHelpers.carbohydrate(meal.alimentos) * 4) + (MathHelpers.protein(meal.alimentos) * 4) + (MathHelpers.fat(meal.alimentos) * 9);
      }
      return acc;
    }, 0);

    return total;
  }, [meals]);

  const caloriesPercentage = useMemo(() => {
    return (calories / Number(vrCalorias)) * 100;
  }, [calories, vrCalorias]);

  const carbohydrate = useMemo(() => {
    const total = meals.reduce((acc, meal) => {
      if (meal.calculavel == 1) {
        acc += MathHelpers.carbohydrate(meal.alimentos);
      }
      return acc;
    }, 0);

    const pretendido_kcal = (Number(vrCalorias) / 100) * Number(vrCarboidratos);
    const pretendido_g = ((Number(vrCalorias) / 100) * Number(vrCarboidratos)) / 4;

    const prescrito_kcal = total * 4;
    const prescrito_g = total;
    const percentage = prescrito_kcal && calories ? (prescrito_kcal / calories) * 100 : 0;
    const status = getStatus(pretendido_kcal, prescrito_kcal, macrossMode);

    const porPeso = Number(vrPeso) && total ? total / Number(vrPeso) : 0;

    return {
      pretendido_kcal: pretendido_kcal.toFixed(1),
      pretendido_g: pretendido_g.toFixed(1),
      pretendido_gkg: !ignoreUseEffect ? (pretendido_g && vrPeso ? (pretendido_g / Number(vrPeso)).toFixed(2) : '0') : carbohydrates.pretendido_gkg,
      prescrito_kcal: prescrito_kcal.toFixed(1),
      prescrito_g: prescrito_g.toFixed(1),
      prescrito_gkg: porPeso.toFixed(1),
      percentage: percentage.toFixed(1),
      porPeso: porPeso.toFixed(1),
      status,
    };
  }, [macrossMode, meals, calories, vrCalorias, vrCarboidratos, vrPeso]);

  const protein = useMemo(() => {
    const total = meals.reduce((acc, meal) => {
      if (meal.calculavel == 1) {
        acc += MathHelpers.protein(meal.alimentos);
      }
      return acc;
    }, 0);

    const pretendido_kcal = (Number(vrCalorias) / 100) * Number(vrProteinas);
    const pretendido_g = ((Number(vrCalorias) / 100) * Number(vrProteinas)) / 4;

    const prescrito_kcal = total * 4;
    const prescrito_g = total;

    const percentage = prescrito_kcal && calories ? (prescrito_kcal / calories) * 100 : 0;

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
  }, [macrossMode, meals, calories, vrCalorias, vrPeso, vrProteinas]);

  const lipid = useMemo(() => {
    const total = meals.reduce((acc, meal) => {
      if (meal.calculavel == 1) {
        acc += MathHelpers.fat(meal.alimentos);
      }
      return acc;
    }, 0);

    const pretendido_kcal = (Number(vrCalorias) / 100) * Number(vrLipideos);
    const pretendido_g = ((Number(vrCalorias) / 100) * Number(vrLipideos)) / 9;

    const prescrito_kcal = total * 9;
    const prescrito_g = total;

    const percentage = prescrito_kcal && calories ? (prescrito_kcal / calories) * 100 : 0;

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
  }, [macrossMode, meals, calories, vrCalorias, vrLipideos, vrPeso]);

  useEffect(() => {
    setCarbohydrates(carbohydrate);
    setTimeout(() => {
      setIgnoreUseEffect(false);
    }, 100);
  }, [carbohydrate, setCarbohydrates]);

  useEffect(() => {
    setProteins(protein);
    setTimeout(() => {
      setIgnoreUseEffect(false);
    }, 100);
  }, [protein, setProteins]);

  useEffect(() => {
    setLipids(lipid);
    setTimeout(() => {
      setIgnoreUseEffect(false);
    }, 100);
  }, [lipid, setLipids]);

  return (
    <Container>
      <Row>
        <Col md={11}>
          <Card className="mb-3">
            <Card.Body className="p-2">
              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-bin">{parseFloatNumber(caloriesPercentage)}%</Tooltip>}>
                <ProgressBar
                  className="sh-2"
                  now={parseFloatNumber(caloriesPercentage)}
                  label={`${parseFloatNumber(calories)} de ${parseFloatNumber(vrCalorias)} kcal`}
                />
              </OverlayTrigger>
            </Card.Body>
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
                      <Button
                        variant="primary"
                        size="sm"
                        className="btn-icon btn-icon-only mb-1 ms-1"
                        type="button"
                        onClick={handleOpenModal}
                        onMouseOver={() => setShowOverLayModalPretention(true)}
                        onMouseLeave={() => setShowOverLayModalPretention(false)}
                        ref={openModalPretentionTrigger}
                      >
                        <CsLineIcons icon="gear" />
                      </Button>
                      <Overlay target={openModalPretentionTrigger.current} show={showOverLayModalPretention} placement="bottom">
                        {(props) => (
                          <Tooltip id="tooltip-cart" {...props}>
                            Faça a configuração de pretenção de macronutrientes, do plano alimentar.
                          </Tooltip>
                        )}
                      </Overlay>{' '}
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
                          {parseFloatNumber(carbohydrate.pretendido_kcal)} kcal ({parseFloatNumber(vrCarboidratos)}%)
                        </>
                      ) : (
                        <>
                          {parseFloatNumber(carbohydrate.pretendido_g)} g ({parseFloatNumber(carbohydrate.pretendido_gkg)} g/kg)
                        </>
                      )}
                    </td>
                    <td>
                      {macrossMode == 'percentage' ? (
                        <>
                          {parseFloatNumber(carbohydrate.prescrito_kcal)} kcal ({parseFloatNumber(carbohydrate.percentage)}%)
                        </>
                      ) : (
                        <>
                          {parseFloatNumber(carbohydrate.prescrito_g)} g ({parseFloatNumber(carbohydrate.prescrito_gkg)} g/kg)
                        </>
                      )}
                    </td>
                    <td>{carbohydrate.status}</td>
                  </tr>
                  <tr>
                    <th>Proteínas</th>
                    <td>
                      {macrossMode == 'percentage' ? (
                        <>
                          {parseFloatNumber(protein.pretendido_kcal)} kcal ({parseFloatNumber(vrProteinas)}%)
                        </>
                      ) : (
                        <>
                          {parseFloatNumber(protein.pretendido_g)} g ({parseFloatNumber(protein.pretendido_gkg)} g/kg)
                        </>
                      )}
                    </td>
                    <td>
                      {macrossMode == 'percentage' ? (
                        <>
                          {parseFloatNumber(protein.prescrito_kcal)} kcal ({parseFloatNumber(protein.percentage)}%)
                        </>
                      ) : (
                        <>
                          {parseFloatNumber(protein.prescrito_g)} g ({parseFloatNumber(protein.prescrito_gkg)} g/kg)
                        </>
                      )}
                    </td>
                    <td>{protein.status}</td>
                  </tr>
                  <tr>
                    <th>Lipídeos</th>
                    <td>
                      {macrossMode == 'percentage' ? (
                        <>
                          {parseFloatNumber(lipid.pretendido_kcal)} kcal ({parseFloatNumber(vrLipideos)}%)
                        </>
                      ) : (
                        <>
                          {parseFloatNumber(lipid.pretendido_g)} g ({parseFloatNumber(lipid.pretendido_gkg)} g/kg)
                        </>
                      )}
                    </td>
                    <td>
                      {macrossMode == 'percentage' ? (
                        <>
                          {parseFloatNumber(lipid.prescrito_kcal)} kcal ({parseFloatNumber(lipid.percentage)}%)
                        </>
                      ) : (
                        <>
                          {parseFloatNumber(lipid.prescrito_g)} g ({parseFloatNumber(lipid.prescrito_gkg)} g/kg)
                        </>
                      )}
                    </td>
                    <td>{lipid.status}</td>
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
                          {Number(carbohydrate.prescrito_g)} g ({Number(carbohydrate.porPeso)} g/kg)
                        </>
                      ) : (
                        <>
                          {Number(carbohydrate.prescrito_kcal)} ({Number(carbohydrate.percentage)} %) kcal
                        </>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Proteínas</th>
                    <td>
                      {macrossMode == 'percentage' ? (
                        <>
                          {Number(protein.prescrito_g)} g ({Number(protein.porPeso)} g/kg)
                        </>
                      ) : (
                        <>
                          {Number(protein.prescrito_kcal)} ({Number(protein.percentage)} %) kcal
                        </>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Lipídeos</th>
                    <td>
                      {macrossMode == 'percentage' ? (
                        <>
                          {Number(lipid.prescrito_g)} g ({Number(lipid.porPeso)} g/kg)
                        </>
                      ) : (
                        <>
                          {Number(lipid.prescrito_kcal)} ({Number(lipid.percentage)} %) kcal
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
