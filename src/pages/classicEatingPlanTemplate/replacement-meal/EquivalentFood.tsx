import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { ClassicPlanMealFoodEquivalent } from '/src/types/PlanoAlimentarClassico';
import useClassicPlan from '../hooks/useClassicPlan';
import api from '/src/services/useAxios';
import NotificationIcon from '/src/components/toast/NotificationIcon';

const notify = (message: string, title: string, icon: string, status?: string) =>
  toast(<NotificationIcon message={message} title={title} icon={icon} status={status} />);

const EquivalentFood = (props: { equivalentFood: ClassicPlanMealFoodEquivalent; replacementId: number; mealId: number }) => {
  const { removeReplacementMealFoodEquivalents } = useClassicPlan();

  const removeEquivalentFood = async () => {
    try {
      removeReplacementMealFoodEquivalents(props.replacementId, props.mealId, props.equivalentFood);

      await api.delete('/plano-alimentar-classico-refeicao-substituta-alimento-equivalente/' + props.equivalentFood.id);

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
              {props.equivalentFood.nomeAlimento} - {Number(props.equivalentFood.quantidade).toFixed(1)} {props.equivalentFood.medidaCaseiraEquivalente} (
              {Number(props.equivalentFood.gramasUnidade * props.equivalentFood.quantidade).toFixed(1)}g)
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
