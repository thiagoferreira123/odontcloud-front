import React, { useCallback, useEffect, useState } from 'react';
import SearchFood from './SearchFood';
import SelectMeasure from './SelectMeasure';
import useClassicPlan from '../hooks/useClassicPlan';
import { toast } from 'react-toastify';
import { NumericFormat } from 'react-number-format';
import { Button, Col, Collapse, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import EquivalentFood from './EquivalentFood';
import useFilterDisplayStore from '../hooks/useFilterDisplayStore';
import { GripVertical } from 'react-bootstrap-icons';
import { ClassicPlanReplacementMealFood } from '../../../types/PlanoAlimentarClassico';
import api from '../../../services/useAxios';
import { notify } from '../../../components/toast/NotificationIcon';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

interface FoodProps {
  food: ClassicPlanReplacementMealFood;
  sortableEnabled: boolean;
  mealId: number;
  index: number;
}

const Food = (props: FoodProps) => {
  const { updateReplacementMealFood, handleOpenModalEquivalentFood, removeReplacementMealFood } = useClassicPlan();

  const showNutrients = useFilterDisplayStore((state) => state.showNutrients);

  const [quantity, setQuantity] = useState(props.food.quantidade_medida);
  const [showEquivalentFoods, setShowEquivalentFoods] = useState(false);

  const handleChangeFoodQuantity = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (Number(e.target.value) && props.food.quantidade_medida === Number(e.target.value)) return;

      const quantity = Number(e.target.value);
      const gramas = props.food.measure ? Number(props.food.measure.gramas) * quantity : 0;

      const payload: Partial<ClassicPlanReplacementMealFood> = {
        id: props.food.id,
        id_refeicao: props.food.id_refeicao,
        carbohydrate: ((Number(props.food.food?.carboidrato) * Number(gramas)) / 100).toFixed(1),
        protein: ((Number(props.food.food?.proteina) * Number(gramas)) / 100).toFixed(1),
        lipid: ((Number(props.food.food?.lipideos) * Number(gramas)) / 100).toFixed(1),
        calories: ((Number(props.food.food?.energia) * Number(gramas)) / 100).toFixed(1),
        gramas: gramas,
        quantidade_medida: quantity,
        alimentoequivalentes: []
      };

      updateReplacementMealFood(payload, props.mealId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBlurQuantity = async (event: React.FocusEvent<HTMLInputElement>) => {
    if (quantity == Number(event.target.value)) return;

    setQuantity(props.food.quantidade_medida);

    try {
      await api.patch('/plano-alimentar-classico-refeicao-substituta-alimento/' + props.food.id, {
        quantidade_medida: props.food.quantidade_medida,
        gramas: props.food.gramas,
      });

      await api.delete(`/plano-alimentar-classico-refeicao-substituta-alimento/${props.food.id}/equivalents`);
    } catch (error) {
      notify('Erro ao atualizar alimento', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const removeFood = async () => {
    try {
      removeReplacementMealFood(props.food, props.mealId);

      if (typeof props.food.id === 'string') return;
      await api.delete('/plano-alimentar-classico-refeicao-substituta-alimento/' + props.food.id);

      notify('Refeição atualizada com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao atualizar refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const updateFoodOrder = useCallback(async () => {
    if (!props.food.id || !props.food.id_refeicao) return;

    const payload = {
      id_refeicao: props.food.id_refeicao,
      id_refeicao_alimento: props.food.id,
      posicao: props.index,
    };

    try {
      if (props.food.ordens.length && props.food.ordens[0].id)
        api.patch('/plano-alimentar-classico-refeicao-substituta-alimento-order/' + props.food.ordens[0].id, payload);
      else if (typeof props.food.id === 'number') {
        const response = await api.post('/plano-alimentar-classico-refeicao-substituta-alimento-order', payload);

        updateReplacementMealFood({ ...props.food, ordens: [response.data] }, props.mealId);
      }
    } catch (error) {
      console.error(error);
    }
  }, [props.food, props.index, props.mealId, updateReplacementMealFood]);

  useEffect(() => {
    if (!props.sortableEnabled) return;

    updateFoodOrder();
  }, [props.sortableEnabled, updateFoodOrder]);

  return (
    <div>
      <div className="d-flex mt-1">
        <Col xs="auto" className="position-relative pe-4">
          <GripVertical width={24} height={24} className="drag-replacement-meal-food-icon all-scroll position-absolute top-50 start-0 translate-middle-y" />
        </Col>

        <div className="filled w-70">
          <CsLineIcons icon="radish" />
          <SearchFood selectedFood={props.food} mealId={props.mealId} />
        </div>

        <div className="filled w-70">
          <CsLineIcons icon="tea" />
          <SelectMeasure selectedFood={props.food} mealId={props.mealId} />
        </div>

        <div className="filled me-1">
          <CsLineIcons icon="content" />
          < NumericFormat
            className="form-control ms-1"
            placeholder="Qtd"
            value={Number(props.food.quantidade_medida)}
            onChange={handleChangeFoodQuantity}
            onBlur={handleBlurQuantity}
            fixedDecimalScale={false}
            decimalScale={1}
          />
        </div>

        <div>
          <div className="filled me-1 w-100 d-flex">
            <div className="d-flex flex-fill">
              <div className={`row g-2 mx-1 ${!showNutrients ? 'opacity-0' : ''}`}>
                <div className="col">
                  <Form.Control type="text" className="p-2" disabled value={props.food.gramas ?? ''} placeholder="Gramas" readOnly={true} />
                </div>
                <div className="col">
                  <Form.Control type="text" className="p-2" disabled value={props.food.carbohydrate ?? ''} readOnly={true} />
                </div>
                <div className="col">
                  <Form.Control type="text" className="p-2" disabled value={props.food.protein ?? ''} readOnly={true} />
                </div>
                <div className="col">
                  <Form.Control type="text" className="p-2" disabled value={props.food.lipid ?? ''} readOnly={true} />
                </div>
                <div className="col">
                  <Form.Control type="text" className="p-2" disabled value={props.food.calories ?? ''} readOnly={true} />
                </div>
              </div>

              <div className="d-flex align-items-center">
                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-sync-horizontal">Insira alimentos substitutos e equivalentes</Tooltip>}>
                  <Button
                    variant="primary"
                    size="sm"
                    className="btn-icon btn-icon-only mb-1 ms-1"
                    type="button"
                    onClick={() => handleOpenModalEquivalentFood(props.food, props.mealId)}
                  >
                    <CsLineIcons icon="sync-horizontal" />
                  </Button>
                </OverlayTrigger>

                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-bin">Excluir alimento da refeição</Tooltip>}>
                  <Button variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button" onClick={removeFood}>
                    <CsLineIcons icon="bin" />
                  </Button>
                </OverlayTrigger>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Button
          onClick={() => setShowEquivalentFoods(!showEquivalentFoods)}
          size="sm"
          className={`mt-1 ms-4 ${props.food.alimentoequivalentes && props.food.alimentoequivalentes.length ? '' : 'd-none'}`}
        >
          Visualizar alimentos equivalentes
        </Button>
        <Collapse in={showEquivalentFoods}>
          <div className="col-6 p-2">
            {props.food.alimentoequivalentes &&
              props.food.alimentoequivalentes.map((equivalentFood) => (
                <EquivalentFood key={equivalentFood.id} replacementId={Number(props.food.id_refeicao)} mealId={props.mealId} equivalentFood={equivalentFood} />
              ))}
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default React.memo(Food);
