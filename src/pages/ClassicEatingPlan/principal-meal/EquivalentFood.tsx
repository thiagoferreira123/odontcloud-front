import React from 'react';
import { Col, Row } from 'react-bootstrap';
import useClassicPlan from '../hooks/useClassicPlan';
import { notify } from '../../../components/toast/NotificationIcon';
import { ClassicPlanMealFoodEquivalent } from '../../../types/PlanoAlimentarClassico';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import api from '../../../services/useAxios';
import { parseFloatNumber } from '../../../helpers/MathHelpers';

const EquivalentFood = (props: { equivalentFood: ClassicPlanMealFoodEquivalent; mealId: number }) => {
  const { removeMealFoodEquivalents } = useClassicPlan();

  const removeEquivalentFood = async () => {
    try {
      removeMealFoodEquivalents(props.mealId, props.equivalentFood);

      await api.delete('/plano-alimentar-classico-refeicao-alimento-equivalente/' + props.equivalentFood.id);

      notify('Alimento removido com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao remover alimento', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  return (
    <Row className="g-0 mb-2 hover-row">
      <Col xs="auto">
        <div className="sw-3 d-inline-block d-flex justify-content-start align-items-center h-100">
          <div className="sh-3">
            <CsLineIcons icon="triangle" className="text-tertiary align-top" />
          </div>
        </div>
      </Col>
      <Col>
        <div className="d-flex flex-column pt-0 pb-0 ps-3 pe-4 h-100 justify-content-center">
          <div className="d-flex flex-column">
            <div className="text-alternate mt-n1 lh-1-25">
              {props.equivalentFood.nomeAlimento} - {parseFloatNumber(props.equivalentFood.quantidade)} {props.equivalentFood.medidaCaseiraEquivalente} (
              {parseFloatNumber(props.equivalentFood.gramasUnidade * props.equivalentFood.quantidade)}g)
            </div>
          </div>
        </div>
      </Col>
      <Col xs="auto">
        <div className="d-inline-block d-flex justify-content-end align-items-center h-100">
          <span role="button" tabIndex={0} onClick={() => removeEquivalentFood()}>
            <CsLineIcons icon="bin" className="text-tertiary align-top" />
          </span>
        </div>
      </Col>
    </Row>
  );
};

export default EquivalentFood;
